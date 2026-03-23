/* ============================================
   TWLF Portal - Full Dashboard System
   Multi-dashboard, themes, shapes, widgets,
   drag-and-drop, markers, keyboard shortcuts
   ============================================ */

// ---- Logo helpers ----
function getLogoUrl(url) {
    try { return `https://logo.clearbit.com/${new URL(url).hostname.replace(/^www\./, '')}`; }
    catch { return ''; }
}
function getGoogleFavicon(url, sz) {
    try { return `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=${sz || 128}`; }
    catch { return ''; }
}

// ---- URL Validation ----
function isValidUrl(str) {
    try { const u = new URL(str); return ['http:', 'https:'].includes(u.protocol); }
    catch { return false; }
}
function sanitizeUrl(str) {
    str = str.trim();
    if (str && !str.startsWith('http') && !str.startsWith('#')) str = 'https://' + str;
    return str;
}

// ---- HTML Escaping ----
function esc(t) { const d = document.createElement('div'); d.textContent = t; return d.innerHTML; }

// ---- Defaults ----
const DEFAULT_CATEGORIES = [
    { id: 'most-used', name: 'Most Used', color: '#17D6E5', columns: 6 },
    { id: 'govt', name: 'Government Offices', color: '#FF017B', columns: 5 },
    { id: 'web-pages', name: 'TWLF Web Pages', color: '#51CA20', columns: 3 },
    { id: 'reference', name: 'Reference', color: '#FFBE00', columns: 5 },
    { id: 'writing-ai', name: 'Writing & AI', color: '#9B59B6', columns: 4 },
    { id: 'ai-tools', name: 'AI Tools', color: '#E67E22', columns: 4 },
    { id: 'social', name: 'Social Media', color: '#3498DB', columns: 4 },
    { id: 'texas-bar', name: 'Texas Bar', color: '#E74C3C', columns: 4 },
    { id: 'associations', name: 'Associations', color: '#1ABC9C', columns: 4 },
    { id: 'law-books', name: 'Law Books', color: '#8E44AD', columns: 2 },
    { id: 'experts', name: 'Experts', color: '#F39C12', columns: 2 }
];

