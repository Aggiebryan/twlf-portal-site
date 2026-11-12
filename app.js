/* The catalog (links + categories) is shared: it comes from links.json and is
 * the same for everyone. Everything personal — card sizes, ordering, column
 * count, theme, Most Used, which modules are on — comes from window.twlfPrefs,
 * which syncs to the signed-in user's OneDrive app folder. */


/* ---------------------------------------------------------------
 * HERO ROW — edit these two lists to choose what each card holds.
 * "Most Used" is not listed: it is measured from real clicks.
 * --------------------------------------------------------------- */
const COURT_LINKS = ['t3', 't10', 't18', 't13', 't15', 't20', 't16', 't22'];
const WOODLANDS_LAW = ['t27', 't31', 't30', 't4', 't7', 't1', 't2'];

/* Appearance is per user and editable in Settings; these are the firm's
 * starting points. Size sets how many tiles fit, and the row count stays at
 * two, so the slot count follows from it. */
const HERO_SIZES = {
  small:  { cols: 5, logo: 30, label: 'Small' },
  medium: { cols: 4, logo: 38, label: 'Medium' },
  large:  { cols: 3, logo: 50, label: 'Large' },
};
const HERO_ROWS = 2;
const HERO_DEFAULTS = {
  'most-used': { name: 'Most Used',     color: '#14b8a6', ink: '#08131a', opacity: 42, size: 'medium' },
  'court':     { name: 'Court Links',   color: '#ec4899', ink: '#08131a', opacity: 42, size: 'medium' },
  'woodlands': { name: 'Woodlands Law', color: '#f59e0b', ink: '#08131a', opacity: 42, size: 'medium' },
};
const HERO_SEED = { court: COURT_LINKS, woodlands: WOODLANDS_LAW };
const heroKeys = () => Object.keys(HERO_DEFAULTS);
const catalogHeroInUse = () => links.some(link => link.heroGroup);
const heroMembers = key => (catalogHeroInUse()
  ? links.filter(link => link.heroGroup === key).map(link => String(link.id))
  : ((prefs.heroMembers || {})[key] || HERO_SEED[key] || []).map(String));
function setHeroMembership(id, key) {
  const members = { court: heroMembers('court'), woodlands: heroMembers('woodlands') };
  for (const k of Object.keys(members)) members[k] = members[k].filter(x => x !== String(id));
  if (members[key]) members[key] = [String(id), ...members[key]];
  prefs.heroMembers = members;
  return members;
}
const heroGroupOf = id => {
  const link = links.find(item => String(item.id) === String(id));
  if (catalogHeroInUse()) return (link && link.heroGroup) || '';
  return heroKeys().find(k => k !== 'most-used' && heroMembers(k).includes(String(id))) || '';
};
/* A link can be barred from the Most Used card however often it is opened —
 * social accounts and the like. Clicks are still counted, the tile is just
 * never offered. Firm-wide when the list has a NoMostUsed column, otherwise
 * kept per person, exactly as hero membership works. */
const truthy = value => value === true || /^(1|true|yes|y)$/i.test(String(value ?? ''));
const catalogBlockInUse = () => window.twlfCatalog.hasBlockColumn() || links.some(link => truthy(link.noMostUsed));
const blockedFromMostUsed = () => {
  const mine = (prefs.mostUsedBlocked || []).map(String);
  if (!catalogBlockInUse()) return mine;
  // Your own links never reach SharePoint, so their block always stays local.
  const firm = links.filter(link => truthy(link.noMostUsed)).map(link => String(link.id));
  const local = mine.filter(id => isPersonalLink(links.find(link => String(link.id) === id)));
  return [...firm, ...local];
};
const isBlockedFromMostUsed = id => blockedFromMostUsed().includes(String(id));
function setMostUsedBlock(id, blocked) {
  const next = blockedFromMostUsed().filter(x => x !== String(id));
  if (blocked) next.unshift(String(id));
  prefs.mostUsedBlocked = next;
  return next;
}

const heroStyle = key => ({ ...HERO_DEFAULTS[key], ...((prefs.heroGroups || {})[key] || {}) });
const heroSlots = key => {
  const size = HERO_SIZES[heroStyle(key).size] || HERO_SIZES.medium;
  return size.cols * HERO_ROWS;
};

let catalog = { version: 1, categories: [], defaultMostUsed: [], links: [] };
let prefs = window.twlfPrefs.get();
let categories = [];
let links = [];
let mostUsed = [];
let mostUsedOrder = [];
let categoryOrder = ['most-used'];
let linkOrder = {};
let sizes = {};
let displayColumns = 2;
let usage = {};

let active = 'all';
let query = '';
let editingId = null;
let editingContext = null;

const isPersonalLink = link => !link?.itemId && String(link?.id || '').startsWith('custom-');
const catalogWritable = () => window.twlfCatalog.writable();
const categoryById = id => categories.find(category => category.id === id);
const hostname = url => { try { return new URL(url).hostname.replace(/^www\./,''); } catch { return url; } };
const officialLogoExtensions = {
  t2:'png',t3:'png',t4:'png',t5:'png',t7:'png',t11:'svg',t12:'png',t16:'png',t18:'png',
  t19:'png',t20:'png',t21:'png',t22:'png',t23:'png',t32:'png',t35:'jpg',t36:'png',t39:'png',t40:'png',t42:'png',
  t43:'png',t45:'png',t48:'png',t56:'png',t57:'svg',t58:'png',t59:'png',t60:'png',
  t61:'png',t62:'jpg',t64:'png',t72:'png',t73:'png',t74:'png',t75:'png',
  t76:'jpg',t77:'png',t78:'png',t80:'png',t81:'jpg',t82:'png'
};
const officialLogo = id => `logos/${id}.${officialLogoExtensions[id] || 'ico'}`;

