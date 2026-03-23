/* ============================================
   TWLF Portal - Application Logic
   Real brand logos via Clearbit + fallbacks
   Inline sidebar widgets (notes, todo)
   ============================================ */

// ---- Logo / Icon helpers ----
// Clearbit returns actual brand logos (not tiny favicons)
// Fallback chain: Clearbit -> Google HD favicon -> letter
function getLogoUrl(url) {
    try {
        const hostname = new URL(url).hostname;
        // strip www. for cleaner Clearbit lookups
        const domain = hostname.replace(/^www\./, '');
        return `https://logo.clearbit.com/${domain}`;
    } catch {
        return '';
    }
}

function getGoogleFavicon(url, size) {
    size = size || 128;
    try {
        const domain = new URL(url).hostname;
        return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
    } catch {
        return '';
    }
}

// ---- Default Data (from Start.me) ----
const DEFAULT_CATEGORIES = [
    { id: 'most-used',   name: 'Most Used',           color: '#17D6E5' },
    { id: 'govt',        name: 'Government Offices',   color: '#FF017B' },
    { id: 'web-pages',   name: 'TWLF Web Pages',       color: '#51CA20' },
    { id: 'reference',   name: 'Reference',             color: '#FFBE00' },
    { id: 'writing-ai',  name: 'Writing & AI',          color: '#9B59B6' },
    { id: 'ai-tools',    name: 'AI Tools',              color: '#E67E22' },
    { id: 'social',      name: 'Social Media',          color: '#3498DB' },
    { id: 'texas-bar',   name: 'Texas Bar',             color: '#E74C3C' },
    { id: 'associations',name: 'Associations',           color: '#1ABC9C' },
    { id: 'law-books',   name: 'Law Books',             color: '#8E44AD' },
    { id: 'experts',     name: 'Experts',               color: '#F39C12' }
];