const DEFAULT_TILES = [
    // Widgets
    { id: 'w-search', name: 'Google Search', url: '#', category: 'most-used', color: '#ffffff', size: '3x1', widgetType: 'search' },
    { id: 'w-clock', name: 'Clock', url: '#', category: 'most-used', color: '#1a1a2e', size: '1x1', widgetType: 'clock' },
    { id: 'w-notes', name: 'Notes', url: '#', category: 'most-used', color: '#1a1a2e', size: '2x2', widgetType: 'notes' },
    { id: 'w-todo', name: 'To Do', url: '#', category: 'most-used', color: '#1a1a2e', size: '2x2', widgetType: 'todo' },
    // Most Used
    { id: 't1', name: 'Clio', url: 'https://account.clio.com/', category: 'most-used', color: '#0B70CE', size: '1x1' },
    { id: 't2', name: 'Box', url: 'https://app.box.com/folder/0', category: 'most-used', color: '#0061D5', size: '1x1' },
    { id: 't3', name: 'eFile Texas', url: 'https://www.efiletexas.gov/', category: 'most-used', color: '#1C3A5F', size: '1x1' },
    { id: 't4', name: 'Proof', url: 'https://app.proofserve.com/', category: 'most-used', color: '#27AE60', size: '1x1' },
    { id: 't5', name: 'WestLaw', url: 'https://lawschool.thomsonreuters.com/', category: 'most-used', color: '#E87722', size: '1x1' },
    { id: 't6', name: 'LexisNexis', url: 'https://plusai.lexis.com/', category: 'most-used', color: '#D0232A', size: '1x1' },
    { id: 't7', name: 'Letterstream', url: 'https://www.letterstream.com/', category: 'most-used', color: '#2980B9', size: '1x1' },
    { id: 't8', name: 'Public Data', url: 'https://www.publicdata.com/', category: 'most-used', color: '#6C3483', size: '1x1' },
    { id: 't9', name: 'eFile Texas (Old)', url: 'https://texas.tylertech.cloud/OfsWeb', category: 'most-used', color: '#5D6D7E', size: '1x1' },
    { id: 't10', name: 're:SearchTX', url: 'https://research.txcourts.gov/CourtRecordsSearch/#!/dashboard', category: 'most-used', color: '#1A5276', size: '1x1' },
    { id: 't11', name: 'CRIS Purchase', url: 'https://cris.dot.state.tx.us/public/Purchase/app/home', category: 'most-used', color: '#117A65', size: '1x1' },
    { id: 't12', name: 'Houston Public Records', url: 'https://houstontx.govqa.us/WEBAPP/_rs/(S(x1znyclu25l1jq31hgycgwrs))/SupportHome.aspx', category: 'most-used', color: '#C0392B', size: '1x1' },
    // Government Offices
    { id: 't13', name: 'MoCo District Clerk', url: 'https://www.mctx.org/departments/departments_d_-_f/district_clerk/index.php', category: 'govt', color: '#8B1A4A', size: '1x1' },
    { id: 't14', name: 'MoCo Odyssey', url: 'https://odyssey.mctx.org/Secured/Login.aspx', category: 'govt', color: '#A93226', size: '1x1' },
    { id: 't15', name: 'HC District Clerk', url: 'https://www.hcdistrictclerk.com/Common/Default.aspx', category: 'govt', color: '#6C3483', size: '1x1' },
    { id: 't16', name: 'HC County Clerk', url: 'https://cclerk.hctx.net/', category: 'govt', color: '#1C2833', size: '1x1' },
    { id: 't17', name: 'Secretary of State', url: 'https://www.sos.state.tx.us/corp/sosda/index.shtml', category: 'govt', color: '#148F77', size: '1x1' },
    { id: 't18', name: 'PACER', url: 'https://pacer.login.uscourts.gov/csologin/login.jsf', category: 'govt', color: '#21618C', size: '1x1' },
    { id: 't19', name: 'Harris JP Public', url: 'http://www.jp.hctx.net/#gsc.tab=0', category: 'govt', color: '#CA6F1E', size: '1x1' },
    { id: 't20', name: 'Harris JP Odyssey', url: 'https://jpodysseyportal.harriscountytx.gov/OdysseyPortalJP', category: 'govt', color: '#AF601A', size: '1x1' },
    { id: 't21', name: 'Jefferson Co Clerk', url: 'https://co.jefferson.tx.us/dclerk/index.html', category: 'govt', color: '#117A65', size: '1x1' },
    { id: 't22', name: 'Harris Probate', url: 'https://www.cclerk.hctx.net/applications/websearch/CourtSearch.aspx?CaseType=Probate', category: 'govt', color: '#7D3C98', size: '1x1' },
    { id: 't23', name: 'MoCo County Clerk', url: 'https://countyfusion1.kofiletech.us/countyweb/loginDisplay.action?countyname=MontgomeryTX', category: 'govt', color: '#C0392B', size: '1x1' },
    { id: 't24', name: 'Galveston Clerk', url: 'https://www.galvestoncountytx.gov/our-county/district-clerk', category: 'govt', color: '#2471A3', size: '1x1' },
    { id: 't25', name: 'MoCo County Odyssey', url: 'https://odyssey.mctx.org/County/default.aspx', category: 'govt', color: '#D4AC0D', size: '1x1' },
    // TWLF Web Pages
    { id: 't26', name: 'Estate Site', url: 'https://woodlandslawestate.com', category: 'web-pages', color: '#1E8449', size: '1x1' },
    { id: 't27', name: 'Woodlands Law', url: 'https://Woodlands.law', category: 'web-pages', color: '#196F3D', size: '2x1' },
    { id: 't28', name: 'WordPress', url: 'https://woodlandslaw.info/wp/', category: 'web-pages', color: '#21759B', size: '1x1' },
    { id: 't29', name: 'N8N', url: 'https://n8n.twlf.dev/', category: 'web-pages', color: '#EA4B71', size: '1x1' },
    { id: 't30', name: 'Cal.com', url: 'https://app.cal.com/', category: 'web-pages', color: '#292929', size: '1x1' },
    { id: 't31', name: 'Phone Intake', url: 'https://intake.twlf.dev', category: 'web-pages', color: '#27AE60', size: '1x1' },
    // Reference
    { id: 't32', name: 'TexasLawHelp', url: 'https://texaslawhelp.org/', category: 'reference', color: '#D4A017', size: '1x1' },
    { id: 't33', name: 'TX Free Legal Answers', url: 'https://texas.freelegalanswers.org/', category: 'reference', color: '#2471A3', size: '1x1' },
    { id: 't34', name: 'Pre-Judgment Calc', url: 'http://www.csgnetwork.com/interestloancalc.html', category: 'reference', color: '#CA6F1E', size: '1x1' },
    { id: 't35', name: 'Post-Judgment Calc', url: 'https://www.webwinder.com/calculators/post_judge_calc.html', category: 'reference', color: '#C0392B', size: '1x1' },
    { id: 't36', name: 'Houston Incidents', url: 'https://dmwilson.info/', category: 'reference', color: '#922B21', size: '1x1' },
    { id: 't37', name: 'Debt Collector Lookup', url: 'https://direct.sos.state.tx.us/debtcollectors/DCSearch.asp', category: 'reference', color: '#6C3483', size: '1x1' },
    { id: 't38', name: 'Date Calculator', url: 'https://www.timeanddate.com/date/duration.html', category: 'reference', color: '#1C2833', size: '1x1' },
    { id: 't39', name: 'SCRA', url: 'https://scra.dmdc.osd.mil/scra/#/login', category: 'reference', color: '#148F77', size: '1x1' },
    { id: 't40', name: 'STCL Clinic', url: 'https://www.stcl.edu/academics/legal-clinics/request-legal-assistance/', category: 'reference', color: '#7D3C98', size: '1x1' },
    { id: 't41', name: 'Bloomberg Law', url: 'https://news.bloomberglaw.com/', category: 'reference', color: '#1A5276', size: '1x1' },
    { id: 't42', name: 'Checkpoint', url: 'https://checkpoint.riag.com/app/login', category: 'reference', color: '#1E8449', size: '1x1' },
    { id: 't43', name: 'Court Deadlines', url: 'https://courtdeadlines.com/', category: 'reference', color: '#C0392B', size: '1x1' },
    { id: 't44', name: 'Clio University', url: 'https://cliouniversity.learnupon.com/dashboard', category: 'reference', color: '#0B70CE', size: '1x1' },
    // Writing & AI
    { id: 't45', name: 'ChatGPT', url: 'https://chat.openai.com/', category: 'writing-ai', color: '#10A37F', size: '1x1' },
    { id: 't46', name: 'Gemini', url: 'https://deepmind.google/technologies/gemini/', category: 'writing-ai', color: '#4285F4', size: '1x1' },
    { id: 't47', name: 'Claude', url: 'https://claude.ai/new', category: 'writing-ai', color: '#D97757', size: '1x1' },
    { id: 't48', name: 'Grammarly', url: 'https://app.grammarly.com/', category: 'writing-ai', color: '#15C39A', size: '1x1' },
    { id: 't49', name: 'GroqChat', url: 'https://chat.groq.com/', category: 'writing-ai', color: '#F55036', size: '1x1' },
    { id: 't50', name: 'QuillBot', url: 'https://quillbot.com', category: 'writing-ai', color: '#499557', size: '1x1' },
    { id: 't51', name: 'WLF-AI', url: 'https://wlf-ai.com/', category: 'writing-ai', color: '#7D3C98', size: '1x1' },
    { id: 't52', name: 'N8N Auto', url: 'https://n8n.twlf.dev/', category: 'writing-ai', color: '#EA4B71', size: '1x1' },
    { id: 't53', name: 'Prompt Library', url: 'https://docs.anthropic.com/en/resources/prompt-library/library', category: 'writing-ai', color: '#D97757', size: '1x1' },
    { id: 't54', name: 'Perplexity', url: 'https://www.perplexity.ai/', category: 'writing-ai', color: '#1FB8CD', size: '1x1' },
    { id: 't55', name: 'NotebookLM', url: 'https://notebooklm.google.com/', category: 'writing-ai', color: '#FBBC04', size: '1x1' },
    { id: 't56', name: 'GPT Prompts', url: 'https://academy.openai.com/public/clubs/work-users-ynjqu/resources/chatgpt-for-any-role', category: 'writing-ai', color: '#10A37F', size: '1x1' },
    // AI Tools
    { id: 't57', name: 'PimEyes', url: 'https://pimeyes.com/en', category: 'ai-tools', color: '#CA6F1E', size: '1x1' },
    { id: 't58', name: 'Fathom', url: 'https://fathom.video/', category: 'ai-tools', color: '#7C3AED', size: '1x1' },
    { id: 't59', name: 'Spellbook', url: 'https://www.spellbook.legal/', category: 'ai-tools', color: '#6366F1', size: '1x1' },
    { id: 't60', name: 'EvenUp', url: 'https://www.evenuplaw.com/', category: 'ai-tools', color: '#2563EB', size: '1x1' },
    { id: 't61', name: 'DISCO', url: 'https://csdisco.com/', category: 'ai-tools', color: '#06B6D4', size: '1x1' },
    { id: 't62', name: 'Pre-dicta', url: 'https://www.pre-dicta.com/', category: 'ai-tools', color: '#14B8A6', size: '1x1' },
    { id: 't63', name: 'SlidesAI', url: 'https://www.slidesai.io/', category: 'ai-tools', color: '#F59E0B', size: '1x1' },
    { id: 't64', name: 'Beautiful.ai', url: 'https://www.beautiful.ai/', category: 'ai-tools', color: '#EC4899', size: '1x1' },
    // Social Media
    { id: 't65', name: 'Radaar', url: 'https://www.radaar.io/', category: 'social', color: '#6366F1', size: '1x1' },
    { id: 't66', name: 'Facebook', url: 'https://www.facebook.com/', category: 'social', color: '#1877F2', size: '1x1' },
    { id: 't67', name: 'Instagram', url: 'https://www.instagram.com/', category: 'social', color: '#E4405F', size: '1x1' },
    { id: 't68', name: 'X', url: 'https://x.com', category: 'social', color: '#1C2833', size: '1x1' },
    { id: 't69', name: 'TikTok', url: 'http://tiktok.com', category: 'social', color: '#010101', size: '1x1' },
    { id: 't70', name: 'LinkedIn', url: 'https://linkedin.com', category: 'social', color: '#0A66C2', size: '1x1' },
    { id: 't71', name: 'Blog Admin', url: 'https://woodlandslaw.info/wp/admin', category: 'social', color: '#21759B', size: '1x1' },
    // Texas Bar
    { id: 't72', name: 'Bar Benefits', url: 'https://texasbar.memberbenefits.com/', category: 'texas-bar', color: '#C0392B', size: '1x1' },
    { id: 't73', name: 'State Bar of TX', url: 'https://www.texasbar.com/AM/Template.cfm?Section=Lawyers_Home', category: 'texas-bar', color: '#922B21', size: '2x1' },
    { id: 't74', name: 'LRIS', url: 'https://www.texasbar.com/AM/Template.cfm?Section=Join_or_Manage_Your_LRIS_Account', category: 'texas-bar', color: '#CA6F1E', size: '1x1' },
    { id: 't75', name: 'TX Bar Careers', url: 'https://l.tx.bar.associationcareernetwork.com/', category: 'texas-bar', color: '#2471A3', size: '1x1' },
    { id: 't76', name: 'TLAP', url: 'https://www.tlaphelps.org/', category: 'texas-bar', color: '#27AE60', size: '1x1' },
    { id: 't77', name: 'TexasBarCLE', url: 'http://www.texasbarcle.com/CLE/Home.asp', category: 'texas-bar', color: '#7D3C98', size: '1x1' },
    { id: 't78', name: 'TX Bar Practice', url: 'https://www.texasbarpractice.com/', category: 'texas-bar', color: '#D4A017', size: '1x1' },
    // Associations
    { id: 't79', name: 'Houston Bar', url: 'https://www.hba.org/?pg=myhba', category: 'associations', color: '#148F77', size: '1x1' },
    { id: 't80', name: 'Woodlands Bar', url: 'https://www.woodlandsbarassociation.com/', category: 'associations', color: '#1E8449', size: '1x1' },
    { id: 't81', name: 'Federalist Society', url: 'https://fedsoc.org/', category: 'associations', color: '#1C2833', size: '1x1' },
    { id: 't82', name: 'MoCo Bar Assoc', url: 'https://mcbatx.com/', category: 'associations', color: '#117A65', size: '1x1' },
    // Law Books
    { id: 't83', name: 'West Academic', url: 'https://signin.westacademic.com/', category: 'law-books', color: '#6C3483', size: '1x1' },
    { id: 't84', name: 'CasebookConnect', url: 'https://www.casebookconnect.com/login', category: 'law-books', color: '#4A235A', size: '1x1' },
    // Experts
    { id: 't85', name: 'JurisPro', url: 'https://www.jurispro.com/', category: 'experts', color: '#D4A017', size: '1x1' },
    { id: 't86', name: 'SEAK Experts', url: 'https://www.seakexperts.com/', category: 'experts', color: '#CA6F1E', size: '1x1' },
];

const TILE_COLORS = [
    '#17D6E5','#FF017B','#51CA20','#FFBE00','#9B59B6',
    '#E67E22','#3498DB','#E74C3C','#1ABC9C','#1C2833',
    '#D4A017','#6C3483','#2471A3','#1E8449','#AF601A',
    '#922B21','#117A65','#5D6D7E','#27AE60','#6366F1',
    '#EC4899','#10A37F','#F59E0B','#06B6D4','#0B70CE','#ffffff'
];