/* Where to look for a link's icon, best first. A custom address wins, then the
 * logo bundled with the site, then the site's own favicon, then DuckDuckGo's
 * icon service — which 404s for a domain it has nothing for, so a site with no
 * icon anywhere still falls through to the initials rather than a grey globe.
 * Each candidate is tried in turn as an <img> src; the first that decodes wins. */
function iconCandidates(link) {
  const chain = [];
  if (link.logo) chain.push(link.logo);
  chain.push(officialLogo(link.id));
  const host = hostname(link.url);
  if (host && host.includes('.') && !/\s/.test(host)) {
    if (!link.logo) chain.push(`https://${host}/favicon.ico`);
    chain.push(`https://icons.duckduckgo.com/ip3/${host}.ico`);
  }
  return chain.filter((url, index) => chain.indexOf(url) === index);
}
/* src plus the rest of the chain, for the error handler below. */
function iconAttrs(link) {
  const [first, ...rest] = iconCandidates(link);
  return `src="${escapeHtml(first)}" data-icon-chain="${escapeHtml(JSON.stringify(rest))}"`;
}

/* An <img> error does not bubble, so it is caught on the way down instead of
 * with an inline onerror per card. */
document.addEventListener('error', event => {
  const img = event.target;
  if (!(img instanceof HTMLImageElement) || !img.hasAttribute('data-icon-chain')) return;
  let chain = [];
  try { chain = JSON.parse(img.dataset.iconChain) || []; } catch { chain = []; }
  const next = chain.shift();
  img.dataset.iconChain = JSON.stringify(chain);
  // Out of candidates: stand down and let whatever is behind the img show.
  if (!next) { img.style.display = 'none'; img.style.visibility = 'hidden'; return; }
  img.src = next;
}, true);
document.addEventListener('load', event => {
  const img = event.target;
  if (!(img instanceof HTMLImageElement) || !img.hasAttribute('data-icon-chain')) return;
  if (img.naturalWidth > 1) img.parentNode?.classList.add('has-logo');
  else img.dispatchEvent(new Event('error'));
}, true);

/* Try a URL as an image and report whether it actually loaded. Nothing is read
 * back from the response, so this works cross-origin with no CORS headers. */
const probeIcon = (url, timeout = 3500) => new Promise(resolve => {
  const img = new Image();
  const finish = ok => { img.onload = img.onerror = null; clearTimeout(timer); resolve(ok); };
  const timer = setTimeout(() => finish(false), timeout);
  img.onload = () => finish(img.naturalWidth > 1);
  img.onerror = () => finish(false);
  img.src = url;
});
/* Settle on a real icon address at the moment a link is added, so the whole
 * firm gets it from the catalog instead of each browser hunting for it. */
async function findIcon(url) {
  const host = hostname(url);
  if (!host || !host.includes('.')) return '';
  for (const candidate of [`https://${host}/favicon.ico`, `https://icons.duckduckgo.com/ip3/${host}.ico`]) {
    if (await probeIcon(candidate)) return candidate;
  }
  return '';
}
/* Quotes are escaped as well as the angle brackets, because almost every use of
 * this is inside an attribute — a link name or a JSON payload holding a " would
 * otherwise close the attribute early and spill into the markup. */
const escapeHtml = value => {
  const node = document.createElement('div');
  node.textContent = value;
  return node.innerHTML.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
};

const isMostUsed = id => mostUsed.includes(String(id)) && !isBlockedFromMostUsed(id);
function sizeFor(link, context) {
  const entry = sizes[link.id] || {};
  const value = context === 'most-used' ? (entry.mostUsed || entry.category) : entry.category;
  return ['small','standard','large'].includes(value) ? value : 'standard';
}

/* Pull the personal layer into the working state. Called on boot and again
 * whenever the settings store swaps a local copy for the account's copy. */
function adoptPrefs() {
  prefs = window.twlfPrefs.get();
  catalog = window.twlfCatalog.get();
  categories = [...catalog.categories, ...(prefs.customCategories || [])];
  links = [...catalog.links, ...(prefs.customLinks || [])];
  mostUsed = (prefs.mostUsed || catalog.defaultMostUsed || []).map(String);
  mostUsedOrder = (prefs.mostUsedOrder || []).map(String);
  linkOrder = prefs.linkOrder || {};
  sizes = prefs.sizes || {};
  usage = prefs.usage || {};
  displayColumns = Number(prefs.displayColumns) || 2;
  const known = categories.map(category => category.id);
  const saved = (prefs.categoryOrder || []).filter(id => known.includes(id));
  categoryOrder = ['most-used', ...saved.filter(id => id !== 'most-used'),
    ...known.filter(id => id !== 'most-used' && !saved.includes(id))];
  applyTheme(prefs.theme || 'dark');
}