const DEFAULT_TILES = [
    // ─── Most Used ───
    { id: 't1',  name: 'Clio',                  url: 'https://account.clio.com/',               category: 'most-used', color: '#0B70CE' },
    { id: 't2',  name: 'Box',                   url: 'https://app.box.com/folder/0',            category: 'most-used', color: '#0061D5' },
    { id: 't3',  name: 'eFile Texas',           url: 'https://www.efiletexas.gov/',             category: 'most-used', color: '#1C3A5F' },
    { id: 't4',  name: 'Proof',                 url: 'https://app.proofserve.com/',             category: 'most-used', color: '#27AE60' },
    { id: 't5',  name: 'WestLaw',               url: 'https://lawschool.thomsonreuters.com/',   category: 'most-used', color: '#E87722' },
    { id: 't6',  name: 'LexisNexis',            url: 'https://plusai.lexis.com/',               category: 'most-used', color: '#D0232A' },
    { id: 't7',  name: 'Letterstream',          url: 'https://www.letterstream.com/',           category: 'most-used', color: '#2980B9' },
    { id: 't8',  name: 'Public Data',           url: 'https://www.publicdata.com/',             category: 'most-used', color: '#6C3483' },
    { id: 't9',  name: 'eFile Texas (Old)',      url: 'https://texas.tylertech.cloud/OfsWeb',    category: 'most-used', color: '#5D6D7E' },
    { id: 't10', name: 're:SearchTX',           url: 'https://research.txcourts.gov/CourtRecordsSearch/#!/dashboard', category: 'most-used', color: '#1A5276' },
    { id: 't11', name: 'CRIS Purchase',         url: 'https://cris.dot.state.tx.us/public/Purchase/app/home', category: 'most-used', color: '#117A65' },
    { id: 't12', name: 'Houston Public Records', url: 'https://houstontx.govqa.us/WEBAPP/_rs/(S(x1znyclu25l1jq31hgycgwrs))/SupportHome.aspx', category: 'most-used', color: '#C0392B' },

    // ─── Government Offices ───
    { id: 't13', name: 'MoCo District Clerk',   url: 'https://www.mctx.org/departments/departments_d_-_f/district_clerk/index.php', category: 'govt', color: '#8B1A4A' },
    { id: 't14', name: 'MoCo Odyssey',          url: 'https://odyssey.mctx.org/Secured/Login.aspx', category: 'govt', color: '#A93226' },
    { id: 't15', name: 'HC District Clerk',      url: 'https://www.hcdistrictclerk.com/Common/Default.aspx', category: 'govt', color: '#6C3483' },
    { id: 't16', name: 'HC County Clerk',        url: 'https://cclerk.hctx.net/',                category: 'govt', color: '#1C2833' },
    { id: 't17', name: 'Secretary of State',     url: 'https://www.sos.state.tx.us/corp/sosda/index.shtml', category: 'govt', color: '#148F77' },
    { id: 't18', name: 'PACER',                 url: 'https://pacer.login.uscourts.gov/csologin/login.jsf', category: 'govt', color: '#21618C' },
    { id: 't19', name: 'Harris JP Public',       url: 'http://www.jp.hctx.net/#gsc.tab=0',       category: 'govt', color: '#CA6F1E' },
    { id: 't20', name: 'Harris JP Odyssey',      url: 'https://jpodysseyportal.harriscountytx.gov/OdysseyPortalJP', category: 'govt', color: '#AF601A' },
    { id: 't21', name: 'Jefferson Co Clerk',     url: 'https://co.jefferson.tx.us/dclerk/index.html', category: 'govt', color: '#117A65' },
    { id: 't22', name: 'Harris Probate',         url: 'https://www.cclerk.hctx.net/applications/websearch/CourtSearch.aspx?CaseType=Probate', category: 'govt', color: '#7D3C98' },
    { id: 't23', name: 'MoCo County Clerk',      url: 'https://countyfusion1.kofiletech.us/countyweb/loginDisplay.action?countyname=MontgomeryTX', category: 'govt', color: '#C0392B' },
    { id: 't24', name: 'Galveston Clerk',        url: 'https://www.galvestoncountytx.gov/our-county/district-clerk', category: 'govt', color: '#2471A3' },
    { id: 't25', name: 'MoCo County Odyssey',    url: 'https://odyssey.mctx.org/County/default.aspx', category: 'govt', color: '#D4AC0D' },

    // ─── TWLF Web Pages ───
    { id: 't26', name: 'Estate Site',           url: 'https://woodlandslawestate.com',          category: 'web-pages', color: '#1E8449' },
    { id: 't27', name: 'Woodlands Law',         url: 'https://Woodlands.law',                   category: 'web-pages', color: '#196F3D' },
    { id: 't28', name: 'WordPress',             url: 'https://woodlandslaw.info/wp/',            category: 'web-pages', color: '#21759B' },
    { id: 't29', name: 'N8N',                   url: 'https://n8n.twlf.dev/',                   category: 'web-pages', color: '#EA4B71' },
    { id: 't30', name: 'Cal.com',               url: 'https://app.cal.com/',                     category: 'web-pages', color: '#292929' },
    { id: 't31', name: 'Phone Intake',          url: 'https://intake.twlf.dev',                  category: 'web-pages', color: '#27AE60' },

    // ─── Reference ───
    { id: 't32', name: 'TexasLawHelp',          url: 'https://texaslawhelp.org/',               category: 'reference', color: '#D4A017' },
    { id: 't33', name: 'TX Free Legal Answers',  url: 'https://texas.freelegalanswers.org/',     category: 'reference', color: '#2471A3' },
    { id: 't34', name: 'Pre-Judgment Calc',      url: 'http://www.csgnetwork.com/interestloancalc.html', category: 'reference', color: '#CA6F1E' },
    { id: 't35', name: 'Post-Judgment Calc',     url: 'https://www.webwinder.com/calculators/post_judge_calc.html', category: 'reference', color: '#C0392B' },
    { id: 't36', name: 'Houston Incidents',      url: 'https://dmwilson.info/',                  category: 'reference', color: '#922B21' },
    { id: 't37', name: 'Debt Collector Lookup',  url: 'https://direct.sos.state.tx.us/debtcollectors/DCSearch.asp', category: 'reference', color: '#6C3483' },
    { id: 't38', name: 'Date Calculator',        url: 'https://www.timeanddate.com/date/duration.html', category: 'reference', color: '#1C2833' },
    { id: 't39', name: 'SCRA',                  url: 'https://scra.dmdc.osd.mil/scra/#/login',  category: 'reference', color: '#148F77' },
    { id: 't40', name: 'STCL Clinic',           url: 'https://www.stcl.edu/academics/legal-clinics/request-legal-assistance/', category: 'reference', color: '#7D3C98' },
    { id: 't41', name: 'Bloomberg Law',          url: 'https://news.bloomberglaw.com/',           category: 'reference', color: '#1A5276' },
    { id: 't42', name: 'Checkpoint',             url: 'https://checkpoint.riag.com/app/login',    category: 'reference', color: '#1E8449' },
    { id: 't43', name: 'Court Deadlines',        url: 'https://courtdeadlines.com/',             category: 'reference', color: '#C0392B' },
    { id: 't44', name: 'Clio University',        url: 'https://cliouniversity.learnupon.com/dashboard', category: 'reference', color: '#0B70CE' },

    // ─── Writing & AI ───
    { id: 't45', name: 'ChatGPT',              url: 'https://chat.openai.com/',                category: 'writing-ai', color: '#10A37F' },
    { id: 't46', name: 'Gemini',               url: 'https://deepmind.google/technologies/gemini/', category: 'writing-ai', color: '#4285F4' },
    { id: 't47', name: 'Claude',               url: 'https://claude.ai/new',                    category: 'writing-ai', color: '#D97757' },
    { id: 't48', name: 'Grammarly',            url: 'https://app.grammarly.com/',               category: 'writing-ai', color: '#15C39A' },
    { id: 't49', name: 'GroqChat',             url: 'https://chat.groq.com/',                   category: 'writing-ai', color: '#F55036' },
    { id: 't50', name: 'QuillBot',             url: 'https://quillbot.com',                     category: 'writing-ai', color: '#499557' },
    { id: 't51', name: 'WLF-AI',              url: 'https://wlf-ai.com/',                      category: 'writing-ai', color: '#7D3C98' },
    { id: 't52', name: 'N8N Automation',       url: 'https://n8n.twlf.dev/',                    category: 'writing-ai', color: '#EA4B71' },
    { id: 't53', name: 'Prompt Library',       url: 'https://docs.anthropic.com/en/resources/prompt-library/library', category: 'writing-ai', color: '#D97757' },
    { id: 't54', name: 'Perplexity',           url: 'https://www.perplexity.ai/',               category: 'writing-ai', color: '#1FB8CD' },
    { id: 't55', name: 'NotebookLM',           url: 'https://notebooklm.google.com/',           category: 'writing-ai', color: '#FBBC04' },
    { id: 't56', name: 'GPT Prompt Packs',     url: 'https://academy.openai.com/public/clubs/work-users-ynjqu/resources/chatgpt-for-any-role', category: 'writing-ai', color: '#10A37F' },

    // ─── AI Tools ───
    { id: 't57', name: 'PimEyes',             url: 'https://pimeyes.com/en',                   category: 'ai-tools', color: '#CA6F1E' },
    { id: 't58', name: 'Fathom',              url: 'https://fathom.video/',                     category: 'ai-tools', color: '#7C3AED' },
    { id: 't59', name: 'Spellbook',           url: 'https://www.spellbook.legal/',              category: 'ai-tools', color: '#6366F1' },
    { id: 't60', name: 'EvenUp',              url: 'https://www.evenuplaw.com/',                category: 'ai-tools', color: '#2563EB' },
    { id: 't61', name: 'DISCO',               url: 'https://csdisco.com/',                      category: 'ai-tools', color: '#06B6D4' },
    { id: 't62', name: 'Pre-dicta',           url: 'https://www.pre-dicta.com/',                category: 'ai-tools', color: '#14B8A6' },
    { id: 't63', name: 'SlidesAI',            url: 'https://www.slidesai.io/',                  category: 'ai-tools', color: '#F59E0B' },
    { id: 't64', name: 'Beautiful.ai',        url: 'https://www.beautiful.ai/',                 category: 'ai-tools', color: '#EC4899' },

    // ─── Social Media ───
    { id: 't65', name: 'Radaar',              url: 'https://www.radaar.io/',                    category: 'social', color: '#6366F1' },
    { id: 't66', name: 'Facebook',            url: 'https://www.facebook.com/',                 category: 'social', color: '#1877F2' },
    { id: 't67', name: 'Instagram',           url: 'https://www.instagram.com/',                category: 'social', color: '#E4405F' },
    { id: 't68', name: 'X',                   url: 'https://x.com',                             category: 'social', color: '#1C2833' },
    { id: 't69', name: 'TikTok',              url: 'http://tiktok.com',                          category: 'social', color: '#010101' },
    { id: 't70', name: 'LinkedIn',            url: 'https://linkedin.com',                       category: 'social', color: '#0A66C2' },
    { id: 't71', name: 'Blog Admin',          url: 'https://woodlandslaw.info/wp/admin',         category: 'social', color: '#21759B' },

    // ─── Texas Bar ───
    { id: 't72', name: 'Bar Benefits',        url: 'https://texasbar.memberbenefits.com/',       category: 'texas-bar', color: '#C0392B' },
    { id: 't73', name: 'State Bar of Texas',  url: 'https://www.texasbar.com/AM/Template.cfm?Section=Lawyers_Home', category: 'texas-bar', color: '#922B21' },
    { id: 't74', name: 'LRIS',                url: 'https://www.texasbar.com/AM/Template.cfm?Section=Join_or_Manage_Your_LRIS_Account', category: 'texas-bar', color: '#CA6F1E' },
    { id: 't75', name: 'TX Bar Career Center', url: 'https://l.tx.bar.associationcareernetwork.com/', category: 'texas-bar', color: '#2471A3' },
    { id: 't76', name: 'TLAP',                url: 'https://www.tlaphelps.org/',                 category: 'texas-bar', color: '#27AE60' },
    { id: 't77', name: 'TexasBarCLE',         url: 'http://www.texasbarcle.com/CLE/Home.asp',    category: 'texas-bar', color: '#7D3C98' },
    { id: 't78', name: 'TX Bar Practice',     url: 'https://www.texasbarpractice.com/',          category: 'texas-bar', color: '#D4A017' },

    // ─── Associations ───
    { id: 't79', name: 'Houston Bar',         url: 'https://www.hba.org/?pg=myhba',              category: 'associations', color: '#148F77' },
    { id: 't80', name: 'Woodlands Bar',       url: 'https://www.woodlandsbarassociation.com/',    category: 'associations', color: '#1E8449' },
    { id: 't81', name: 'Federalist Society',  url: 'https://fedsoc.org/',                        category: 'associations', color: '#1C2833' },
    { id: 't82', name: 'MoCo Bar Assoc',      url: 'https://mcbatx.com/',                        category: 'associations', color: '#117A65' },

    // ─── Law Books ───
    { id: 't83', name: 'West Academic',       url: 'https://signin.westacademic.com/',            category: 'law-books', color: '#6C3483' },
    { id: 't84', name: 'CasebookConnect',     url: 'https://www.casebookconnect.com/login',       category: 'law-books', color: '#4A235A' },

    // ─── Experts ───
    { id: 't85', name: 'JurisPro',            url: 'https://www.jurispro.com/',                  category: 'experts', color: '#D4A017' },
    { id: 't86', name: 'SEAK Experts',        url: 'https://www.seakexperts.com/',               category: 'experts', color: '#CA6F1E' },
];