const SEARCH_ENGINES = [
    { name: 'Google', url: 'https://www.google.com/search?q=', icon: 'https://www.google.com/favicon.ico' },
    { name: 'Bing', url: 'https://www.bing.com/search?q=', icon: 'https://www.bing.com/favicon.ico' },
    { name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=', icon: 'https://duckduckgo.com/favicon.ico' }
];

const SIZES = ['1x1', '2x1', '2x2', '3x1', '4x1'];
const SHAPES = ['square', 'rectangle', 'circle'];
const EMPTY_CELLS_PER_ROW = 8;

// ---- State ----
let state = {
    dashboards: [],
    activeDashboard: null,
    settings: {
        theme: 'dark',
        bgType: 'color',
        bgColor: '#0f1923',
        bgGradient1: '#0f1923',
        bgGradient2: '#1a2a3a',
        bgGradientDir: 'to bottom',
        bgImage: '',
        tileSize: 100,
        tileShape: 'square',
        showLabels: true,
        showHeaders: true,
        showEmptyCells: true,
        searchEngine: 0
    },
    notes: '',
    todos: [],
    editMode: false,
    editingTile: null
};

// ---- Computed ----
function getActiveDashboard() {
    return state.dashboards.find(d => d.id === state.activeDashboard) || state.dashboards[0];
}

// ---- Init ----
function init() {
    loadState();
    applyTheme();
    applyTileSize(state.settings.tileSize);
    applyTileShape(state.settings.tileShape);
    applyBackground();
    applyDisplaySettings();
    renderDashboardTabs();
    renderSidebar();
    renderGrid();
    startClock();
    setupEventListeners();
    setupSearch();
    startWidgetClocks();
    checkShareImport();
}

function loadState() {
    const s = localStorage.getItem('twlf-portal-v5');
    if (s) {
        try {
            const parsed = JSON.parse(s);
            state = { ...state, ...parsed };
            if (!state.dashboards || state.dashboards.length === 0) migrateFromV4();
        } catch { resetToDefaults(); }
    } else {
        migrateFromV4();
    }
    if (!state.dashboards || state.dashboards.length === 0) resetToDefaults();
}

function migrateFromV4() {
    const v4 = localStorage.getItem('twlf-portal-v4');
    if (v4) {
        try {
            const old = JSON.parse(v4);
            state.dashboards = [{
                id: 'main',
                name: 'Main Dashboard',
                categories: old.categories || JSON.parse(JSON.stringify(DEFAULT_CATEGORIES)),
                tiles: old.tiles || JSON.parse(JSON.stringify(DEFAULT_TILES))
            }];
            state.activeDashboard = 'main';
            if (old.settings) state.settings = { ...state.settings, ...old.settings };
            state.notes = old.notes || '';
            state.todos = old.todos || [];
            saveState();
            return;
        } catch {}
    }
    resetToDefaults();
}

function saveState() {
    localStorage.setItem('twlf-portal-v5', JSON.stringify(state));
}

function resetToDefaults() {
    state.dashboards = [{
        id: 'main',
        name: 'Main Dashboard',
        categories: JSON.parse(JSON.stringify(DEFAULT_CATEGORIES)),
        tiles: JSON.parse(JSON.stringify(DEFAULT_TILES))
    }];
    state.activeDashboard = 'main';
    state.settings = {
        theme: 'dark', bgType: 'color', bgColor: '#0f1923',
        bgGradient1: '#0f1923', bgGradient2: '#1a2a3a', bgGradientDir: 'to bottom',
        bgImage: '', tileSize: 100, tileShape: 'square',
        showLabels: true, showHeaders: true, showEmptyCells: true, searchEngine: 0
    };
    state.notes = '';
    state.todos = [];
    saveState();
}

// ---- Apply Settings ----
function applyTheme() {
    const theme = state.settings.theme || 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    const btn = document.getElementById('themeBtn');
    if (btn) btn.querySelector('i').className = theme === 'light' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    // Auto-switch background color when using default colors
    const darkDefaults = ['#0f1923', '#1a1a2e', '#162231'];
    const lightDefaults = ['#f0f2f5', '#ffffff', '#e8eaed'];
    if (state.settings.bgType === 'color' || !state.settings.bgType) {
        if (theme === 'light' && darkDefaults.includes(state.settings.bgColor)) {
            state.settings.bgColor = '#f0f2f5';
        } else if (theme === 'dark' && lightDefaults.includes(state.settings.bgColor)) {
            state.settings.bgColor = '#0f1923';
        }
    }
    applyBackground();
}

function applyTileSize(sz) {
    sz = parseInt(sz) || 100;
    document.documentElement.style.setProperty('--cell', sz + 'px');
    document.documentElement.style.setProperty('--radius', Math.max(6, Math.round(sz * 0.14)) + 'px');
    document.documentElement.style.setProperty('--gap', Math.max(3, Math.round(sz * 0.06)) + 'px');
}

function applyTileShape(shape) {
    document.body.classList.remove('shape-square', 'shape-rectangle', 'shape-circle');
    document.body.classList.add('shape-' + (shape || 'square'));
    const btn = document.getElementById('tileShapeBtn');
    if (btn) {
        const icons = { square: 'fa-square', rectangle: 'fa-rectangle-list', circle: 'fa-circle' };
        btn.querySelector('i').className = 'fa-solid ' + (icons[shape] || 'fa-square');
    }
}

function applyBackground() {
    const s = state.settings;
    if (s.bgType === 'image' && s.bgImage) {
        document.body.style.backgroundImage = `url(${s.bgImage})`;
        document.body.style.backgroundColor = '';
    } else if (s.bgType === 'gradient') {
        document.body.style.backgroundImage = `linear-gradient(${s.bgGradientDir || 'to bottom'}, ${s.bgGradient1 || '#0f1923'}, ${s.bgGradient2 || '#1a2a3a'})`;
        document.body.style.backgroundColor = '';
    } else {
        document.body.style.backgroundImage = '';
        document.body.style.backgroundColor = s.bgColor || '';
    }
}

function applyDisplaySettings() {
    document.body.classList.toggle('hide-labels', state.settings.showLabels === false);
    document.body.classList.toggle('hide-headers', state.settings.showHeaders === false);
    document.body.classList.toggle('show-empty', state.settings.showEmptyCells !== false);
}

// ---- Render Dashboard Tabs ----
function renderDashboardTabs() {
    const container = document.getElementById('dashboardTabs');
    container.innerHTML = '';
    if (state.dashboards.length <= 1) { container.style.display = 'none'; return; }
    container.style.display = 'flex';
    state.dashboards.forEach(d => {
        const tab = document.createElement('button');
        tab.className = 'dash-tab' + (d.id === state.activeDashboard ? ' active' : '');
        tab.textContent = d.name;
        tab.addEventListener('click', () => switchDashboard(d.id));
        container.appendChild(tab);
    });
}

function switchDashboard(id) {
    state.activeDashboard = id;
    saveState();
    renderDashboardTabs();
    renderSidebar();
    renderGrid();
}

// ---- Render Sidebar ----
function renderSidebar() {
    const list = document.getElementById('dashboardList');
    list.innerHTML = '';
    state.dashboards.forEach(d => {
        const tileCount = d.tiles ? d.tiles.filter(t => !t.widgetType).length : 0;
        const item = document.createElement('div');
        item.className = 'sidebar-item' + (d.id === state.activeDashboard ? ' active' : '');
        item.innerHTML = `
            <i class="fa-solid fa-grip"></i>
            <span class="dash-name">${esc(d.name)}</span>
            <span class="dash-count">${tileCount}</span>
            <div class="sidebar-item-actions">
                <button class="rename-dash" title="Rename"><i class="fa-solid fa-pen"></i></button>
                ${state.dashboards.length > 1 ? '<button class="delete-dash" title="Delete"><i class="fa-solid fa-trash"></i></button>' : ''}
            </div>
        `;
        item.addEventListener('click', e => {
            if (e.target.closest('.sidebar-item-actions')) return;
            switchDashboard(d.id);
            closeSidebar();
        });
        const renameBtn = item.querySelector('.rename-dash');
        if (renameBtn) renameBtn.addEventListener('click', e => { e.stopPropagation(); renameDashboard(d.id); });
        const deleteBtn = item.querySelector('.delete-dash');
        if (deleteBtn) deleteBtn.addEventListener('click', e => { e.stopPropagation(); deleteDashboard(d.id); });
        list.appendChild(item);
    });
}

function addDashboard() {
    const name = prompt('Dashboard name:');
    if (!name || !name.trim()) return;
    const id = 'dash-' + Date.now();
    state.dashboards.push({
        id, name: name.trim(),
        categories: JSON.parse(JSON.stringify(DEFAULT_CATEGORIES)),
        tiles: []
    });
    switchDashboard(id);
    renderSidebar();
}

function renameDashboard(id) {
    const d = state.dashboards.find(x => x.id === id);
    if (!d) return;
    const name = prompt('New name:', d.name);
    if (name && name.trim()) { d.name = name.trim(); saveState(); renderDashboardTabs(); renderSidebar(); }
}

function deleteDashboard(id) {
    if (state.dashboards.length <= 1) return;
    if (!confirm('Delete this dashboard?')) return;
    state.dashboards = state.dashboards.filter(d => d.id !== id);
    if (state.activeDashboard === id) state.activeDashboard = state.dashboards[0].id;
    saveState(); renderDashboardTabs(); renderSidebar(); renderGrid();
}

function openSidebar() {
    document.getElementById('sidebar').classList.add('open');
    let overlay = document.querySelector('.sidebar-overlay');
    if (!overlay) { overlay = document.createElement('div'); overlay.className = 'sidebar-overlay'; document.body.appendChild(overlay); }
    overlay.classList.add('active');
    overlay.onclick = closeSidebar;
}
function closeSidebar() {
    document.getElementById('sidebar').classList.remove('open');
    const overlay = document.querySelector('.sidebar-overlay');
    if (overlay) overlay.classList.remove('active');
}

// ---- Compute category card width ----
function getCatWidth(cols, catTileSize) {
    const cellSize = catTileSize || state.settings.tileSize || 100;
    const gap = Math.max(3, Math.round(cellSize * 0.06));
    // width = cols * cell + (cols-1) * gap + padding(20) + border(2)
    return cols * cellSize + (cols - 1) * gap + 22;
}

// ---- Render Grid ----
function renderGrid() {
    const dash = getActiveDashboard();
    if (!dash) return;
    const container = document.getElementById('gridContainer');
    container.innerHTML = '';

    dash.categories.forEach(cat => {
        const tiles = dash.tiles.filter(t => t.category === cat.id);
        if (tiles.length === 0 && !state.editMode) return;

        const cols = cat.columns || 6;

        const section = document.createElement('div');
        section.className = 'category-section';
        section.dataset.catId = cat.id;
        section.style.width = getCatWidth(cols, cat.tileSize) + 'px';
        section.draggable = true;

        // Apply per-category styles
        if (cat.bgColor) {
            const opacity = cat.bgOpacity != null ? cat.bgOpacity : 1;
            section.style.background = hexToRgba(cat.bgColor, opacity);
        }

        // Header
        const hdr = document.createElement('div');
        hdr.className = 'category-header';
        if (cat.headerColor) hdr.style.background = cat.headerColor;
        hdr.innerHTML = `
            <div class="cat-color-bar" style="background:${cat.color}"></div>
            <h2>${esc(cat.name)}</h2>
            <div class="cat-actions">
                <button class="cat-wider" title="Wider"><i class="fa-solid fa-arrow-right"></i></button>
                <button class="cat-narrower" title="Narrower"><i class="fa-solid fa-arrow-left"></i></button>
                <span class="cat-size-label">${cols} col</span>
                <button title="Add tile" onclick="openAddModal('${cat.id}')"><i class="fa-solid fa-plus"></i></button>
            </div>
            <button class="cat-menu-btn" title="Category settings"><i class="fa-solid fa-ellipsis-vertical"></i></button>
        `;
        section.appendChild(hdr);

        // Three-dot menu
        hdr.querySelector('.cat-menu-btn').addEventListener('click', e => {
            e.stopPropagation();
            openCatSettings(cat, hdr.querySelector('.cat-menu-btn'));
        });

        // Resize buttons
        hdr.querySelector('.cat-wider').addEventListener('click', e => {
            e.stopPropagation();
            cat.columns = Math.min(12, (cat.columns || 6) + 1);
            saveState(); renderGrid();
        });
        hdr.querySelector('.cat-narrower').addEventListener('click', e => {
            e.stopPropagation();
            cat.columns = Math.max(1, (cat.columns || 6) - 1);
            saveState(); renderGrid();
        });

        // Grid
        const grid = document.createElement('div');
        grid.className = 'tile-grid';
        grid.dataset.category = cat.id;
        grid.style.setProperty('--cat-cols', cols);
        // Per-category tile size
        if (cat.tileSize) {
            grid.style.setProperty('--cell', cat.tileSize + 'px');
            grid.style.setProperty('--gap', Math.max(3, Math.round(cat.tileSize * 0.06)) + 'px');
            grid.style.setProperty('--radius', Math.max(6, Math.round(cat.tileSize * 0.14)) + 'px');
        }

        tiles.forEach(t => grid.appendChild(createTile(t)));

        // Empty cells to fill remaining row
        const totalCells = tiles.length;
        const remainder = totalCells % cols;
        const emptyCellCount = remainder === 0 ? cols : (cols - remainder);
        for (let i = 0; i < emptyCellCount; i++) {
            const empty = document.createElement('div');
            empty.className = 'empty-cell';
            empty.innerHTML = '<i class="fa-solid fa-plus empty-icon"></i>';
            empty.addEventListener('click', () => openAddModal(cat.id));
            grid.appendChild(empty);
        }

        section.appendChild(grid);
        container.appendChild(section);
    });

    setupDragAndDrop();
    setupCategoryDragAndDrop();
}

// ---- Category Drag & Drop ----
let catDragId = null;

function setupCategoryDragAndDrop() {
    const container = document.getElementById('gridContainer');

    container.querySelectorAll('.category-section').forEach(section => {
        // Only start drag from the header area
        const header = section.querySelector('.category-header');

        header.addEventListener('mousedown', () => {
            section.setAttribute('draggable', 'true');
        });
        header.addEventListener('mouseup', () => {
            section.setAttribute('draggable', 'true');
        });

        section.addEventListener('dragstart', e => {
            // Only allow drag if initiated from header
            if (!e.target.closest('.category-header') && !e.target.closest('.category-section[draggable]')) {
                e.preventDefault(); return;
            }
            // Don't drag if it's a tile being dragged
            if (e.target.closest('.tile')) { return; }

            catDragId = section.dataset.catId;
            section.classList.add('cat-dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', 'category:' + catDragId);
        });

        section.addEventListener('dragend', () => {
            section.classList.remove('cat-dragging');
            container.querySelectorAll('.cat-drag-over').forEach(x => x.classList.remove('cat-drag-over'));
            catDragId = null;
        });

        section.addEventListener('dragover', e => {
            if (!catDragId) return;
            const target = e.target.closest('.category-section');
            if (!target || target.dataset.catId === catDragId) return;
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            container.querySelectorAll('.cat-drag-over').forEach(x => x.classList.remove('cat-drag-over'));
            target.classList.add('cat-drag-over');
        });

        section.addEventListener('dragleave', e => {
            const target = e.target.closest('.category-section');
            if (target && !target.contains(e.relatedTarget)) {
                target.classList.remove('cat-drag-over');
            }
        });

        section.addEventListener('drop', e => {
            if (!catDragId) return;
            const target = e.target.closest('.category-section');
            if (!target || target.dataset.catId === catDragId) return;
            e.preventDefault();
            e.stopPropagation();
            container.querySelectorAll('.cat-drag-over').forEach(x => x.classList.remove('cat-drag-over'));

            const dash = getActiveDashboard();
            const fi = dash.categories.findIndex(c => c.id === catDragId);
            const ti = dash.categories.findIndex(c => c.id === target.dataset.catId);
            if (fi === -1 || ti === -1) return;
            const [moved] = dash.categories.splice(fi, 1);
            dash.categories.splice(ti, 0, moved);
            catDragId = null;
            saveState(); renderGrid();
        });
    });
}

// ---- Create Tile ----
function createTile(tile) {
    const size = tile.size || '1x1';
    const isWidget = !!tile.widgetType;

    const el = document.createElement('div');
    el.className = `tile size-${size}`;
    if (isWidget) el.classList.add('widget-tile');
    el.style.background = tile.color || '#333';
    el.dataset.id = tile.id;
    el.draggable = true;

    // Marker
    if (tile.marker) {
        const marker = document.createElement('div');
        marker.className = 'tile-marker';
        marker.style.background = tile.marker;
        el.appendChild(marker);
    }

    if (isWidget) {
        renderWidget(el, tile);
    } else {
        renderBookmarkTile(el, tile);
    }

    // Context menu
    el.addEventListener('contextmenu', e => { e.preventDefault(); showContextMenu(e, tile); });

    return el;
}

function renderBookmarkTile(el, tile) {
    // Icon
    const iconDiv = document.createElement('div');
    iconDiv.className = 'tile-icon';
    const img = document.createElement('img');
    const clearbit = getLogoUrl(tile.url);
    const google = getGoogleFavicon(tile.url, 128);
    img.src = tile.customIconUrl || clearbit;
    img.alt = tile.name;
    img.loading = 'lazy';
    img.onerror = function () {
        if (!tile.customIconUrl && this.src !== google && google) {
            this.onerror = function () { letterFallback(this.parentElement, tile); };
            this.src = google;
        } else { letterFallback(this.parentElement, tile); }
    };
    iconDiv.appendChild(img);
    el.appendChild(iconDiv);

    // Label
    const label = document.createElement('div');
    label.className = 'tile-label';
    label.textContent = tile.name;
    el.appendChild(label);

    // Click
    el.addEventListener('click', e => {
        if (state.editMode) { e.preventDefault(); openEditModal(tile); return; }
        const target = tile.openIn === 'same' ? '_self' : '_blank';
        const a = document.createElement('a');
        a.href = tile.url;
        a.target = target;
        a.rel = 'noopener noreferrer';
        a.click();
    });
}

function letterFallback(parent, tile) {
    parent.innerHTML = '';
    const s = document.createElement('span');
    s.className = 'letter-fallback';
    s.textContent = (tile.name || '?')[0].toUpperCase();
    parent.appendChild(s);
}

// ---- Widget Renderers ----
function renderWidget(el, tile) {
    switch (tile.widgetType) {
        case 'search': renderSearchWidget(el); break;
        case 'clock': renderClockWidget(el); break;
        case 'notes': renderNotesWidget(el); break;
        case 'todo': renderTodoWidget(el); break;
        case 'weather': renderWeatherWidget(el); break;
    }
    if (state.editMode) {
        el.addEventListener('click', e => { if (e.target === el) openEditModal(tile); });
    }
}

function renderSearchWidget(el) {
    el.classList.add('widget-search');
    el.innerHTML = `
        <div class="g-logo"><span class="g-b">G</span><span class="g-r">o</span><span class="g-y">o</span><span class="g-b">g</span><span class="g-g">l</span><span class="g-r">e</span></div>
        <div class="widget-search-bar">
            <input type="text" placeholder="Search the web..." class="widget-search-input">
            <i class="fa-solid fa-magnifying-glass"></i>
        </div>
    `;
    const input = el.querySelector('.widget-search-input');
    input.addEventListener('keydown', e => {
        if (e.key === 'Enter' && input.value.trim()) {
            const a = document.createElement('a');
            a.href = 'https://www.google.com/search?q=' + encodeURIComponent(input.value.trim());
            a.target = '_blank'; a.rel = 'noopener noreferrer'; a.click();
            input.value = '';
        }
    });
    input.addEventListener('click', e => e.stopPropagation());
}

function renderClockWidget(el) {
    el.classList.add('widget-clock');
    el.innerHTML = '<div class="clock-time"></div><div class="clock-date"></div>';
    updateClockWidget(el);
}

function updateClockWidget(el) {
    const now = new Date();
    const t = el.querySelector('.clock-time');
    const d = el.querySelector('.clock-date');
    if (t) t.textContent = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    if (d) d.textContent = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function startWidgetClocks() {
    setInterval(() => { document.querySelectorAll('.widget-clock').forEach(updateClockWidget); }, 30000);
}

function renderNotesWidget(el) {
    el.classList.add('widget-notes');
    el.innerHTML = `<div class="widget-note-label"><i class="fa-solid fa-sticky-note"></i> Notes</div><textarea class="widget-notes-area" placeholder="Type notes...">${esc(state.notes || '')}</textarea>`;
    const ta = el.querySelector('textarea');
    ta.addEventListener('click', e => e.stopPropagation());
    ta.addEventListener('input', () => { state.notes = ta.value; saveState(); });
}

function renderTodoWidget(el) {
    el.classList.add('widget-todo');
    const header = document.createElement('div');
    header.className = 'widget-todo-header';
    header.innerHTML = '<i class="fa-solid fa-list-check"></i> To Do';
    el.appendChild(header);

    const list = document.createElement('ul');
    list.className = 'todo-mini-list';
    (state.todos || []).forEach((todo, idx) => {
        const li = document.createElement('li');
        if (todo.done) li.classList.add('done');
        li.innerHTML = `<input type="checkbox" ${todo.done ? 'checked' : ''}><span>${esc(todo.text)}</span>`;
        li.querySelector('input').addEventListener('change', e => {
            e.stopPropagation();
            state.todos[idx].done = !state.todos[idx].done;
            saveState(); renderGrid();
        });
        li.addEventListener('click', e => e.stopPropagation());
        list.appendChild(li);
    });
    el.appendChild(list);

    const inputRow = document.createElement('div');
    inputRow.className = 'todo-mini-input';
    inputRow.innerHTML = '<input type="text" placeholder="Add task..."><button>+</button>';
    const inp = inputRow.querySelector('input');
    const btn = inputRow.querySelector('button');
    const addFn = () => {
        if (!inp.value.trim()) return;
        if (!state.todos) state.todos = [];
        state.todos.push({ text: inp.value.trim(), done: false });
        inp.value = '';
        saveState(); renderGrid();
    };
    btn.addEventListener('click', e => { e.stopPropagation(); addFn(); });
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') addFn(); });
    inp.addEventListener('click', e => e.stopPropagation());
    el.appendChild(inputRow);
}

function renderWeatherWidget(el) {
    el.classList.add('widget-weather');
    el.innerHTML = '<div class="weather-temp"><i class="fa-solid fa-cloud-sun"></i> --\u00B0F</div><div class="weather-desc">Weather</div><div class="weather-loc">The Woodlands, TX</div>';
}

// ---- Modals ----
function openAddModal(catId) {
    state.editingTile = null;
    document.getElementById('modalTitle').textContent = 'Add Tile';
    document.getElementById('tileName').value = '';
    document.getElementById('tileUrl').value = '';
    document.getElementById('tileIconUrl').value = '';
    document.getElementById('tileWidgetType').value = '';
    document.getElementById('tileOpenIn').value = 'new';
    document.getElementById('modalDelete').style.display = 'none';
    document.getElementById('urlValidation').textContent = '';
    const dash = getActiveDashboard();
    populateCategorySelect(catId || (dash.categories[0] && dash.categories[0].id));
    setSelectedSize('1x1');
    setSelectedMarker('');
    renderColorPicker(TILE_COLORS[0]);
    document.getElementById('tileModal').classList.add('active');
}

function openEditModal(tile) {
    state.editingTile = tile;
    document.getElementById('modalTitle').textContent = 'Edit Tile';
    document.getElementById('tileName').value = tile.name;
    document.getElementById('tileUrl').value = tile.url;
    document.getElementById('tileIconUrl').value = tile.customIconUrl || '';
    document.getElementById('tileWidgetType').value = tile.widgetType || '';
    document.getElementById('tileOpenIn').value = tile.openIn || 'new';
    document.getElementById('modalDelete').style.display = 'block';
    document.getElementById('urlValidation').textContent = '';
    populateCategorySelect(tile.category);
    setSelectedSize(tile.size || '1x1');
    setSelectedMarker(tile.marker || '');
    renderColorPicker(tile.color || TILE_COLORS[0]);
    document.getElementById('tileModal').classList.add('active');
}

function populateCategorySelect(selectedId) {
    const dash = getActiveDashboard();
    const sel = document.getElementById('tileCategory');
    sel.innerHTML = '';
    dash.categories.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id; opt.textContent = c.name;
        if (c.id === selectedId) opt.selected = true;
        sel.appendChild(opt);
    });
}