function save() {
  window.twlfPrefs.set({
    customLinks: links.filter(isPersonalLink),
    customCategories: prefs.customCategories || [],
    mostUsed, mostUsedOrder, categoryOrder, linkOrder, sizes, displayColumns, usage,
    heroGroups: prefs.heroGroups, heroMembers: prefs.heroMembers,
    mostUsedBlocked: prefs.mostUsedBlocked,
    theme: document.documentElement.dataset.theme,
    modules: prefs.modules,
  });
  document.querySelector('#reset').hidden = false;
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  document.querySelector('#themeIcon').textContent = theme === 'dark' ? '☀' : '☾';
}

function linkCard(link, index, context) {
  const safeName=escapeHtml(link.name), safeUrl=escapeHtml(link.url), safeHost=escapeHtml(hostname(link.url));
  const size = sizeFor(link, context);
  const sourceCategory=categoryById(link.category);
  const description=escapeHtml(link.description || `${sourceCategory?.name || 'Portal'} resource`);
  // A shared catalog link can be dropped from your own Most Used, but only a
  // personal link can be deleted outright — the catalog belongs to everyone.
  const removable = context === 'most-used' || isPersonalLink(link) || (link.itemId && catalogWritable());
  const removeTitle = context==='most-used' ? 'Remove from Most Used'
    : isPersonalLink(link) ? 'Remove your link' : 'Remove for the whole firm';
  return `<article class="link-card size-${size} ${context==='most-used'?'most-used-card':''}" data-link="${link.id}" data-context="${context}" style="--accent:${link.color};--source-color:${sourceCategory?.color||link.color};--delay:${Math.min(index,16)*18}ms">
    <button class="card-drag" draggable="true" aria-label="Move ${safeName}" title="Drag to reorder">⠿</button>
    ${removable?`<button class="remove" data-remove="${link.id}" data-remove-context="${context}" aria-label="Remove ${safeName}" title="${removeTitle}">×</button>`:''}
    <button class="edit" data-edit="${link.id}" data-edit-context="${context}" aria-label="Edit ${safeName}" title="Edit size and Most Used">✎</button>
    <a href="${safeUrl}" target="_blank" rel="noreferrer" data-track="${link.id}">
      <span class="logo"><span class="fallback">${safeName.slice(0,2).toUpperCase()}</span><img ${iconAttrs(link)} alt=""></span>
      <span class="link-copy"><strong>${safeName}</strong><small class="link-address">${safeHost}</small><small class="description">${description}</small></span><span class="open">↗</span>
    </a></article>`;
}

function matching(categoryId) {
  const found=links.filter(link => (categoryId==='most-used'?isMostUsed(link.id):link.category===categoryId) && `${link.name} ${hostname(link.url)}`.toLowerCase().includes(query));
  const order = categoryId==='most-used' ? mostUsedOrder : (linkOrder[categoryId] || []);
  if (!order.length) return found;
  return [...found].sort((a,b)=>{const ai=order.indexOf(String(a.id)),bi=order.indexOf(String(b.id));return (ai<0?9999:ai)-(bi<0?9999:bi)});
}

function renderHero() {
  const byId = Object.fromEntries(links.map(link => [String(link.id), link]));
  // Counted for ranking only — the tally is deliberately not shown on the tile.
  // Barred links drop out here, so a heavily used one simply never surfaces.
  const barred = new Set(blockedFromMostUsed());
  const ranked = Object.keys(usage)
    .filter(id => byId[id] && !barred.has(String(id)))
    .sort((a, b) => usage[b] - usage[a]);
  const sources = {
    'most-used': [...ranked, ...mostUsed.filter(id => !ranked.includes(id) && !barred.has(String(id)))],
    'court': heroMembers('court'),
    'woodlands': heroMembers('woodlands'),
  };
  document.querySelector('#hero').innerHTML = heroKeys().map(key => {
    const style = heroStyle(key);
    const size = HERO_SIZES[style.size] || HERO_SIZES.medium;
    const items = (sources[key] || []).map(id => byId[String(id)]).filter(Boolean).slice(0, heroSlots(key));
    const body = items.length
      ? `<div class="feature-links">${items.map(link => `
          <a class="mini" href="${escapeHtml(link.url)}" target="_blank" rel="noreferrer"
             data-track="${escapeHtml(String(link.id))}" title="${escapeHtml(link.name)}">
            <span class="mini-plate"><img ${iconAttrs(link)} alt=""></span>
            <span>${escapeHtml(link.name)}</span>
          </a>`).join('')}</div>`
      : '<p class="empty-note">Nothing picked for this group yet.</p>';
    return `<article class="feature" style="--accent:${escapeHtml(style.color)};--badge-ink:${escapeHtml(style.ink || '#08131a')};--wash:${Number(style.opacity) || 0}%;--hero-cols:${size.cols};--mini-logo:${size.logo}px">
      <span class="badge">${escapeHtml(style.name)}</span>${body}</article>`;
  }).join('');
}