const TILE_COLORS = [
    '#17D6E5', '#FF017B', '#51CA20', '#FFBE00', '#9B59B6',
    '#E67E22', '#3498DB', '#E74C3C', '#1ABC9C', '#1C2833',
    '#D4A017', '#6C3483', '#2471A3', '#1E8449', '#AF601A',
    '#922B21', '#117A65', '#5D6D7E', '#27AE60', '#6366F1',
    '#EC4899', '#10A37F', '#F59E0B', '#06B6D4', '#0B70CE'
];

const SEARCH_ENGINES = [
    { name: 'Google',      url: 'https://www.google.com/search?q=',   icon: 'https://www.google.com/favicon.ico' },
    { name: 'Bing',        url: 'https://www.bing.com/search?q=',     icon: 'https://www.bing.com/favicon.ico' },
    { name: 'DuckDuckGo',  url: 'https://duckduckgo.com/?q=',          icon: 'https://duckduckgo.com/favicon.ico' }
];

// ---- State ----
let state = {
    categories: [],
    tiles: [],
    activeCategory: null,
    settings: {
        bgColor: '#0f1923',
        bgImage: '',
        tileSize: 100,
        showLabels: true,
        showSidebar: true,
        searchEngine: 0
    },
    notes: '',
    todos: [],
    collapsedWidgets: {},
    editMode: false,
    editingTile: null
};

