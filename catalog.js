/* The shared link catalog.
 *
 * Lives in two SharePoint lists on the firm site so every signed-in user sees
 * the same links and any of them can add one. links.json ships with the site
 * and is the fallback: it is what renders before Graph answers, when the user
 * is signed out, and if SharePoint is unreachable.
 *
 * Column internal names are resolved from each list's display names rather
 * than assumed. SharePoint rewrites names when columns are created, so
 * "LinkUrl" can land as LinkUrl, LinkUrl0, or an _x00.._ escape. */

(function () {

const SITE_HOST = 'netorgft4790695.sharepoint.com';
const SITE_PATH = '/sites/FirmPolicies';
const LINKS_LIST = 'Portal Links';
const CATEGORIES_LIST = 'Portal Categories';
const SCOPES = ['Sites.ReadWrite.All'];
const GRAPH = 'https://graph.microsoft.com/v1.0';

/* Display name -> the key this app uses. */
const LINK_COLUMNS = {
  Title: 'name', LinkId: 'id', LinkUrl: 'url', LinkCategory: 'category',
  LinkColor: 'color', LinkDescription: 'description', LinkLogo: 'logo',
  HeroGroup: 'heroGroup',
};
/* Columns the site works without. HeroGroup is here so a tenant that has not
 * added it yet still loads, just without firm-wide hero membership. */
const OPTIONAL_COLUMNS = new Set(['description', 'logo', 'sortOrder', 'heroGroup']);
const CATEGORY_COLUMNS = {
  Title: 'name', CategoryId: 'id', CategoryColor: 'color', SortOrder: 'sortOrder',
};

let bundled = { version: 1, categories: [], defaultMostUsed: [], links: [] };
let catalog = bundled;
let source = 'bundled';
let lastError = null;
let site = null;                       // { id }
let lists = {};                        // { links: {id, fields}, categories: {...} }
const listeners = new Set();

const notify = () => listeners.forEach(fn => { try { fn(catalog, source); } catch { /* listener's problem */ } });

async function graph(path, init) {
  const token = await window.twlfAuth.acquireGraphToken(SCOPES);
  if (!token?.accessToken) throw new Error('No Graph token (a sign-in redirect may be in flight).');
  const response = await fetch(path.startsWith('http') ? path : GRAPH + path, {
    ...init,
    headers: {
      Authorization: `Bearer ${token.accessToken}`,
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...(init?.headers || {}),
    },
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`${init?.method || 'GET'} ${path} -> ${response.status} ${detail.slice(0, 180)}`);
  }
  return response.status === 204 ? null : response.json();
}

/* Map each list's display names onto the internal names Graph expects. */
async function resolveList(displayName, columnMap) {
  const found = await graph(`/sites/${site.id}/lists?$select=id,displayName`);
  const match = (found.value || []).find(list => list.displayName === displayName);
  if (!match) throw new Error(`List "${displayName}" not found on ${SITE_PATH}.`);
  const columns = await graph(`/sites/${site.id}/lists/${match.id}/columns?$select=name,displayName,readOnly`);
  const fields = {};
  for (const column of columns.value || []) {
    const key = columnMap[column.displayName];
    // Every list carries computed twins of Title — LinkTitle, LinkTitleNoMenu —
    // that share its display name and reject writes. Take the writable one, and
    // prefer a column whose internal name matches its display name exactly.
    if (!key || column.readOnly) continue;
    if (!fields[key] || column.name === column.displayName) fields[key] = column.name;
  }
  const missing = Object.values(columnMap).filter(key => !fields[key] && !OPTIONAL_COLUMNS.has(key));
  if (missing.length) throw new Error(`List "${displayName}" is missing columns: ${missing.join(', ')}.`);
  return { id: match.id, fields };
}

const itemsOf = async list =>
  (await graph(`/sites/${site.id}/lists/${list.id}/items?$expand=fields&$top=999`)).value || [];

function toRecord(item, list, keys) {
  const out = { itemId: item.id };
  for (const key of keys) if (list.fields[key]) out[key] = item.fields?.[list.fields[key]] ?? '';
  return out;
}

const toFields = (record, list, keys) => keys.reduce((fields, key) => {
  if (list.fields[key] && record[key] !== undefined && record[key] !== '') fields[list.fields[key]] = record[key];
  return fields;
}, {});

const LINK_KEYS = ['name','id','url','category','color','description','logo','heroGroup'];
const CATEGORY_KEYS = ['name','id','color','sortOrder'];

async function pull() {
  site = await graph(`/sites/${SITE_HOST}:${SITE_PATH}?$select=id`);
  lists.links = await resolveList(LINKS_LIST, LINK_COLUMNS);
  lists.categories = await resolveList(CATEGORIES_LIST, CATEGORY_COLUMNS);
  const [linkItems, categoryItems] = await Promise.all([itemsOf(lists.links), itemsOf(lists.categories)]);
  const links = linkItems.map(item => toRecord(item, lists.links, LINK_KEYS)).filter(link => link.id && link.url);
  const categories = categoryItems.map(item => toRecord(item, lists.categories, CATEGORY_KEYS)).filter(category => category.id)
    .sort((a, b) => (Number(a.sortOrder) || 0) - (Number(b.sortOrder) || 0));
  // Empty lists are not an error — they just have not been seeded yet.
  if (!links.length && !categories.length) { source = 'empty'; catalog = bundled; return; }
  catalog = { version: 1, categories, links, defaultMostUsed: bundled.defaultMostUsed };
  source = 'sharepoint';
}

window.twlfCatalog = {
  get: () => catalog,
  source: () => source,
  error: () => lastError,
  site: () => `https://${SITE_HOST}${SITE_PATH}`,
  onChange: fn => { listeners.add(fn); return () => listeners.delete(fn); },
  writable: () => source === 'sharepoint' || source === 'empty',

  async load() {
    try {
      const response = await fetch(`links.json?v=${Date.now()}`);
      if (response.ok) { bundled = await response.json(); catalog = bundled; }
    } catch (error) { lastError = error; }
    notify();
    return catalog;
  },

  /* Called once auth settles, and again after an interactive sign-in. */
  async sync() {
    if (!window.twlfAuth?.getAccount()) { source = 'bundled'; notify(); return catalog; }
    try { await pull(); lastError = null; }
    catch (error) { lastError = error; source = 'bundled'; catalog = bundled; }
    notify();
    return catalog;
  },

  async addLink(link) {
    const created = await graph(`/sites/${site.id}/lists/${lists.links.id}/items`, {
      method: 'POST', body: JSON.stringify({ fields: toFields(link, lists.links, LINK_KEYS) }),
    });
    await this.sync();
    return created;
  },

  async updateLink(itemId, patch, { quiet = false } = {}) {
    const fields = toFields(patch, lists.links, LINK_KEYS);
    // An empty heroGroup means "no card", which toFields would otherwise drop.
    if (patch.heroGroup === '' && lists.links.fields.heroGroup) fields[lists.links.fields.heroGroup] = '';
    await graph(`/sites/${site.id}/lists/${lists.links.id}/items/${itemId}/fields`, {
      method: 'PATCH', body: JSON.stringify(fields),
    });
    if (!quiet) await this.sync();
  },

  hasHeroColumn: () => Boolean(lists.links && lists.links.fields.heroGroup),
  bundled: () => bundled,

  /* Fill in descriptions from the bundled catalogue. Only ever writes where
   * the list has none, so anything written by hand is left alone. */
  async publishDescriptions(byLinkId, onProgress) {
    if (!lists.links?.fields?.description) throw new Error('The Portal Links list has no LinkDescription column.');
    const targets = catalog.links.filter(link =>
      link.itemId && !String(link.description || '').trim() && byLinkId[link.id]);
    let done = 0;
    for (const link of targets) {
      await this.updateLink(link.itemId, { description: byLinkId[link.id] }, { quiet: true });
      onProgress?.(++done, targets.length);
    }
    await this.sync();
    return targets.length;
  },

  /* Write the current hero membership to the list so it is the same for
   * everyone. Sequential: SharePoint throttles bursts and this runs rarely. */
  async publishHeroGroups(assignments, onProgress) {
    if (!lists.links?.fields?.heroGroup) throw new Error('The Portal Links list has no HeroGroup column yet.');
    const entries = Object.entries(assignments);
    let done = 0;
    for (const [itemId, group] of entries) {
      await this.updateLink(itemId, { heroGroup: group }, { quiet: true });
      onProgress?.(++done, entries.length);
    }
    await this.sync();
    return entries.length;
  },

  async removeLink(itemId) {
    await graph(`/sites/${site.id}/lists/${lists.links.id}/items/${itemId}`, { method: 'DELETE' });
    await this.sync();
  },

  async addCategory(category) {
    await graph(`/sites/${site.id}/lists/${lists.categories.id}/items`, {
      method: 'POST', body: JSON.stringify({ fields: toFields(category, lists.categories, CATEGORY_KEYS) }),
    });
    await this.sync();
  },

  /* One-time fill of empty lists from links.json. Sequential on purpose:
   * SharePoint throttles bursts, and this runs once. */
  async seed(onProgress) {
    if (!site) throw new Error('SharePoint is not connected.');
    const total = bundled.categories.length + bundled.links.length;
    let done = 0;
    for (const [index, category] of bundled.categories.entries()) {
      await graph(`/sites/${site.id}/lists/${lists.categories.id}/items`, {
        method: 'POST',
        body: JSON.stringify({ fields: toFields({ ...category, sortOrder: index + 1 }, lists.categories, CATEGORY_KEYS) }),
      });
      onProgress?.(++done, total);
    }
    for (const link of bundled.links) {
      await graph(`/sites/${site.id}/lists/${lists.links.id}/items`, {
        method: 'POST', body: JSON.stringify({ fields: toFields(link, lists.links, LINK_KEYS) }),
      });
      onProgress?.(++done, total);
    }
    await this.sync();
    return total;
  },
};

})();