/* Settings: name, colour, opacity and tile size for each hero card. */
function renderHeroSettings() {
  const host = document.querySelector('#heroSettings');
  if (!host) return;
  host.innerHTML = heroKeys().map(key => {
    const s = heroStyle(key);
    return `<div class="hero-row" data-hero="${key}">
      <input class="hero-name" type="text" value="${escapeHtml(s.name)}" maxlength="28" aria-label="Card name">
      <input class="hero-color" type="color" value="${escapeHtml(s.color)}" aria-label="Accent colour" title="Accent colour">
      <input class="hero-ink" type="color" value="${escapeHtml(s.ink || '#08131a')}" aria-label="Title text colour" title="Title text colour">
      <select class="hero-size" aria-label="Tile size">${Object.entries(HERO_SIZES)
        .map(([k, v]) => `<option value="${k}"${k === s.size ? ' selected' : ''}>${v.label}</option>`).join('')}</select>
      <label class="hero-opacity">TINT <output>${Number(s.opacity)}%</output>
        <input type="range" min="0" max="80" step="2" value="${Number(s.opacity)}" aria-label="Tint strength"></label>
    </div>`;
  }).join('');
}

/* “Clio”, “WestLaw” and 2 more — for telling you which links need attention
 * without printing a wall of names. */
const nameList = (items, cap = 3) => {
  const names = items.map(item => `“${item.name}”`);
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  if (names.length <= cap) return `${names.slice(0, -1).join(', ')} and ${names.at(-1)}`;
  return `${names.slice(0, cap).join(', ')} and ${names.length - cap} more`;
};

/* This copies the descriptions shipped in links.json onto the matching rows in
 * SharePoint. It is a backfill for the links the site was built with, and it
 * can only ever cover those: a link added through the portal has an id that is
 * in no file, so there is no text to copy and it has to be typed. */
document.addEventListener('click', async event => {
  if (!event.target.closest('#publishDescriptions')) return;
  const button = document.querySelector('#publishDescriptions');
  const byLinkId = Object.fromEntries(
    (window.twlfCatalog.bundled().links || [])
      .filter(link => (link.description || '').trim())
      .map(link => [link.id, link.description]));
  const blank = links.filter(l => l.itemId && !String(l.description || '').trim());
  const copyable = blank.filter(l => byLinkId[l.id]);
  const mustType = blank.filter(l => !byLinkId[l.id]);
  const typeHint = also => (mustType.length
    ? ` ${nameList(mustType)} ${mustType.length === 1 ? 'has' : 'have'} no description${also ? ' either' : ''}, and there is no firm text on file for ${mustType.length === 1 ? 'it' : 'them'} — open the ✎ editor and write one.`
    : '');

  if (!copyable.length) {
    notice(mustType.length
      ? `Nothing to copy.${typeHint(false)}`
      : 'Every firm link already has a description.', Boolean(mustType.length));
    return;
  }
  if (!window.confirm(`Write descriptions for ${copyable.length} links that have none? Existing descriptions are left alone.`)) return;
  button.disabled = true;
  try {
    const n = await window.twlfCatalog.publishDescriptions(byLinkId,
      (done, total) => { button.textContent = `Writing ${done}/${total}…`; });
    notice(`Added descriptions to ${n} firm ${n === 1 ? 'link' : 'links'}.${typeHint(true)}`);
  } catch (error) { notice(`Could not write descriptions: ${error.message}`, true); }
  button.disabled = false; button.textContent = 'Add missing link descriptions';
  render();
});

function updatePublishHero() {
  const button = document.querySelector('#publishHero');
  if (!button) return;
  button.hidden = !(catalogWritable()
    && (window.twlfCatalog.hasHeroColumn() || window.twlfCatalog.hasBlockColumn()));
  const descriptions = document.querySelector('#publishDescriptions');
  if (descriptions) descriptions.hidden = !catalogWritable();
}

document.addEventListener('click', async event => {
  if (!event.target.closest('#publishHero')) return;
  const button = document.querySelector('#publishHero');
  if (!window.confirm('Publish these hero cards to the whole firm? Everyone will see the same card membership and the same Most Used exclusions.')) return;
  // Send every catalogue link, so links no longer in a card — or no longer
  // barred from Most Used — are cleared too.
  const barred = new Set(blockedFromMostUsed());
  const assignments = {};
  for (const link of links) {
    if (!link.itemId) continue;
    assignments[link.itemId] = { heroGroup: heroGroupOf(link.id), noMostUsed: barred.has(String(link.id)) };
  }
  button.disabled = true;
  try {
    const n = await window.twlfCatalog.publishHeroGroups(assignments,
      (done, total) => { button.textContent = `Publishing ${done}/${total}…`; });
    notice(`Hero cards and Most Used rules published to the firm across ${n} links.`);
  } catch (error) { notice(`Could not publish hero cards: ${error.message}`, true); }
  button.disabled = false; button.textContent = 'Publish hero cards to the firm';
  renderHero();
});

function updateHero(key, patch) {
  prefs.heroGroups = { ...(prefs.heroGroups || {}), [key]: { ...heroStyle(key), ...patch } };
  window.twlfPrefs.set({ heroGroups: prefs.heroGroups });
  document.querySelector('#reset').hidden = false;
  renderHero();
}

document.addEventListener('input', event => {
  const row = event.target.closest('.hero-row');
  if (!row) return;
  const key = row.dataset.hero;
  if (event.target.classList.contains('hero-name')) updateHero(key, { name: event.target.value });
  if (event.target.classList.contains('hero-color')) updateHero(key, { color: event.target.value });
  if (event.target.classList.contains('hero-ink')) updateHero(key, { ink: event.target.value });
  if (event.target.type === 'range') {
    row.querySelector('.hero-opacity output').textContent = `${event.target.value}%`;
    updateHero(key, { opacity: Number(event.target.value) });
  }
});
document.addEventListener('change', event => {
  const row = event.target.closest('.hero-row');
  if (row && event.target.classList.contains('hero-size')) updateHero(row.dataset.hero, { size: event.target.value });
});