function setSelectedSize(size) {
    document.querySelectorAll('.size-option').forEach(o => {
        o.classList.toggle('selected', o.dataset.size === size);
    });
}

function getSelectedSize() {
    const s = document.querySelector('.size-option.selected');
    return s ? s.dataset.size : '1x1';
}

function setSelectedMarker(marker) {
    document.querySelectorAll('.marker-option').forEach(o => {
        o.classList.toggle('selected', o.dataset.marker === (marker || ''));
    });
}

function getSelectedMarker() {
    const m = document.querySelector('.marker-option.selected');
    return m ? m.dataset.marker : '';
}

function renderColorPicker(selected) {
    const p = document.getElementById('colorPicker');
    p.innerHTML = '';
    TILE_COLORS.forEach(c => {
        const s = document.createElement('div');
        s.className = `color-swatch${c === selected ? ' selected' : ''}`;
        s.style.background = c; s.dataset.hex = c;
        s.addEventListener('click', () => {
            p.querySelectorAll('.color-swatch').forEach(x => x.classList.remove('selected'));
            s.classList.add('selected');
        });
        p.appendChild(s);
    });
}

function getSelectedColor() {
    const s = document.querySelector('#colorPicker .color-swatch.selected');
    return s ? s.dataset.hex : TILE_COLORS[0];
}