// ---- Init ----
function init() {
    loadState();
    applyTileSize(state.settings.tileSize);
    renderMarkers();
    renderGrid();
    applySettings();
    initWidgets();
    startClock();
    setupEventListeners();
    setupDragAndDrop();
    setupSearch();
}

// ---- Persistence ----
function loadState() {
    const saved = localStorage.getItem('twlf-portal-state-v3');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            state = { ...state, ...parsed };
        } catch (e) {
            console.error('Failed to load state:', e);
            resetToDefaults();
        }
    } else {
        resetToDefaults();
    }
    if (!state.activeCategory && state.categories.length > 0) {
        state.activeCategory = state.categories[0].id;
    }
}

function saveState() {
    localStorage.setItem('twlf-portal-state-v3', JSON.stringify(state));
}

function resetToDefaults() {
    state.categories = JSON.parse(JSON.stringify(DEFAULT_CATEGORIES));
    state.tiles = JSON.parse(JSON.stringify(DEFAULT_TILES));
    state.activeCategory = DEFAULT_CATEGORIES[0].id;
    state.settings = {
        bgColor: '#0f1923',
        bgImage: '',
        tileSize: 100,
        showLabels: true,
        showSidebar: true,
        searchEngine: 0
    };
    state.notes = '';
    state.todos = [];
    state.collapsedWidgets = {};
    saveState();
}

// ---- Tile Size (continuous slider) ----
function applyTileSize(size) {
    size = parseInt(size) || 100;
    document.documentElement.style.setProperty('--tile-size', size + 'px');
    document.documentElement.style.setProperty('--tile-radius', Math.max(8, Math.round(size * 0.16)) + 'px');
    document.documentElement.style.setProperty('--label-size', Math.max(8, Math.min(13, Math.round(size * 0.1))) + 'px');
    document.documentElement.style.setProperty('--tile-gap', Math.max(4, Math.round(size * 0.07)) + 'px');
}

// ---- Rendering ----
function renderMarkers() {
    const bar = document.getElementById('markerBar');
    bar.innerHTML = '';
    state.categories.forEach(cat => {
        const marker = document.createElement('div');
        marker.className = `marker${cat.id === state.activeCategory ? ' active' : ''}`;
        marker.style.borderColor = cat.color;
        if (cat.id === state.activeCategory) {
            marker.style.background = hexToRgba(cat.color, 0.15);
        }
        marker.textContent = cat.name;
        marker.dataset.id = cat.id;
        marker.addEventListener('click', () => {
            state.activeCategory = cat.id;
            saveState();
            renderMarkers();
            renderGrid();
        });
        marker.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            const newName = prompt('Rename category:', cat.name);
            if (newName && newName.trim()) {
                cat.name = newName.trim();
                saveState();
                renderMarkers();
            }
        });
        bar.appendChild(marker);
    });
}