function render() {
  document.documentElement.style.setProperty('--display-columns',displayColumns);
  const nav = [{id:'all',name:'All'},...categories];
  document.querySelector('#categoryNav').innerHTML = nav.map(item => `<button class="${active===item.id?'active':''}" data-category="${item.id}">${item.name}<span>${item.id==='all'?links.length:item.id==='most-used'?links.filter(link=>isMostUsed(link.id)).length:links.filter(link=>link.category===item.id).length}</span></button>`).join('');
  // The hero already shows Most Used, so the dashboard does not repeat it as a
  // panel. Selecting it from the nav still opens it on its own.
  const orderedCategories = categoryOrder.map(id => categoryById(id)).filter(Boolean)
    .filter(category => category.id !== 'most-used');
  const shownCategories = active === 'all' ? orderedCategories : categories.filter(category => category.id === active);
  const sections = shownCategories.map(category => ({category,items:matching(category.id)})).filter(section => section.items.length || !query);
  const count = sections.reduce((sum,section) => sum + section.items.length,0);
  document.querySelector('#pageTitle').textContent = active === 'all' ? 'All resources' : categoryById(active)?.name || '';
  document.querySelector('#pageCount').textContent = `${count} ${count===1?'link':'links'}`;
  document.querySelector('#content').className = active === 'all' ? 'dashboard-grid masonry-board' : 'single-category';
  document.querySelector('#content').innerHTML = sections.map(({category,items}) => `<section class="category-panel ${category.id==='most-used'?'pinned-panel':''}" data-panel="${category.id}" style="--category:${category.color}"><header draggable="${active==='all'&&category.id!=='most-used'}"><span class="drag-handle" title="${category.id==='most-used'?'Pinned':'Drag to move category'}">${category.id==='most-used'?'⌖':'⠿'}</span><span class="category-dot"></span><h2>${category.name}</h2><small>${items.length}</small></header><div class="link-grid">${items.map((link,index)=>linkCard(link,index,category.id)).join('')}</div></section>`).join('');
  document.querySelector('#empty').hidden = count > 0;
  document.querySelectorAll('.rail-btn[data-category]').forEach(button =>
    button.toggleAttribute('aria-current', button.dataset.category === active));
  if (active === 'all' && !query) renderHero(); else document.querySelector('#hero').innerHTML = '';
}

document.addEventListener('click', event => {
  const categoryButton = event.target.closest('[data-category]');
  if (categoryButton) { active=categoryButton.dataset.category; render(); }
  if (event.target.closest('[data-add]')) openModal();
  const removeButton = event.target.closest('[data-remove]');
  if (removeButton) {
    event.preventDefault();
    const link=links.find(item=>String(item.id)===removeButton.dataset.remove);
    const fromMostUsed=removeButton.dataset.removeContext==='most-used';
    const firmWide=!fromMostUsed&&!isPersonalLink(link)&&link?.itemId&&catalogWritable();
    const question=fromMostUsed?`Remove “${link?.name}” from your Most Used?`
      :firmWide?`Remove “${link?.name}” from the shared catalog? This removes it for everyone at the firm.`
      :`Remove “${link?.name}” from your portal?`;
    if(link && window.confirm(question)){
      if(fromMostUsed){mostUsed=mostUsed.filter(id=>id!==String(link.id));save();render()}
      else if(isPersonalLink(link)){links=links.filter(item=>String(item.id)!==removeButton.dataset.remove);save();render()}
      else if(link.itemId&&catalogWritable()){
        window.twlfCatalog.removeLink(link.itemId)
          .then(()=>{notice(`“${link.name}” removed for the whole firm.`)})
          .catch(error=>notice(`Could not remove the link: ${error.message}`,true));
      }
    }
  }
  const editButton = event.target.closest('[data-edit]');
  if (editButton) { event.preventDefault(); openModal(links.find(link=>String(link.id)===editButton.dataset.edit),editButton.dataset.editContext); }
});

document.addEventListener('click', event => {
  const opened = event.target.closest('[data-track]');
  if (!opened) return;
  usage = { ...usage, [opened.dataset.track]: (usage[opened.dataset.track] || 0) + 1 };
  // Persist directly: opening a link is not a layout change, so it should not
  // light up "Restore default layout" the way save() does.
  window.twlfPrefs.set({ usage });
});

document.querySelector('#search').addEventListener('input', event => { query=event.target.value.trim().toLowerCase(); render(); });
document.addEventListener('keydown', event => { if(event.key==='/' && document.activeElement.tagName!=='INPUT'){event.preventDefault();document.querySelector('#search').focus()} });

/* Shared fields are locked on catalog links: name, URL, logo and category are
 * the same for the whole firm, and there is no shared write path yet. Size and
 * Most Used stay editable because they are personal. */
function setSharedFieldsEnabled(enabled) {
  const form=document.querySelector('#form');
  ['name','url','logo','description','category'].forEach(field=>{
    const input=form.elements[field];
    if(input){input.disabled=!enabled;input.closest('label')?.classList.toggle('locked-field',!enabled)}
  });
  document.querySelector('#sharedNote').hidden = enabled;
}