function saveTileFromModal() {
    const name = document.getElementById('tileName').value.trim();
    let url = document.getElementById('tileUrl').value.trim();
    const icon = document.getElementById('tileIconUrl').value.trim();
    const color = getSelectedColor();
    const size = getSelectedSize();
    const marker = getSelectedMarker();
    const category = document.getElementById('tileCategory').value;
    const widgetType = document.getElementById('tileWidgetType').value || undefined;
    const openIn = document.getElementById('tileOpenIn').value;

    if (!name) return;

    // URL validation
    url = sanitizeUrl(url || '#');
    if (url !== '#' && !isValidUrl(url)) {
        document.getElementById('urlValidation').textContent = 'Invalid URL format';
        document.getElementById('urlValidation').className = 'url-validation invalid';
        return;
    }

    const dash = getActiveDashboard();

    if (state.editingTile) {
        const t = dash.tiles.find(x => x.id === state.editingTile.id);
        if (t) {
            Object.assign(t, { name, url, color, size, category, openIn,
                customIconUrl: icon || undefined, widgetType,
                marker: marker || undefined
            });
        }
    } else {
        dash.tiles.push({
            id: 't' + Date.now(), name, url, color, size, category, openIn,
            customIconUrl: icon || undefined, widgetType,
            marker: marker || undefined
        });
    }
    saveState(); renderGrid(); closeTileModal();
}

function deleteTile() {
    if (!state.editingTile) return;
    if (!confirm(`Delete "${state.editingTile.name}"?`)) return;
    const dash = getActiveDashboard();
    dash.tiles = dash.tiles.filter(t => t.id !== state.editingTile.id);
    saveState(); renderGrid(); closeTileModal();
}

function closeTileModal() {
    document.getElementById('tileModal').classList.remove('active');
    state.editingTile = null;
}

// ---- Context Menu ----
let ctxTile = null;

function showContextMenu(e, tile) {
    ctxTile = tile;
    const m = document.getElementById('contextMenu');
    m.classList.add('active');
    m.style.left = Math.min(e.clientX, window.innerWidth - 200) + 'px';
    m.style.top = Math.min(e.clientY, window.innerHeight - 220) + 'px';
}