function renderGrid() {
    const container = document.getElementById('gridContainer');
    container.innerHTML = '';

    const activeTiles = state.tiles.filter(t => t.category === state.activeCategory);

    activeTiles.forEach(tile => {
        container.appendChild(createTileElement(tile));
    });

    // Fill with empty slots
    const minSlots = 24;
    const remaining = Math.max(0, minSlots - activeTiles.length);
    for (let i = 0; i < remaining; i++) {
        const empty = document.createElement('div');
        empty.className = 'tile empty-slot';
        empty.addEventListener('click', () => { if (state.editMode) openAddModal(); });
        container.appendChild(empty);
    }
}

function createTileElement(tile) {
    const el = document.createElement('div');
    el.className = 'tile';
    el.style.background = tile.color || '#333';
    el.dataset.id = tile.id;
    el.draggable = true;

    // ── Logo with fallback chain ──
    const iconDiv = document.createElement('div');
    iconDiv.className = 'tile-icon';

    if (tile.customIconUrl) {
        // User-specified custom icon
        const img = createLogoImg(tile.customIconUrl, tile);
        iconDiv.appendChild(img);
    } else {
        // Try Clearbit first, then Google favicon, then letter
        const img = document.createElement('img');
        const clearbitUrl = getLogoUrl(tile.url);
        const googleUrl = getGoogleFavicon(tile.url, 128);

        img.src = clearbitUrl;
        img.alt = tile.name;
        img.loading = 'lazy';
        img.onerror = function () {
            // Clearbit failed → try Google favicon
            if (this.src !== googleUrl && googleUrl) {
                this.onerror = function () {
                    // Google also failed → show letter
                    showLetterFallback(this.parentElement, tile);
                };
                this.src = googleUrl;
            } else {
                showLetterFallback(this.parentElement, tile);
            }
        };
        iconDiv.appendChild(img);
    }
    el.appendChild(iconDiv);

    // ── Label ──
    const label = document.createElement('div');
    label.className = 'tile-label';
    label.textContent = tile.name;
    el.appendChild(label);

    // ── Click ──
    el.addEventListener('click', (e) => {
        if (state.editMode) { e.preventDefault(); openEditModal(tile); return; }
        window.open(tile.url, '_blank');
    });

    // ── Context Menu ──
    el.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        showContextMenu(e, tile);
    });

    return el;
}

function createLogoImg(src, tile) {
    const img = document.createElement('img');
    img.src = src;
    img.alt = tile.name;
    img.loading = 'lazy';
    img.onerror = function () { showLetterFallback(this.parentElement, tile); };
    return img;
}

function showLetterFallback(parent, tile) {
    parent.innerHTML = '';
    const span = document.createElement('span');
    span.className = 'letter-fallback';
    span.textContent = (tile.name || '?')[0].toUpperCase();
    parent.appendChild(span);
}

// ---- Inline Widgets ----
function initWidgets() {
    // Load notes
    document.getElementById('notesArea').value = state.notes || '';

    // Load todos
    renderTodos();

    // Restore collapsed state
    Object.keys(state.collapsedWidgets || {}).forEach(widgetId => {
        if (state.collapsedWidgets[widgetId]) {
            const el = document.getElementById(widgetId);
            if (el) el.classList.add('collapsed');
        }
    });

    // Collapse toggle buttons
    document.querySelectorAll('.widget-collapse-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const widgetId = btn.dataset.widget;
            const panel = document.getElementById(widgetId);
            if (!panel) return;
            panel.classList.toggle('collapsed');
            if (!state.collapsedWidgets) state.collapsedWidgets = {};
            state.collapsedWidgets[widgetId] = panel.classList.contains('collapsed');
            saveState();
        });
    });

    // Notes save
    document.getElementById('notesSaveBtn').addEventListener('click', () => {
        state.notes = document.getElementById('notesArea').value;
        saveState();
    });

    // Auto-save notes on blur
    document.getElementById('notesArea').addEventListener('blur', () => {
        state.notes = document.getElementById('notesArea').value;
        saveState();
    });

    // Todo add
    document.getElementById('todoAddBtn').addEventListener('click', addTodo);
    document.getElementById('todoInput').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') addTodo();
    });
}

function addTodo() {
    const input = document.getElementById('todoInput');
    const text = input.value.trim();
    if (!text) return;
    if (!state.todos) state.todos = [];
    state.todos.push({ text, done: false });
    input.value = '';
    saveState();
    renderTodos();
}