function openModal(link=null,context=null){
  editingId=link?.id||null;editingContext=context;
  const form=document.querySelector('#form');form.reset();
  const shared = Boolean(link) && !isPersonalLink(link) && !catalogWritable();
  document.querySelector('#modalTitle').textContent=link?'Edit portal link':'Add a portal link';
  document.querySelector('#modalIntro').textContent=link?'Card size, hero card and Most Used are set here.':'Adds a link to your own portal. Firm-wide links are managed in the shared catalog.';
  document.querySelector('#saveLink').textContent=link?'Save changes':'Add link';
  if(link){
    form.elements.name.value=link.name;form.elements.url.value=link.url;
    form.elements.logo.value=link.logo||'';form.elements.description.value=link.description||'';
    form.elements.category.value=link.category;
    form.elements.size.value=sizeFor(link,'category');
    const group=heroGroupOf(link.id);
    [...form.elements.heroGroup].forEach(radio=>{radio.checked=radio.value===group});
    form.elements.noMostUsed.checked=isBlockedFromMostUsed(link.id);
  }
  setSharedFieldsEnabled(!shared);
  // The radios carry whatever the cards are currently called.
  document.querySelectorAll('[data-hero-label]').forEach(span=>{
    span.textContent = heroStyle(span.dataset.heroLabel).name;
  });
  document.querySelector('#backdrop').hidden=false;
}
const closeModal=()=>{document.querySelector('#backdrop').hidden=true;editingId=null;editingContext=null};
document.querySelector('#close').onclick=closeModal; document.querySelector('#cancel').onclick=closeModal;
document.querySelector('#backdrop').addEventListener('click',event=>{if(event.target.id==='backdrop')closeModal()});
function populateCategorySelect(){document.querySelector('#categorySelect').innerHTML=categories.filter(category=>category.id!=='most-used').map(category=>`<option value="${category.id}">${category.name}</option>`).join('')}