function hideContextMenu() {
    document.getElementById('contextMenu').classList.remove('active');
    ctxTile = null;
}

function handleCtx(action) {
    if (!ctxTile) return;
    const tile = ctxTile;
    hideContextMenu();
    const dash = getActiveDashboard();

    switch (action) {
        case 'edit':
            openEditModal(tile); break;
        case 'resize': {
            const cur = SIZES.indexOf(tile.size || '1x1');
            const next = SIZES[(cur + 1) % SIZES.length];
            const t = dash.tiles.find(x => x.id === tile.id);
            if (t) { t.size = next; saveState(); renderGrid(); }
            break;
        }
        case 'color': {
            const c = prompt('Hex color (e.g. #FF017B):', tile.color);
            if (c && /^#[0-9A-Fa-f]{3,6}$/.test(c)) {
                const t = dash.tiles.find(x => x.id === tile.id);
                if (t) { t.color = c; saveState(); renderGrid(); }
            }
            break;
        }
        case 'marker': {
            const t = dash.tiles.find(x => x.id === tile.id);
            if (t) {
                const markers = ['', '#FF017B', '#51CA20', '#FFBE00', '#3498DB', '#E74C3C', '#9B59B6'];
                const cur = markers.indexOf(t.marker || '');
                t.marker = markers[(cur + 1) % markers.length] || undefined;
                saveState(); renderGrid();
            }
            break;
        }
        case 'openin': {
            const t = dash.tiles.find(x => x.id === tile.id);
            if (t) { t.openIn = t.openIn === 'same' ? 'new' : 'same'; saveState(); }
            break;
        }
        case 'duplicate': {
            dash.tiles.push({ ...tile, id: 't' + Date.now() });
            saveState(); renderGrid(); break;
        }
        case 'delete':
            if (confirm(`Delete "${tile.name}"?`)) {
                dash.tiles = dash.tiles.filter(x => x.id !== tile.id);
                saveState(); renderGrid();
            }
            break;
    }
}

// ---- Settings ----
function openSettings() {
    const s = state.settings;
    document.getElementById('settingsTheme').value = s.theme || 'dark';
    document.getElementById('bgType').value = s.bgType || 'color';
    document.getElementById('bgColor').value = s.bgColor || '#0f1923';
    document.getElementById('bgGradient1').value = s.bgGradient1 || '#0f1923';
    document.getElementById('bgGradient2').value = s.bgGradient2 || '#1a2a3a';
    document.getElementById('bgGradientDir').value = s.bgGradientDir || 'to bottom';
    document.getElementById('bgImage').value = s.bgImage || '';
    document.getElementById('settingsTileShape').value = s.tileShape || 'square';
    document.getElementById('showLabels').checked = s.showLabels !== false;
    document.getElementById('showSectionHeaders').checked = s.showHeaders !== false;
    document.getElementById('showEmptyCells').checked = s.showEmptyCells !== false;
    updateBgTypeVisibility();
    renderCategoryManageList();
    document.getElementById('settingsModal').classList.add('active');
}

function updateBgTypeVisibility() {
    const type = document.getElementById('bgType').value;
    document.querySelector('.bg-color-group').style.display = type === 'color' ? '' : 'none';
    document.querySelector('.bg-gradient-group').style.display = type === 'gradient' ? '' : 'none';
    document.querySelector('.bg-image-group').style.display = type === 'image' ? '' : 'none';
}

function renderCategoryManageList() {
    const dash = getActiveDashboard();
    const list = document.getElementById('categoryManageList');
    list.innerHTML = '';
    dash.categories.forEach(cat => {
        const item = document.createElement('div');
        item.className = 'cat-manage-item';
        item.innerHTML = `
            <div class="cat-manage-color" style="background:${cat.color}"></div>
            <span class="cat-manage-name">${esc(cat.name)}</span>
            <button title="Delete category"><i class="fa-solid fa-xmark"></i></button>
        `;
        item.querySelector('button').addEventListener('click', () => {
            if (!confirm(`Delete category "${cat.name}"? Tiles in this category will be removed.`)) return;
            dash.categories = dash.categories.filter(c => c.id !== cat.id);
            dash.tiles = dash.tiles.filter(t => t.category !== cat.id);
            saveState(); renderGrid(); renderCategoryManageList();
        });
        list.appendChild(item);
    });
}

function saveSettings() {
    state.settings.theme = document.getElementById('settingsTheme').value;
    state.settings.bgType = document.getElementById('bgType').value;
    state.settings.bgColor = document.getElementById('bgColor').value;
    state.settings.bgGradient1 = document.getElementById('bgGradient1').value;
    state.settings.bgGradient2 = document.getElementById('bgGradient2').value;
    state.settings.bgGradientDir = document.getElementById('bgGradientDir').value;
    state.settings.bgImage = document.getElementById('bgImage').value.trim();
    state.settings.tileShape = document.getElementById('settingsTileShape').value;
    state.settings.showLabels = document.getElementById('showLabels').checked;
    state.settings.showHeaders = document.getElementById('showSectionHeaders').checked;
    state.settings.showEmptyCells = document.getElementById('showEmptyCells').checked;

    saveState();
    applyTheme(); applyTileShape(state.settings.tileShape);
    applyBackground(); applyDisplaySettings();
    renderGrid();
    document.getElementById('settingsModal').classList.remove('active');
}

// ---- Share ----
function openShare() {
    const dash = getActiveDashboard();
    const data = { name: dash.name, categories: dash.categories, tiles: dash.tiles };
    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(data))));
    const url = window.location.origin + window.location.pathname + '?import=' + encoded;
    document.getElementById('shareLink').value = url;
    document.getElementById('shareStatus').textContent = '';
    document.getElementById('shareModal').classList.add('active');
}

function checkShareImport() {
    const params = new URLSearchParams(window.location.search);
    const importData = params.get('import');
    if (!importData) return;
    try {
        const json = JSON.parse(decodeURIComponent(escape(atob(importData))));
        if (json.name && json.categories && json.tiles) {
            if (confirm(`Import dashboard "${json.name}" with ${json.tiles.length} tiles?`)) {
                const id = 'dash-' + Date.now();
                state.dashboards.push({ id, name: json.name, categories: json.categories, tiles: json.tiles });
                switchDashboard(id);
            }
        }
    } catch { /* invalid share link */ }
    window.history.replaceState({}, '', window.location.pathname);
}

// ---- Drag & Drop ----
function setupDragAndDrop() {
    document.querySelectorAll('.tile-grid').forEach(grid => {
        let dragId = null;
        grid.addEventListener('dragstart', e => {
            const t = e.target.closest('.tile[data-id]');
            if (!t) return;
            dragId = t.dataset.id;
            t.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', 'tile:' + dragId);
            e.stopPropagation(); // prevent category drag
            catDragId = null; // ensure category drag doesn't fire
        });
        grid.addEventListener('dragend', e => {
            const t = e.target.closest('.tile');
            if (t) t.classList.remove('dragging');
            grid.querySelectorAll('.drag-over').forEach(x => x.classList.remove('drag-over'));
        });
        grid.addEventListener('dragover', e => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            const t = e.target.closest('.tile[data-id]');
            if (t && t.dataset.id !== dragId) {
                grid.querySelectorAll('.drag-over').forEach(x => x.classList.remove('drag-over'));
                t.classList.add('drag-over');
            }
        });
        grid.addEventListener('dragleave', e => {
            const t = e.target.closest('.tile');
            if (t) t.classList.remove('drag-over');
        });
        grid.addEventListener('drop', e => {
            e.preventDefault();
            grid.querySelectorAll('.drag-over').forEach(x => x.classList.remove('drag-over'));
            const target = e.target.closest('.tile[data-id]');
            if (!target || !dragId || target.dataset.id === dragId) return;
            const dash = getActiveDashboard();
            const fi = dash.tiles.findIndex(t => t.id === dragId);
            const ti = dash.tiles.findIndex(t => t.id === target.dataset.id);
            if (fi === -1 || ti === -1) return;
            const [m] = dash.tiles.splice(fi, 1);
            dash.tiles.splice(ti, 0, m);
            saveState(); renderGrid();
        });
    });
}