function renderTodos() {
    const list = document.getElementById('todoList');
    list.innerHTML = '';
    (state.todos || []).forEach((todo, idx) => {
        const li = document.createElement('li');
        if (todo.done) li.classList.add('done');
        li.innerHTML = `
            <input type="checkbox" ${todo.done ? 'checked' : ''}>
            <span>${escapeHtml(todo.text)}</span>
            <button><i class="fa-solid fa-xmark"></i></button>
        `;
        li.querySelector('input').addEventListener('change', () => {
            state.todos[idx].done = !state.todos[idx].done;
            saveState(); renderTodos();
        });
        li.querySelector('button').addEventListener('click', () => {
            state.todos.splice(idx, 1);
            saveState(); renderTodos();
        });
        list.appendChild(li);
    });
}

// ---- Modals ----
function openAddModal() {
    state.editingTile = null;
    document.getElementById('modalTitle').textContent = 'Add Tile';
    document.getElementById('tileName').value = '';
    document.getElementById('tileUrl').value = '';
    document.getElementById('tileIconUrl').value = '';
    document.getElementById('modalDelete').style.display = 'none';
    renderColorPicker(TILE_COLORS[0]);
    document.getElementById('tileModal').classList.add('active');
}

function openEditModal(tile) {
    state.editingTile = tile;
    document.getElementById('modalTitle').textContent = 'Edit Tile';
    document.getElementById('tileName').value = tile.name;
    document.getElementById('tileUrl').value = tile.url;
    document.getElementById('tileIconUrl').value = tile.customIconUrl || '';
    document.getElementById('modalDelete').style.display = 'block';
    renderColorPicker(tile.color || TILE_COLORS[0]);
    document.getElementById('tileModal').classList.add('active');
}

function renderColorPicker(selectedColor) {
    const picker = document.getElementById('colorPicker');
    picker.innerHTML = '';
    TILE_COLORS.forEach(color => {
        const swatch = document.createElement('div');
        swatch.className = `color-swatch${color === selectedColor ? ' selected' : ''}`;
        swatch.style.background = color;
        swatch.dataset.hex = color;
        swatch.addEventListener('click', () => {
            picker.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
            swatch.classList.add('selected');
        });
        picker.appendChild(swatch);
    });
}

function getSelectedColor() {
    const selected = document.querySelector('#colorPicker .color-swatch.selected');
    if (!selected) return TILE_COLORS[0];
    return selected.dataset.hex || TILE_COLORS[0];
}

function saveTileFromModal() {
    const name = document.getElementById('tileName').value.trim();
    const url = document.getElementById('tileUrl').value.trim();
    const customIconUrl = document.getElementById('tileIconUrl').value.trim();
    const color = getSelectedColor();

    if (!name || !url) return;

    if (state.editingTile) {
        const tile = state.tiles.find(t => t.id === state.editingTile.id);
        if (tile) {
            tile.name = name;
            tile.url = url;
            tile.color = color;
            tile.customIconUrl = customIconUrl || undefined;
        }
    } else {
        state.tiles.push({
            id: 't' + Date.now(),
            name, url, color,
            category: state.activeCategory,
            customIconUrl: customIconUrl || undefined
        });
    }

    saveState();
    renderGrid();
    closeTileModal();
}

function deleteTileFromModal() {
    if (!state.editingTile) return;
    if (!confirm(`Delete "${state.editingTile.name}"?`)) return;
    state.tiles = state.tiles.filter(t => t.id !== state.editingTile.id);
    saveState();
    renderGrid();
    closeTileModal();
}

function closeTileModal() {
    document.getElementById('tileModal').classList.remove('active');
    state.editingTile = null;
}

// ---- Context Menu ----
let contextTile = null;

function showContextMenu(e, tile) {
    contextTile = tile;
    const menu = document.getElementById('contextMenu');
    menu.classList.add('active');
    menu.style.left = Math.min(e.clientX, window.innerWidth - 200) + 'px';
    menu.style.top = Math.min(e.clientY, window.innerHeight - 180) + 'px';
}

function hideContextMenu() {
    document.getElementById('contextMenu').classList.remove('active');
    contextTile = null;
}

function handleContextAction(action) {
    if (!contextTile) return;
    const tile = contextTile;
    hideContextMenu();

    switch (action) {
        case 'edit':
            openEditModal(tile);
            break;
        case 'color': {
            const newColor = prompt('Enter hex color (e.g. #FF017B):', tile.color);
            if (newColor && /^#[0-9A-Fa-f]{6}$/.test(newColor)) {
                const t = state.tiles.find(t2 => t2.id === tile.id);
                if (t) { t.color = newColor; saveState(); renderGrid(); }
            }
            break;
        }
        case 'duplicate': {
            const dup = { ...tile, id: 't' + Date.now() };
            state.tiles.push(dup);
            saveState(); renderGrid();
            break;
        }
        case 'delete':
            if (confirm(`Delete "${tile.name}"?`)) {
                state.tiles = state.tiles.filter(t2 => t2.id !== tile.id);
                saveState(); renderGrid();
            }
            break;
    }
}

// ---- Settings ----
function openSettings() {
    document.getElementById('bgColor').value = state.settings.bgColor || '#0f1923';
    document.getElementById('bgImage').value = state.settings.bgImage || '';
    document.getElementById('showLabels').checked = state.settings.showLabels !== false;
    document.getElementById('showSidebar').checked = state.settings.showSidebar !== false;
    document.getElementById('settingsModal').classList.add('active');
}