document.querySelector('#form').addEventListener('submit',async event=>{
  event.preventDefault();
  const data=Object.fromEntries(new FormData(event.target));
  const existing=editingId?links.find(link=>String(link.id)===String(editingId)):null;
  const writable=catalogWritable();
  const personal=existing?isPersonalLink(existing):!writable;
  const id=existing?existing.id:(writable?`s-${Date.now()}`:`custom-${Date.now()}`);
  // A catalogue link opened while the shared store is read-only has its shared
  // fields disabled, and a disabled field is absent from FormData — so the
  // personal half of this form must still work without them.
  const sharedLocked=Boolean(existing)&&!isPersonalLink(existing)&&!writable;

  // Card size is always personal. Hero membership goes to SharePoint when the
  // shared catalogue is writable, so the firm sees one set of cards.
  sizes={...sizes,[id]:{category:data.size||'standard'}};
  const group=data.heroGroup||'';
  const barred=data.noMostUsed==='on';
  const toCatalog=!personal&&!sharedLocked&&window.twlfCatalog.hasHeroColumn();
  const barredToCatalog=!personal&&!sharedLocked&&window.twlfCatalog.hasBlockColumn();
  if(!toCatalog)setHeroMembership(id,group);
  if(!barredToCatalog)setMostUsedBlock(id,barred);

  if(sharedLocked){
    save();render();closeModal();
    notice(`Card size, hero card and Most Used rule updated for “${existing.name}”.`);
    return;
  }

  if(!/^https?:\/\//i.test(data.url||''))data.url=`https://${data.url||''}`;
  if(data.logo && !/^https?:\/\//i.test(data.logo))data.logo=`https://${data.logo}`;
  // No logo given on a brand-new link: go and find the site's own icon so the
  // card does not start life as a pair of initials.
  if(!existing && !(data.logo||'').trim()){
    const button=document.querySelector('#saveLink');
    const label=button.textContent;
    button.textContent='Finding icon…';button.disabled=true;
    try{data.logo=await findIcon(data.url)}catch{data.logo=''}
    button.textContent=label;button.disabled=false;
  }
  const category=categoryById(data.category);
  const entry={id,name:(data.name||'').trim(),url:data.url,logo:(data.logo||'').trim(),
    description:(data.description||'').trim(),category:data.category,color:category?.color||'#75808a'};
  if(toCatalog)entry.heroGroup=group;
  if(barredToCatalog)entry.noMostUsed=barred;

  try{
    if(personal){
      if(existing){links=links.map(link=>String(link.id)===String(id)?{...link,...entry}:link)}else{links.push(entry)}
      save();render();notice(existing?'Link updated.':'Link added to your portal.');
    }else if(existing){
      save();await window.twlfCatalog.updateLink(existing.itemId,entry);notice(`“${entry.name}” updated for the whole firm.`);
    }else{
      save();await window.twlfCatalog.addLink(entry);notice(`“${entry.name}” added for the whole firm.`);
    }
  }catch(error){notice(`Saved your settings, but the shared catalog could not be updated: ${error.message}`,true)}
  event.target.reset();closeModal();
});

document.querySelector('#theme').addEventListener('click',()=>{applyTheme(document.documentElement.dataset.theme==='dark'?'light':'dark');save()});
document.querySelector('#reset').addEventListener('click',()=>{
  if(!window.confirm('Reset your layout, sizes and Most Used to the firm defaults?'))return;
  window.twlfPrefs.set({mostUsed:null,mostUsedOrder:[],categoryOrder:[],linkOrder:{},sizes:{},customLinks:[],displayColumns:2,heroGroups:{},heroMembers:null,mostUsedBlocked:[]});
  adoptPrefs();renderHeroSettings();columnsInput.value=displayColumns;document.querySelector('#columnCount').value=displayColumns;
  document.querySelector('#reset').hidden=true;render();
});

const settingsBackdrop=document.querySelector('#settingsBackdrop');
const columnsInput=document.querySelector('#columns');
document.querySelector('#settings').addEventListener('click',()=>{settingsBackdrop.hidden=false});
document.querySelector('#settingsClose').addEventListener('click',()=>{settingsBackdrop.hidden=true});
settingsBackdrop.addEventListener('click',event=>{if(event.target===settingsBackdrop)settingsBackdrop.hidden=true});
columnsInput.addEventListener('input',event=>{displayColumns=Number(event.target.value);document.querySelector('#columnCount').value=displayColumns;save();render()});
document.querySelector('#categoryForm').addEventListener('submit',async event=>{
  event.preventDefault();
  const data=Object.fromEntries(new FormData(event.target));
  const writable=catalogWritable();
  const category={id:writable?`c-${Date.now()}`:`custom-category-${Date.now()}`,name:data.name.trim(),color:data.color};
  event.target.reset();event.target.elements.color.value='#287b67';
  try{
    if(writable){
      await window.twlfCatalog.addCategory({...category,sortOrder:categories.length});
      notice(`${category.name} category added for the whole firm.`);
    }else{
      prefs.customCategories=[...(prefs.customCategories||[]),category];
      categories.push(category);categoryOrder.push(category.id);
      save();populateCategorySelect();render();
      notice(`${category.name} category added to your portal.`);
    }
  }catch(error){notice(`The category could not be added: ${error.message}`,true)}
});

/* Modules are opt-in per user. More will register themselves here later. */
const moduleToggles=()=>document.querySelectorAll('[data-module]');
function applyModules(){
  const enabled=prefs.modules||{};
  moduleToggles().forEach(toggle=>{toggle.checked=enabled[toggle.dataset.module]!==false});
  document.body.classList.toggle('module-microsoft365-off',enabled.microsoft365===false);
  window.twlfModuleState={...enabled};
  document.dispatchEvent(new CustomEvent('twlf:modules',{detail:{...enabled}}));
}
document.addEventListener('change',event=>{
  const toggle=event.target.closest('[data-module]');
  if(!toggle)return;
  prefs.modules={...(prefs.modules||{}),[toggle.dataset.module]:toggle.checked};
  save();applyModules();
});

const clearNotice=()=>{document.querySelector('#notice').innerHTML=''};
// The dismiss button was markup only — nothing ever listened to it.
document.addEventListener('click',event=>{if(event.target.closest('#notice button'))clearNotice()});
// A new message replaces the old one, and the Escape key clears it too.
document.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&document.querySelector('#notice').innerHTML&&document.querySelector('#backdrop').hidden&&document.querySelector('#settingsBackdrop').hidden)clearNotice();
});
function notice(message,isError){document.querySelector('#notice').innerHTML=`<div class="notice${isError?' auth-error':''}">${escapeHtml(message)}<button aria-label="Dismiss">×</button></div>`}
function showAuthError(error){const message=error?.errorMessage||error?.message||'Microsoft sign-in could not be completed.';document.querySelector('#notice').innerHTML=`<div class="notice auth-error">${escapeHtml(message)}<button aria-label="Dismiss">×</button></div>`}
function updateAccountUI(){
  const account=window.twlfAuth.getAccount();
  const topButton=document.querySelector('#account'),settingsButton=document.querySelector('#settingsAccount');
  const note=document.querySelector('.sync-note');
  if(account){
    const name=account.name||account.username;
    topButton.textContent=name.split(' ')[0];topButton.title=account.username;
    document.querySelector('#accountName').textContent=name;
    document.querySelector('#accountStatus').textContent=account.username;
    settingsButton.textContent='Sign out';
    if(note)note.textContent=window.twlfPrefs.source()==='graph'
      ?'Your layout and sizes are saved to your Microsoft 365 account and follow you to any device.'
      :'Signed in, but settings could not reach Microsoft 365 — they are saved on this device for now.';
  }else{
    topButton.textContent='Sign in';topButton.title='Sign in with Microsoft 365';
    document.querySelector('#accountName').textContent='Your portal';
    document.querySelector('#accountStatus').textContent='Not signed in';
    settingsButton.textContent='Sign in';
    if(note)note.textContent='Sign in with your woodlands.law Microsoft 365 account to carry your layout between devices.';
  }
}
document.querySelector('#account').addEventListener('click',async()=>{if(window.twlfAuth.getAccount()){settingsBackdrop.hidden=false;return}try{await window.twlfAuth.signIn()}catch(error){showAuthError(error)}});
document.querySelector('#settingsAccount').addEventListener('click',async()=>{try{if(window.twlfAuth.getAccount()){await window.twlfAuth.signOut()}else{await window.twlfAuth.signIn()}}catch(error){showAuthError(error)}});