// ---- Search ----
function setupSearch() {
    const input = document.getElementById('searchInput');
    const results = document.getElementById('searchResults');

    input.addEventListener('input', () => {
        const q = input.value.trim().toLowerCase();
        if (!q) { results.classList.remove('active'); results.innerHTML = ''; return; }

        // Search across all dashboards
        const allTiles = state.dashboards.flatMap(d => d.tiles.filter(t => !t.widgetType));
        const matches = allTiles.filter(t =>
            t.name.toLowerCase().includes(q) || t.url.toLowerCase().includes(q)
        ).slice(0, 8);

        results.innerHTML = '';
        matches.forEach(tile => {
            const item = document.createElement('div');
            item.className = 'search-result-item';
            item.innerHTML = `
                <div class="result-icon" style="background:${tile.color}">
                    <img src="${tile.customIconUrl || getLogoUrl(tile.url)}" alt=""
                         onerror="this.src='${getGoogleFavicon(tile.url, 32)}';this.onerror=null">
                </div>
                <div class="result-info">
                    <div class="result-name">${esc(tile.name)}</div>
                    <div class="result-url">${esc(tile.url)}</div>
                </div>
            `;
            item.addEventListener('click', () => {
                const a = document.createElement('a');
                a.href = tile.url; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.click();
                input.value = ''; results.classList.remove('active');
            });
            results.appendChild(item);
        });

        // Web search option
        const web = document.createElement('div');
        web.className = 'search-result-web';
        const eng = SEARCH_ENGINES[state.settings.searchEngine || 0];
        web.innerHTML = `<i class="fa-solid fa-magnifying-glass"></i> Search "${esc(input.value)}" on ${eng.name}`;
        web.addEventListener('click', () => {
            const a = document.createElement('a');
            a.href = eng.url + encodeURIComponent(input.value); a.target = '_blank'; a.rel = 'noopener noreferrer'; a.click();
            input.value = ''; results.classList.remove('active');
        });
        results.appendChild(web);
        results.classList.add('active');
    });

    input.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            const q = input.value.trim();
            if (!q) return;
            const allTiles = state.dashboards.flatMap(d => d.tiles.filter(t => !t.widgetType));
            const m = allTiles.find(t => t.name.toLowerCase().includes(q.toLowerCase()));
            const a = document.createElement('a');
            a.href = m ? m.url : SEARCH_ENGINES[state.settings.searchEngine || 0].url + encodeURIComponent(q);
            a.target = '_blank'; a.rel = 'noopener noreferrer'; a.click();
            input.value = ''; results.classList.remove('active');
        } else if (e.key === 'Escape') {
            input.value = ''; results.classList.remove('active'); input.blur();
        }
    });

    document.addEventListener('click', e => {
        if (!e.target.closest('.header-center')) results.classList.remove('active');
    });

    document.getElementById('searchEngineToggle').addEventListener('click', () => {
        state.settings.searchEngine = ((state.settings.searchEngine || 0) + 1) % SEARCH_ENGINES.length;
        document.getElementById('searchEngineIcon').src = SEARCH_ENGINES[state.settings.searchEngine].icon;
        saveState();
    });
}

// ---- Clock ----
function startClock() {
    const el = document.getElementById('clock');
    const upd = () => {
        el.textContent = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    };
    upd();
    setInterval(upd, 30000);
}

// ---- Edit Mode ----
function toggleEditMode() {
    state.editMode = !state.editMode;
    document.body.classList.toggle('edit-mode', state.editMode);
    document.getElementById('editModeBtn').classList.toggle('active', state.editMode);
    renderGrid();
}

// ---- Event Listeners ----
function setupEventListeners() {
    // Slider
    const slider = document.getElementById('tileSizeSlider');
    slider.value = state.settings.tileSize || 100;
    slider.addEventListener('input', () => {
        state.settings.tileSize = parseInt(slider.value);
        applyTileSize(state.settings.tileSize);
        // Update category card widths
        document.querySelectorAll('.category-section').forEach(sec => {
            const catId = sec.dataset.catId;
            const dash = getActiveDashboard();
            const cat = dash.categories.find(c => c.id === catId);
            if (cat) sec.style.width = getCatWidth(cat.columns || 6, cat.tileSize) + 'px';
        });
        saveState();
    });

    // Labels toggle
    const lblBtn = document.getElementById('toggleLabels');
    lblBtn.classList.toggle('active', state.settings.showLabels !== false);
    lblBtn.addEventListener('click', () => {
        state.settings.showLabels = !state.settings.showLabels;
        lblBtn.classList.toggle('active', state.settings.showLabels);
        document.body.classList.toggle('hide-labels', !state.settings.showLabels);
        saveState();
    });

    // Tile shape
    document.getElementById('tileShapeBtn').addEventListener('click', () => {
        const cur = SHAPES.indexOf(state.settings.tileShape || 'square');
        state.settings.tileShape = SHAPES[(cur + 1) % SHAPES.length];
        applyTileShape(state.settings.tileShape);
        saveState();
    });

    // Theme
    document.getElementById('themeBtn').addEventListener('click', () => {
        state.settings.theme = state.settings.theme === 'dark' ? 'light' : 'dark';
        applyTheme(); saveState();
    });

    // Edit mode
    document.getElementById('editModeBtn').addEventListener('click', toggleEditMode);
    document.getElementById('exitEditBtn').addEventListener('click', toggleEditMode);

    // Add tile
    document.getElementById('addTileBtn').addEventListener('click', () => openAddModal());

    // Share
    document.getElementById('shareBtn').addEventListener('click', openShare);
    document.getElementById('shareClose').addEventListener('click', () => document.getElementById('shareModal').classList.remove('active'));
    document.getElementById('copyShareLink').addEventListener('click', () => {
        const link = document.getElementById('shareLink');
        navigator.clipboard.writeText(link.value).then(() => {
            document.getElementById('shareStatus').textContent = 'Link copied!';
        });
    });

    // Sidebar
    document.getElementById('sidebarToggle').addEventListener('click', () => {
        document.getElementById('sidebar').classList.contains('open') ? closeSidebar() : openSidebar();
    });
    document.getElementById('addDashboardBtn').addEventListener('click', addDashboard);
    document.getElementById('sidebarSettingsBtn').addEventListener('click', () => { closeSidebar(); openSettings(); });

    // Settings
    document.getElementById('settingsBtn').addEventListener('click', openSettings);
    document.getElementById('settingsClose').addEventListener('click', () => document.getElementById('settingsModal').classList.remove('active'));
    document.getElementById('settingsSave').addEventListener('click', saveSettings);
    document.getElementById('bgType').addEventListener('change', updateBgTypeVisibility);

    // Tile modal
    document.getElementById('modalClose').addEventListener('click', closeTileModal);
    document.getElementById('modalCancel').addEventListener('click', closeTileModal);
    document.getElementById('modalSave').addEventListener('click', saveTileFromModal);
    document.getElementById('modalDelete').addEventListener('click', deleteTile);

    // URL validation
    document.getElementById('tileUrl').addEventListener('input', e => {
        const v = document.getElementById('urlValidation');
        const url = sanitizeUrl(e.target.value.trim());
        if (!url || url === '#') { v.textContent = ''; v.className = 'url-validation'; }
        else if (isValidUrl(url)) { v.textContent = '\u2713 Valid URL'; v.className = 'url-validation valid'; }
        else { v.textContent = '\u2717 Invalid URL'; v.className = 'url-validation invalid'; }
    });

    // Size picker
    document.querySelectorAll('.size-option').forEach(o => {
        o.addEventListener('click', () => {
            document.querySelectorAll('.size-option').forEach(x => x.classList.remove('selected'));
            o.classList.add('selected');
        });
    });

    // Marker picker
    document.querySelectorAll('.marker-option').forEach(o => {
        o.addEventListener('click', () => {
            document.querySelectorAll('.marker-option').forEach(x => x.classList.remove('selected'));
            o.classList.add('selected');
        });
    });

    // Add category
    document.getElementById('addCategoryBtn').addEventListener('click', () => {
        const name = document.getElementById('newCategoryName').value.trim();
        const color = document.getElementById('newCategoryColor').value;
        if (!name) return;
        const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const dash = getActiveDashboard();
        if (dash.categories.find(c => c.id === id)) { alert('Category already exists'); return; }
        dash.categories.push({ id, name, color });
        document.getElementById('newCategoryName').value = '';
        saveState(); renderGrid(); renderCategoryManageList();
    });

    // Export
    document.getElementById('exportBtn').addEventListener('click', () => {
        const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'twlf-portal-backup.json';
        a.click();
    });

    // Import
    document.getElementById('importBtn').addEventListener('click', () => document.getElementById('importFile').click());
    document.getElementById('importFile').addEventListener('change', e => {
        const f = e.target.files[0];
        if (!f) return;
        const r = new FileReader();
        r.onload = ev => {
            try {
                const parsed = JSON.parse(ev.target.result);
                state = { ...state, ...parsed };
                saveState();
                applyTheme(); applyTileSize(state.settings.tileSize);
                applyTileShape(state.settings.tileShape);
                applyBackground(); applyDisplaySettings();
                renderDashboardTabs(); renderSidebar(); renderGrid();
                alert('Import successful!');
            } catch { alert('Invalid file.'); }
        };
        r.readAsText(f);
        e.target.value = '';
    });

    // Reset
    document.getElementById('resetBtn').addEventListener('click', () => {
        if (!confirm('Reset everything to defaults?')) return;
        localStorage.removeItem('twlf-portal-v5');
        localStorage.removeItem('twlf-portal-v4');
        resetToDefaults();
        applyTheme(); applyTileSize(state.settings.tileSize);
        applyTileShape(state.settings.tileShape);
        applyBackground(); applyDisplaySettings();
        renderDashboardTabs(); renderSidebar(); renderGrid();
        document.getElementById('settingsModal').classList.remove('active');
    });

    // Context menu
    document.querySelectorAll('.context-item[data-action]').forEach(i =>
        i.addEventListener('click', () => handleCtx(i.dataset.action))
    );
    document.addEventListener('click', e => { if (!e.target.closest('.context-menu')) hideContextMenu(); });

    // Close modals on overlay
    document.querySelectorAll('.modal-overlay').forEach(o =>
        o.addEventListener('click', e => { if (e.target === o) o.classList.remove('active'); })
    );

    // ---- Keyboard Shortcuts ----
    document.addEventListener('keydown', e => {
        // Don't fire shortcuts when typing in inputs
        const isTyping = e.target.closest('input, textarea, select');

        if (e.key === 'Escape') {
            if (state.editMode) { toggleEditMode(); return; }
            document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
            hideContextMenu();
            closeSidebar();
            return;
        }

        if (isTyping) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault(); document.getElementById('searchInput').focus();
            }
            return;
        }

        switch (e.key) {
            case '/':
                e.preventDefault();
                document.getElementById('searchInput').focus();
                break;
            case 'e': case 'E':
                toggleEditMode(); break;
            case 'a': case 'A':
                openAddModal(); break;
            case 's': case 'S':
                openSettings(); break;
            case 't': case 'T':
                state.settings.theme = state.settings.theme === 'dark' ? 'light' : 'dark';
                applyTheme(); saveState(); break;
            case 'l': case 'L':
                document.getElementById('toggleLabels').click(); break;
            default:
                // 1-9 to switch dashboards
                if (e.key >= '1' && e.key <= '9') {
                    const idx = parseInt(e.key) - 1;
                    if (state.dashboards[idx]) switchDashboard(state.dashboards[idx].id);
                }
        }
    });

    // Ctrl+K search
    document.addEventListener('keydown', e => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            document.getElementById('searchInput').focus();
        }
    });
}

