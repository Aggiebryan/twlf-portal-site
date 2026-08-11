/* Per-user portal settings.
 *
 * Shared catalog (links, categories) lives in links.json and is the same for
 * everyone. Everything in here is presentation and personal choice: card
 * sizes, layout, ordering, which modules are on, and each person's own Most
 * Used set.
 *
 * Signed in, settings live in the user's own OneDrive app folder via Graph, so
 * they follow the person to any device. Signed out — or if Graph is
 * unreachable — they fall back to this browser's localStorage, and are pushed
 * up on the next successful sign-in. */

(function () {

/* If the MSAL CDN is blocked, auth.js never defines twlfAuth. The portal must
 * still open — it just falls back to local settings and no sign-in. */
window.twlfAuth = window.twlfAuth || {
  ready: Promise.resolve(null),
  getAccount: () => null,
  signIn: async () => { throw new Error('Microsoft sign-in is unavailable right now.'); },
  signOut: async () => {},
  acquireGraphToken: async () => null,
  unavailable: true,
};

const PREFS_PATH = 'https://graph.microsoft.com/v1.0/me/drive/special/approot:/portal-settings.json:/content';
const PREFS_SCOPES = ['Files.ReadWrite.AppFolder'];
const LOCAL_KEY = 'twlf-prefs-v1';
const SAVE_DEBOUNCE_MS = 900;

const defaultPrefs = () => ({
  version: 1,
  theme: 'light',
  displayColumns: 2,
  categoryOrder: [],
  mostUsed: null,      // null means "not chosen yet" -> fall back to firm default
  mostUsedOrder: [],
  sizes: {},           // { [linkId]: { category: 'standard', mostUsed: 'large' } }
  modules: { microsoft365: true },
  customLinks: [],
  customCategories: [],
});

/* One-time lift of the pre-settings localStorage keys so nobody loses the
 * layout they already had. */
function migrateLegacy(prefs) {
  const read = (key, fallback) => {
    try { const raw = localStorage.getItem(key); return raw === null ? fallback : JSON.parse(raw); }
    catch { return fallback; }
  };
  const legacyLinks = read('twlf-firm-hub-links-v3', null);
  if (Array.isArray(legacyLinks)) {
    for (const link of legacyLinks) {
      if (link.size || link.mostUsedSize) {
        prefs.sizes[link.id] = { category: link.size || 'standard', mostUsed: link.mostUsedSize || link.size || 'standard' };
      }
      if (link.mostUsed) (prefs.mostUsed = prefs.mostUsed || []).push(String(link.id));
      if (String(link.id).startsWith('custom-')) prefs.customLinks.push(link);
    }
  }
  prefs.theme = localStorage.getItem('twlf-theme') || prefs.theme;
  prefs.displayColumns = Number(localStorage.getItem('twlf-display-columns')) || prefs.displayColumns;
  prefs.categoryOrder = read('twlf-category-order', prefs.categoryOrder) || prefs.categoryOrder;
  prefs.mostUsedOrder = read('twlf-most-used-order', prefs.mostUsedOrder) || prefs.mostUsedOrder;
  prefs.customCategories = read('twlf-custom-categories', prefs.customCategories) || prefs.customCategories;
  return prefs;
}

function readLocal() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (raw) return { ...defaultPrefs(), ...JSON.parse(raw) };
  } catch { /* fall through to a fresh migration */ }
  return migrateLegacy(defaultPrefs());
}

const writeLocal = prefs => {
  try { localStorage.setItem(LOCAL_KEY, JSON.stringify(prefs)); } catch { /* quota or private mode */ }
};

async function graphFetch(url, init) {
  const token = await window.twlfAuth.acquireGraphToken(PREFS_SCOPES);
  if (!token?.accessToken) return null;   // a redirect is in flight
  return fetch(url, {
    ...init,
    headers: { ...(init?.headers || {}), Authorization: `Bearer ${token.accessToken}` },
  });
}

let prefs = readLocal();
let source = 'local';
let saveTimer = null;
let lastError = null;
const listeners = new Set();

async function pullFromGraph() {
  if (!window.twlfAuth?.getAccount()) return 'local';
  const response = await graphFetch(PREFS_PATH, { method: 'GET' });
  if (!response) return 'local';
  if (response.status === 404) {
    // First sign-in on this account: seed the app folder from what's local.
    await pushToGraph();
    return 'graph';
  }
  if (!response.ok) throw new Error(`Graph read failed (${response.status})`);
  const remote = await response.json();
  prefs = { ...defaultPrefs(), ...remote };
  writeLocal(prefs);
  return 'graph';
}

async function pushToGraph() {
  const response = await graphFetch(PREFS_PATH, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(prefs),
  });
  if (response && !response.ok) throw new Error(`Graph write failed (${response.status})`);
}

function flush() {
  writeLocal(prefs);
  if (source !== 'graph') return;
  pushToGraph().then(() => { lastError = null; }).catch(error => {
    // Keep the local copy authoritative; the next successful save re-syncs.
    lastError = error;
    source = 'local';
    notify();
  });
}

const notify = () => listeners.forEach(fn => { try { fn(prefs); } catch { /* listener's problem */ } });

const ready = (window.twlfAuth?.ready || Promise.resolve(null))
  .then(pullFromGraph)
  .catch(error => { lastError = error; return 'local'; })
  .then(result => { source = result || 'local'; notify(); return prefs; });

window.twlfPrefs = {
  ready,
  get: () => prefs,
  source: () => source,
  error: () => lastError,
  onChange: fn => { listeners.add(fn); return () => listeners.delete(fn); },
  set(patch) {
    prefs = { ...prefs, ...patch };
    clearTimeout(saveTimer);
    saveTimer = setTimeout(flush, SAVE_DEBOUNCE_MS);
    return prefs;
  },
  /* Called after an interactive sign-in so this browser's settings become the
   * account's settings rather than being silently dropped. */
  async adoptAfterSignIn() {
    try { source = await pullFromGraph(); lastError = null; }
    catch (error) { lastError = error; source = 'local'; }
    notify();
    return prefs;
  },
};
})();