let draggedPanel=null,draggedLink=null,draggedContext=null;
document.querySelector('#content').addEventListener('dragstart',event=>{const card=event.target.closest('[data-link]');if(card&&event.target.closest('.card-drag')){draggedLink=card.dataset.link;draggedContext=card.dataset.context;card.classList.add('dragging');event.dataTransfer.effectAllowed='move';return}const panel=event.target.closest('[data-panel]');if(!panel||active!=='all'||panel.dataset.panel==='most-used')return;draggedPanel=panel.dataset.panel;panel.classList.add('dragging');event.dataTransfer.effectAllowed='move'});
document.querySelector('#content').addEventListener('dragover',event=>{if(draggedLink){const target=event.target.closest('[data-link]');if(!target||target.dataset.context!==draggedContext)return;event.preventDefault();document.querySelectorAll('[data-link]').forEach(item=>item.classList.toggle('card-drag-target',item===target&&item.dataset.link!==draggedLink));return}if(!draggedPanel)return;const panel=event.target.closest('[data-panel]');if(!panel||panel.dataset.panel==='most-used')return;event.preventDefault();document.querySelectorAll('[data-panel]').forEach(item=>item.classList.toggle('drag-target',item===panel&&item.dataset.panel!==draggedPanel))});
document.querySelector('#content').addEventListener('drop',event=>{
  event.preventDefault();
  if(draggedLink){
    const targetCard=event.target.closest('[data-link]'),target=targetCard?.dataset.link;
    if(!target||target===draggedLink||targetCard.dataset.context!==draggedContext)return;
    const context=draggedContext;
    const current=matching(context).map(link=>String(link.id));
    const from=current.indexOf(draggedLink),to=current.indexOf(target);
    const [moved]=current.splice(from,1);current.splice(to,0,moved);
    // Ordering is layout, so it is personal for every panel including Most Used.
    if(context==='most-used'){mostUsedOrder=current}else{linkOrder={...linkOrder,[context]:current}}
    save();draggedLink=null;draggedContext=null;render();return;
  }
  const target=event.target.closest('[data-panel]')?.dataset.panel;
  if(!target||target==='most-used'||target===draggedPanel)return;
  const from=categoryOrder.indexOf(draggedPanel),to=categoryOrder.indexOf(target);
  categoryOrder.splice(from,1);categoryOrder.splice(to,0,draggedPanel);
  categoryOrder=['most-used',...categoryOrder.filter(id=>id!=='most-used')];
  save();draggedPanel=null;render();
});
document.querySelector('#content').addEventListener('dragend',()=>{draggedPanel=null;draggedLink=null;draggedContext=null;document.querySelectorAll('[data-panel],[data-link]').forEach(item=>item.classList.remove('dragging','drag-target','card-drag-target'))});

function updateCatalogUI(){
  const status=document.querySelector('#catalogStatus'),seedButton=document.querySelector('#seedCatalog');
  if(!status)return;
  const source=window.twlfCatalog.source(),error=window.twlfCatalog.error();
  const text={
    sharepoint:`Shared catalog: ${catalog.links.length} links from SharePoint. Anything you add here is added for the whole firm.`,
    empty:'The SharePoint lists are connected but empty. Load the firm catalog into them to start sharing.',
    bundled:window.twlfAuth.getAccount()
      ?`Shared catalog unavailable, showing the built-in copy${error?` (${error.message})`:''}. Links you add are yours only.`
      :'Signed out — showing the built-in catalog. Sign in to see and edit the firm catalog.',
  }[source]||'';
  status.textContent=text;
  status.classList.toggle('catalog-error',source==='bundled'&&Boolean(error));
  if(seedButton)seedButton.hidden=source!=='empty';
}
document.addEventListener('click',async event=>{
  if(!event.target.closest('#seedCatalog'))return;
  const button=document.querySelector('#seedCatalog');
  if(!window.confirm('Load all firm links and categories into the SharePoint lists? Do this once.'))return;
  button.disabled=true;
  try{
    const total=await window.twlfCatalog.seed((done,count)=>{button.textContent=`Loading ${done}/${count}…`});
    notice(`Loaded ${total} records into the shared catalog.`);
  }catch(error){notice(`Seeding stopped: ${error.message}`,true)}
  button.disabled=false;button.textContent='Load firm catalog into SharePoint';
  updateCatalogUI();
});

async function boot() {
  await window.twlfCatalog.load();
  await window.twlfPrefs.ready.catch(()=>null);
  adoptPrefs();
  columnsInput.value=displayColumns;document.querySelector('#columnCount').value=displayColumns;
  populateCategorySelect();applyModules();renderHeroSettings();updatePublishHero();render();
  document.querySelector('#reset').hidden=false;
  // When the account's settings arrive after a redirect sign-in, re-adopt.
  window.twlfPrefs.onChange(()=>{adoptPrefs();renderHeroSettings();columnsInput.value=displayColumns;document.querySelector('#columnCount').value=displayColumns;applyModules();populateCategorySelect();render();updateAccountUI()});
  window.twlfCatalog.onChange(()=>{adoptPrefs();populateCategorySelect();render();updateCatalogUI()});
  updateCatalogUI();
  window.twlfAuth.ready.then(async()=>{
    await window.twlfPrefs.adoptAfterSignIn();
    await window.twlfCatalog.sync();
    updateAccountUI();updateCatalogUI();updatePublishHero();renderHero();
  }).catch(showAuthError);
}
boot();