// ---- Utilities ----
function hexToRgba(hex, a) {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return `rgba(${r},${g},${b},${a})`;
}

// ---- Category Settings Popover ----
let activeCatPopover = null;

function closeCatSettings() {
    if (activeCatPopover) {
        activeCatPopover.remove();
        activeCatPopover = null;
    }
}

function openCatSettings(cat, anchorEl) {
    closeCatSettings();

    const popover = document.createElement('div');
    popover.className = 'cat-settings-popover active';

    const cols = cat.columns || 6;
    const bgColor = cat.bgColor || (document.documentElement.getAttribute('data-theme') === 'light' ? '#ffffff' : '#162231');
    const bgOpacity = cat.bgOpacity != null ? cat.bgOpacity : 1;
    const headerColor = cat.headerColor || '';
    const tileSize = cat.tileSize || state.settings.tileSize || 100;

    popover.innerHTML = `
        <div class="cat-settings-header">
            <h4>${esc(cat.name)}</h4>
            <button class="cat-settings-close">&times;</button>
        </div>
        <div class="cat-settings-body">
            <div class="cat-settings-group">
                <label>Category Name</label>
                <input type="text" class="cs-name" value="${esc(cat.name)}">
            </div>
            <div class="cat-settings-group">
                <label>Columns Wide</label>
                <div class="cat-settings-row">
                    <input type="range" class="cs-cols" min="1" max="12" value="${cols}" step="1">
                    <span class="cat-settings-range-val cs-cols-val">${cols}</span>
                </div>
            </div>
            <div class="cat-settings-group">
                <label>Card Background Color</label>
                <div class="cat-settings-row">
                    <input type="color" class="cs-bg-color" value="${bgColor}">
                    <input type="text" class="cs-bg-color-text" value="${bgColor}" style="flex:1">
                </div>
            </div>
            <div class="cat-settings-group">
                <label>Card Background Opacity</label>
                <div class="cat-settings-row">
                    <input type="range" class="cs-opacity" min="0" max="100" value="${Math.round(bgOpacity * 100)}" step="5">
                    <span class="cat-settings-range-val cs-opacity-val">${Math.round(bgOpacity * 100)}%</span>
                </div>
            </div>
            <div class="cat-settings-group">
                <label>Header Bar Color</label>
                <div class="cat-settings-row">
                    <input type="color" class="cs-header-color" value="${headerColor || cat.color}">
                    <input type="text" class="cs-header-color-text" value="${headerColor || cat.color}" style="flex:1">
                </div>
            </div>
            <div class="cat-settings-group">
                <label>Accent / Marker Color</label>
                <div class="cat-settings-row">
                    <input type="color" class="cs-accent-color" value="${cat.color}">
                    <input type="text" class="cs-accent-text" value="${cat.color}" style="flex:1">
                </div>
            </div>
            <div class="cat-settings-group">
                <label>Tile Size (this category)</label>
                <div class="cat-settings-row">
                    <input type="range" class="cs-tile-size" min="50" max="160" value="${tileSize}" step="2">
                    <span class="cat-settings-range-val cs-tile-size-val">${tileSize}px</span>
                </div>
            </div>
        </div>
        <div class="cat-settings-footer">
            <button class="btn btn-danger btn-sm cs-delete-cat" style="margin-right:auto"><i class="fa-solid fa-trash"></i> Delete</button>
            <button class="btn btn-secondary cs-cancel">Cancel</button>
            <button class="btn btn-primary cs-save">Save</button>
        </div>
    `;

    // Position near the anchor
    document.body.appendChild(popover);
    const rect = anchorEl.getBoundingClientRect();
    let left = rect.right + 8;
    let top = rect.top;
    // Keep in viewport
    if (left + 290 > window.innerWidth) left = rect.left - 290;
    if (top + popover.offsetHeight > window.innerHeight) top = window.innerHeight - popover.offsetHeight - 10;
    if (top < 60) top = 60;
    popover.style.left = left + 'px';
    popover.style.top = top + 'px';
    popover.style.position = 'fixed';

    activeCatPopover = popover;

    // Live preview: columns slider
    const colsSlider = popover.querySelector('.cs-cols');
    const colsVal = popover.querySelector('.cs-cols-val');
    colsSlider.addEventListener('input', () => { colsVal.textContent = colsSlider.value; });

    // Live preview: opacity slider
    const opacitySlider = popover.querySelector('.cs-opacity');
    const opacityVal = popover.querySelector('.cs-opacity-val');
    opacitySlider.addEventListener('input', () => { opacityVal.textContent = opacitySlider.value + '%'; });

    // Live preview: tile size slider
    const tileSizeSlider = popover.querySelector('.cs-tile-size');
    const tileSizeVal = popover.querySelector('.cs-tile-size-val');
    tileSizeSlider.addEventListener('input', () => { tileSizeVal.textContent = tileSizeSlider.value + 'px'; });

    // Sync color inputs
    const bgColorInput = popover.querySelector('.cs-bg-color');
    const bgColorText = popover.querySelector('.cs-bg-color-text');
    bgColorInput.addEventListener('input', () => { bgColorText.value = bgColorInput.value; });
    bgColorText.addEventListener('input', () => { if (/^#[0-9A-Fa-f]{6}$/.test(bgColorText.value)) bgColorInput.value = bgColorText.value; });

    const hdrColorInput = popover.querySelector('.cs-header-color');
    const hdrColorText = popover.querySelector('.cs-header-color-text');
    hdrColorInput.addEventListener('input', () => { hdrColorText.value = hdrColorInput.value; });
    hdrColorText.addEventListener('input', () => { if (/^#[0-9A-Fa-f]{6}$/.test(hdrColorText.value)) hdrColorInput.value = hdrColorText.value; });

    const accentInput = popover.querySelector('.cs-accent-color');
    const accentText = popover.querySelector('.cs-accent-text');
    accentInput.addEventListener('input', () => { accentText.value = accentInput.value; });
    accentText.addEventListener('input', () => { if (/^#[0-9A-Fa-f]{6}$/.test(accentText.value)) accentInput.value = accentText.value; });

    // Close
    popover.querySelector('.cat-settings-close').addEventListener('click', closeCatSettings);
    popover.querySelector('.cs-cancel').addEventListener('click', closeCatSettings);

    // Delete
    popover.querySelector('.cs-delete-cat').addEventListener('click', () => {
        if (!confirm(`Delete category "${cat.name}"? All tiles in this category will be removed.`)) return;
        const dash = getActiveDashboard();
        dash.categories = dash.categories.filter(c => c.id !== cat.id);
        dash.tiles = dash.tiles.filter(t => t.category !== cat.id);
        closeCatSettings();
        saveState(); renderGrid();
    });

    // Save
    popover.querySelector('.cs-save').addEventListener('click', () => {
        const dash = getActiveDashboard();
        const c = dash.categories.find(x => x.id === cat.id);
        if (!c) { closeCatSettings(); return; }

        const newName = popover.querySelector('.cs-name').value.trim();
        if (newName) c.name = newName;
        c.columns = parseInt(colsSlider.value) || 6;
        c.bgColor = bgColorInput.value;
        c.bgOpacity = parseInt(opacitySlider.value) / 100;
        c.headerColor = hdrColorInput.value;
        c.color = accentInput.value;
        c.tileSize = parseInt(tileSizeSlider.value) || 100;

        closeCatSettings();
        saveState(); renderGrid();
    });

    // Close on outside click
    setTimeout(() => {
        const handler = e => {
            if (!popover.contains(e.target) && e.target !== anchorEl) {
                closeCatSettings();
                document.removeEventListener('mousedown', handler);
            }
        };
        document.addEventListener('mousedown', handler);
    }, 50);
}

// ---- Start ----
document.addEventListener('DOMContentLoaded', init);