function saveSettings() {
    state.settings.bgColor = document.getElementById('bgColor').value;
    state.settings.bgImage = document.getElementById('bgImage').value.trim();
    state.settings.showLabels = document.getElementById('showLabels').checked;
    state.settings.showSidebar = document.getElementById('showSidebar').checked;
    saveState();
    applySettings();
    document.getElementById('settingsModal').classList.remove('active');
}

function applySettings() {
    document.body.style.backgroundColor = state.settings.bgColor || '#0f1923';
    if (state.settings.bgImage) {
        document.body.style.backgroundImage = `url(${state.settings.bgImage})`;
        document.body.classList.add('has-bg-image');
    } else {
        document.body.style.backgroundImage = '';
        document.body.classList.remove('has-bg-image');
    }
    document.body.classList.toggle('hide-labels', state.settings.showLabels === false);
    document.body.classList.toggle('hide-sidebar', state.settings.showSidebar === false);
}

// ---- Drag & Drop ----
function setupDragAndDrop() {
    const container = document.getElementById('gridContainer');
    let dragId = null;

    container.addEventListener('dragstart', (e) => {
        const tile = e.target.closest('.tile[data-id]');
        if (!tile) return;
        dragId = tile.dataset.id;
        tile.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
    });

    container.addEventListener('dragend', (e) => {
        const tile = e.target.closest('.tile');
        if (tile) tile.classList.remove('dragging');
        container.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
    });

    container.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        const tile = e.target.closest('.tile[data-id]');
        if (tile && tile.dataset.id !== dragId) {
            container.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
            tile.classList.add('drag-over');
        }
    });

    container.addEventListener('dragleave', (e) => {
        const tile = e.target.closest('.tile');
        if (tile) tile.classList.remove('drag-over');
    });

    container.addEventListener('drop', (e) => {
        e.preventDefault();
        container.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
        const targetTile = e.target.closest('.tile[data-id]');
        if (!targetTile || !dragId || targetTile.dataset.id === dragId) return;

        const fromIdx = state.tiles.findIndex(t => t.id === dragId);
        const toIdx = state.tiles.findIndex(t => t.id === targetTile.dataset.id);
        if (fromIdx === -1 || toIdx === -1) return;

        const [moved] = state.tiles.splice(fromIdx, 1);
        state.tiles.splice(toIdx, 0, moved);
        saveState();
        renderGrid();
    });
}

// ---- Search ----
function setupSearch() {
    const input = document.getElementById('searchInput');
    const results = document.getElementById('searchResults');

    input.addEventListener('input', () => {
        const query = input.value.trim().toLowerCase();
        if (!query) { results.classList.remove('active'); results.innerHTML = ''; return; }

        const matches = state.tiles.filter(t =>
            t.name.toLowerCase().includes(query) ||
            t.url.toLowerCase().includes(query)
        ).slice(0, 8);

        results.innerHTML = '';

        matches.forEach(tile => {
            const item = document.createElement('div');
            item.className = 'search-result-item';
            const logoSrc = tile.customIconUrl || getLogoUrl(tile.url);
            item.innerHTML = `
                <div class="result-icon" style="background:${tile.color}">
                    <img src="${logoSrc}" alt="" onerror="this.src='${getGoogleFavicon(tile.url, 64)}'; this.onerror=function(){this.style.display='none'};">
                </div>
                <div class="result-info">
                    <div class="result-name">${escapeHtml(tile.name)}</div>
                    <div class="result-url">${escapeHtml(tile.url)}</div>
                </div>
            `;
            item.addEventListener('click', () => {
                window.open(tile.url, '_blank');
                input.value = '';
                results.classList.remove('active');
            });
            results.appendChild(item);
        });

        // Web search option
        const webItem = document.createElement('div');
        webItem.className = 'search-result-web';
        const engine = SEARCH_ENGINES[state.settings.searchEngine || 0];
        webItem.innerHTML = `<i class="fa-solid fa-magnifying-glass"></i> Search "${escapeHtml(input.value)}" on ${engine.name}`;
        webItem.addEventListener('click', () => {
            window.open(engine.url + encodeURIComponent(input.value), '_blank');
            input.value = '';
            results.classList.remove('active');
        });
        results.appendChild(webItem);

        results.classList.add('active');
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const query = input.value.trim();
            if (!query) return;
            const match = state.tiles.find(t => t.name.toLowerCase().includes(query.toLowerCase()));
            if (match) {
                window.open(match.url, '_blank');
            } else {
                const engine = SEARCH_ENGINES[state.settings.searchEngine || 0];
                window.open(engine.url + encodeURIComponent(query), '_blank');
            }
            input.value = '';
            results.classList.remove('active');
        } else if (e.key === 'Escape') {
            input.value = '';
            results.classList.remove('active');
        }
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.header-center')) {
            results.classList.remove('active');
        }
    });

    // Search engine toggle
    document.getElementById('searchEngineToggle').addEventListener('click', () => {
        state.settings.searchEngine = ((state.settings.searchEngine || 0) + 1) % SEARCH_ENGINES.length;
        const engine = SEARCH_ENGINES[state.settings.searchEngine];
        document.getElementById('searchEngineIcon').src = engine.icon;
        document.getElementById('searchEngineIcon').alt = engine.name;
        saveState();
    });
}

// ---- Clock ----
function startClock() {
    const clockEl = document.getElementById('clock');
    function update() {
        clockEl.textContent = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }
    update();
    setInterval(update, 30000);
}

// ---- Event Listeners ----
function setupEventListeners() {
    // Size slider
    const slider = document.getElementById('tileSizeSlider');
    slider.value = state.settings.tileSize || 100;
    slider.addEventListener('input', () => {
        const size = parseInt(slider.value);
        state.settings.tileSize = size;
        applyTileSize(size);
        saveState();
    });

    // Toggle labels
    const labelBtn = document.getElementById('toggleLabels');
    labelBtn.classList.toggle('active', state.settings.showLabels !== false);
    labelBtn.addEventListener('click', () => {
        state.settings.showLabels = !state.settings.showLabels;
        labelBtn.classList.toggle('active', state.settings.showLabels);
        document.body.classList.toggle('hide-labels', !state.settings.showLabels);
        saveState();
    });

    // Edit mode
    document.getElementById('editModeBtn').addEventListener('click', () => {
        state.editMode = !state.editMode;
        document.body.classList.toggle('edit-mode', state.editMode);
        document.getElementById('editModeBtn').classList.toggle('active', state.editMode);
    });

    // Add tile
    document.getElementById('addTileBtn').addEventListener('click', openAddModal);

    // Settings
    document.getElementById('settingsBtn').addEventListener('click', openSettings);
    document.getElementById('settingsClose').addEventListener('click', () => {
        document.getElementById('settingsModal').classList.remove('active');
    });
    document.getElementById('settingsSave').addEventListener('click', saveSettings);

    // Tile modal
    document.getElementById('modalClose').addEventListener('click', closeTileModal);
    document.getElementById('modalCancel').addEventListener('click', closeTileModal);
    document.getElementById('modalSave').addEventListener('click', saveTileFromModal);
    document.getElementById('modalDelete').addEventListener('click', deleteTileFromModal);

    // Add category
    document.getElementById('addCategoryBtn').addEventListener('click', () => {
        const name = document.getElementById('newCategoryName').value.trim();
        const color = document.getElementById('newCategoryColor').value;
        if (!name) return;
        const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        if (state.categories.find(c => c.id === id)) { alert('Category already exists'); return; }
        state.categories.push({ id, name, color });
        document.getElementById('newCategoryName').value = '';
        saveState();
        renderMarkers();
    });

    // Export / Import
    document.getElementById('exportBtn').addEventListener('click', () => {
        const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'twlf-portal-backup.json';
        a.click();
        URL.revokeObjectURL(a.href);
    });

    document.getElementById('importBtn').addEventListener('click', () => {
        document.getElementById('importFile').click();
    });

    document.getElementById('importFile').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const imported = JSON.parse(ev.target.result);
                state = { ...state, ...imported };
                saveState();
                applyTileSize(state.settings.tileSize);
                applySettings();
                renderMarkers();
                renderGrid();
                initWidgets();
                alert('Import successful!');
            } catch {
                alert('Invalid backup file.');
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    });

    // Reset
    document.getElementById('resetBtn').addEventListener('click', () => {
        if (!confirm('Reset all data to defaults? This cannot be undone.')) return;
        localStorage.removeItem('twlf-portal-state-v3');
        resetToDefaults();
        applyTileSize(state.settings.tileSize);
        applySettings();
        renderMarkers();
        renderGrid();
        initWidgets();
        document.getElementById('settingsModal').classList.remove('active');
    });

    // Context menu
    document.querySelectorAll('.context-item[data-action]').forEach(item => {
        item.addEventListener('click', () => handleContextAction(item.dataset.action));
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.context-menu')) hideContextMenu();
    });

    // Close modals on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.classList.remove('active');
        });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
            hideContextMenu();
        }
        if ((e.ctrlKey && e.key === 'k') || (e.key === '/' && !e.target.closest('input, textarea'))) {
            e.preventDefault();
            document.getElementById('searchInput').focus();
        }
    });
}

// ---- Utilities ----
function hexToRgba(hex, alpha) {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return `rgba(${r},${g},${b},${alpha})`;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function rgbToHex(rgb) {
    if (rgb.startsWith('#')) return rgb;
    const match = rgb.match(/\d+/g);
    if (!match) return rgb;
    return '#' + match.slice(0, 3).map(n => parseInt(n).toString(16).padStart(2, '0')).join('');
}

// ---- Start ----
document.addEventListener('DOMContentLoaded', init);
