/* ============================================
   TWLF Portal - Single-Page Symbaloo Grid
   All categories visible, variable tile sizes,
   inline widgets, real Clearbit logos
   ============================================ */

// ---- Logo helpers ----
function getLogoUrl(url) {
    try {
        const domain = new URL(url).hostname.replace(/^www\./, '');
        return `https://logo.clearbit.com/${domain}`;
    } catch { return ''; }
}

function getGoogleFavicon(url, sz) {
    try {
        return `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=${sz || 128}`;
    } catch { return ''; }
}

// ---- Defaults ----
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

// size: '1x1' | '2x1' | '2x2' | '3x1' | '4x1'
// widgetType: 'search' | 'clock' | 'notes' | 'todo' | 'weather' | undefined
const DEFAULT_TILES = [
    // ─── Widgets (in Most Used) ───
    { id: 'w-search', name: 'Google Search', url: '#', category: 'most-used', color: '#ffffff', size: '3x1', widgetType: 'search' },
    { id: 'w-clock',  name: 'Clock',         url: '#', category: 'most-used', color: '#1a1a2e', size: '1x1', widgetType: 'clock' },
    { id: 'w-notes',  name: 'Notes',         url: '#', category: 'most-used', color: '#1a1a2e', size: '2x2', widgetType: 'notes' },
    { id: 'w-todo',   name: 'To Do',         url: '#', category: 'most-used', color: '#1a1a2e', size: '2x2', widgetType: 'todo' },

    // ─── Most Used ───
    { id: 't1',  name: 'Clio',                  url: 'https://account.clio.com/',               category: 'most-used', color: '#0B70CE', size: '1x1' },
    { id: 't2',  name: 'Box',                   url: 'https://app.box.com/folder/0',            category: 'most-used', color: '#0061D5', size: '1x1' },
    { id: 't3',  name: 'eFile Texas',           url: 'https://www.efiletexas.gov/',             category: 'most-used', color: '#1C3A5F', size: '1x1' },
    { id: 't4',  name: 'Proof',                 url: 'https://app.proofserve.com/',             category: 'most-used', color: '#27AE60', size: '1x1' },
    { id: 't5',  name: 'WestLaw',               url: 'https://lawschool.thomsonreuters.com/',   category: 'most-used', color: '#E87722', size: '1x1' },
    { id: 't6',  name: 'LexisNexis',            url: 'https://plusai.lexis.com/',               category: 'most-used', color: '#D0232A', size: '1x1' },
    { id: 't7',  name: 'Letterstream',          url: 'https://www.letterstream.com/',           category: 'most-used', color: '#2980B9', size: '1x1' },
    { id: 't8',  name: 'Public Data',           url: 'https://www.publicdata.com/',             category: 'most-used', color: '#6C3483', size: '1x1' },
    { id: 't9',  name: 'eFile Texas (Old)',      url: 'https://texas.tylertech.cloud/OfsWeb',    category: 'most-used', color: '#5D6D7E', size: '1x1' },
    { id: 't10', name: 're:SearchTX',           url: 'https://research.txcourts.gov/CourtRecordsSearch/#!/dashboard', category: 'most-used', color: '#1A5276', size: '1x1' },
    { id: 't11', name: 'CRIS Purchase',         url: 'https://cris.dot.state.tx.us/public/Purchase/app/home', category: 'most-used', color: '#117A65', size: '1x1' },
    { id: 't12', name: 'Houston Public Records', url: 'https://houstontx.govqa.us/WEBAPP/_rs/(S(x1znyclu25l1jq31hgycgwrs))/SupportHome.aspx', category: 'most-used', color: '#C0392B', size: '1x1' },

    // ─── Government Offices ───
    { id: 't13', name: 'MoCo District Clerk',   url: 'https://www.mctx.org/departments/departments_d_-_f/district_clerk/index.php', category: 'govt', color: '#8B1A4A', size: '1x1' },
    { id: 't14', name: 'MoCo Odyssey',          url: 'https://odyssey.mctx.org/Secured/Login.aspx', category: 'govt', color: '#A93226', size: '1x1' },
    { id: 't15', name: 'HC District Clerk',      url: 'https://www.hcdistrictclerk.com/Common/Default.aspx', category: 'govt', color: '#6C3483', size: '1x1' },
    { id: 't16', name: 'HC County Clerk',        url: 'https://cclerk.hctx.net/',                category: 'govt', color: '#1C2833', size: '1x1' },
    { id: 't17', name: 'Secretary of State',     url: 'https://www.sos.state.tx.us/corp/sosda/index.shtml', category: 'govt', color: '#148F77', size: '1x1' },
    { id: 't18', name: 'PACER',                 url: 'https://pacer.login.uscourts.gov/csologin/login.jsf', category: 'govt', color: '#21618C', size: '1x1' },
    { id: 't19', name: 'Harris JP Public',       url: 'http://www.jp.hctx.net/#gsc.tab=0',       category: 'govt', color: '#CA6F1E', size: '1x1' },
    { id: 't20', name: 'Harris JP Odyssey',      url: 'https://jpodysseyportal.harriscountytx.gov/OdysseyPortalJP', category: 'govt', color: '#AF601A', size: '1x1' },
    { id: 't21', name: 'Jefferson Co Clerk',     url: 'https://co.jefferson.tx.us/dclerk/index.html', category: 'govt', color: '#117A65', size: '1x1' },
    { id: 't22', name: 'Harris Probate',         url: 'https://www.cclerk.hctx.net/applications/websearch/CourtSearch.aspx?CaseType=Probate', category: 'govt', color: '#7D3C98', size: '1x1' },
    { id: 't23', name: 'MoCo County Clerk',      url: 'https://countyfusion1.kofiletech.us/countyweb/loginDisplay.action?countyname=MontgomeryTX', category: 'govt', color: '#C0392B', size: '1x1' },
    { id: 't24', name: 'Galveston Clerk',        url: 'https://www.galvestoncountytx.gov/our-county/district-clerk', category: 'govt', color: '#2471A3', size: '1x1' },
    { id: 't25', name: 'MoCo County Odyssey',    url: 'https://odyssey.mctx.org/County/default.aspx', category: 'govt', color: '#D4AC0D', size: '1x1' },

    // ─── TWLF Web Pages ───
    { id: 't26', name: 'Estate Site',       url: 'https://woodlandslawestate.com',   category: 'web-pages', color: '#1E8449', size: '1x1' },
    { id: 't27', name: 'Woodlands Law',     url: 'https://Woodlands.law',            category: 'web-pages', color: '#196F3D', size: '2x1' },
    { id: 't28', name: 'WordPress',         url: 'https://woodlandslaw.info/wp/',     category: 'web-pages', color: '#21759B', size: '1x1' },
    { id: 't29', name: 'N8N',               url: 'https://n8n.twlf.dev/',            category: 'web-pages', color: '#EA4B71', size: '1x1' },
    { id: 't30', name: 'Cal.com',           url: 'https://app.cal.com/',              category: 'web-pages', color: '#292929', size: '1x1' },
    { id: 't31', name: 'Phone Intake',      url: 'https://intake.twlf.dev',           category: 'web-pages', color: '#27AE60', size: '1x1' },

    // ─── Reference ───
    { id: 't32', name: 'TexasLawHelp',          url: 'https://texaslawhelp.org/',     category: 'reference', color: '#D4A017', size: '1x1' },
    { id: 't33', name: 'TX Free Legal Answers',  url: 'https://texas.freelegalanswers.org/', category: 'reference', color: '#2471A3', size: '1x1' },
    { id: 't34', name: 'Pre-Judgment Calc',      url: 'http://www.csgnetwork.com/interestloancalc.html', category: 'reference', color: '#CA6F1E', size: '1x1' },
    { id: 't35', name: 'Post-Judgment Calc',     url: 'https://www.webwinder.com/calculators/post_judge_calc.html', category: 'reference', color: '#C0392B', size: '1x1' },
    { id: 't36', name: 'Houston Incidents',      url: 'https://dmwilson.info/',        category: 'reference', color: '#922B21', size: '1x1' },
    { id: 't37', name: 'Debt Collector Lookup',  url: 'https://direct.sos.state.tx.us/debtcollectors/DCSearch.asp', category: 'reference', color: '#6C3483', size: '1x1' },
    { id: 't38', name: 'Date Calculator',        url: 'https://www.timeanddate.com/date/duration.html', category: 'reference', color: '#1C2833', size: '1x1' },
    { id: 't39', name: 'SCRA',                  url: 'https://scra.dmdc.osd.mil/scra/#/login', category: 'reference', color: '#148F77', size: '1x1' },
    { id: 't40', name: 'STCL Clinic',           url: 'https://www.stcl.edu/academics/legal-clinics/request-legal-assistance/', category: 'reference', color: '#7D3C98', size: '1x1' },
    { id: 't41', name: 'Bloomberg Law',          url: 'https://news.bloomberglaw.com/', category: 'reference', color: '#1A5276', size: '1x1' },
    { id: 't42', name: 'Checkpoint',             url: 'https://checkpoint.riag.com/app/login', category: 'reference', color: '#1E8449', size: '1x1' },
    { id: 't43', name: 'Court Deadlines',        url: 'https://courtdeadlines.com/',   category: 'reference', color: '#C0392B', size: '1x1' },
    { id: 't44', name: 'Clio University',        url: 'https://cliouniversity.learnupon.com/dashboard', category: 'reference', color: '#0B70CE', size: '1x1' },

    // ─── Writing & AI ───
    { id: 't45', name: 'ChatGPT',     url: 'https://chat.openai.com/',     category: 'writing-ai', color: '#10A37F', size: '1x1' },
    { id: 't46', name: 'Gemini',      url: 'https://deepmind.google/technologies/gemini/', category: 'writing-ai', color: '#4285F4', size: '1x1' },
    { id: 't47', name: 'Claude',      url: 'https://claude.ai/new',        category: 'writing-ai', color: '#D97757', size: '1x1' },
    { id: 't48', name: 'Grammarly',   url: 'https://app.grammarly.com/',   category: 'writing-ai', color: '#15C39A', size: '1x1' },
    { id: 't49', name: 'GroqChat',    url: 'https://chat.groq.com/',       category: 'writing-ai', color: '#F55036', size: '1x1' },
    { id: 't50', name: 'QuillBot',    url: 'https://quillbot.com',         category: 'writing-ai', color: '#499557', size: '1x1' },
    { id: 't51', name: 'WLF-AI',      url: 'https://wlf-ai.com/',          category: 'writing-ai', color: '#7D3C98', size: '1x1' },
    { id: 't52', name: 'N8N Auto',    url: 'https://n8n.twlf.dev/',        category: 'writing-ai', color: '#EA4B71', size: '1x1' },
    { id: 't53', name: 'Prompt Library', url: 'https://docs.anthropic.com/en/resources/prompt-library/library', category: 'writing-ai', color: '#D97757', size: '1x1' },
    { id: 't54', name: 'Perplexity',  url: 'https://www.perplexity.ai/',   category: 'writing-ai', color: '#1FB8CD', size: '1x1' },
    { id: 't55', name: 'NotebookLM',  url: 'https://notebooklm.google.com/', category: 'writing-ai', color: '#FBBC04', size: '1x1' },
    { id: 't56', name: 'GPT Prompts', url: 'https://academy.openai.com/public/clubs/work-users-ynjqu/resources/chatgpt-for-any-role', category: 'writing-ai', color: '#10A37F', size: '1x1' },

    // ─── AI Tools ───
    { id: 't57', name: 'PimEyes',      url: 'https://pimeyes.com/en',        category: 'ai-tools', color: '#CA6F1E', size: '1x1' },
    { id: 't58', name: 'Fathom',       url: 'https://fathom.video/',          category: 'ai-tools', color: '#7C3AED', size: '1x1' },
    { id: 't59', name: 'Spellbook',    url: 'https://www.spellbook.legal/',   category: 'ai-tools', color: '#6366F1', size: '1x1' },
    { id: 't60', name: 'EvenUp',       url: 'https://www.evenuplaw.com/',     category: 'ai-tools', color: '#2563EB', size: '1x1' },
    { id: 't61', name: 'DISCO',        url: 'https://csdisco.com/',           category: 'ai-tools', color: '#06B6D4', size: '1x1' },
    { id: 't62', name: 'Pre-dicta',    url: 'https://www.pre-dicta.com/',     category: 'ai-tools', color: '#14B8A6', size: '1x1' },
    { id: 't63', name: 'SlidesAI',     url: 'https://www.slidesai.io/',       category: 'ai-tools', color: '#F59E0B', size: '1x1' },
    { id: 't64', name: 'Beautiful.ai', url: 'https://www.beautiful.ai/',      category: 'ai-tools', color: '#EC4899', size: '1x1' },

    // ─── Social Media ───
    { id: 't65', name: 'Radaar',     url: 'https://www.radaar.io/',           category: 'social', color: '#6366F1', size: '1x1' },
    { id: 't66', name: 'Facebook',   url: 'https://www.facebook.com/',        category: 'social', color: '#1877F2', size: '1x1' },
    { id: 't67', name: 'Instagram',  url: 'https://www.instagram.com/',       category: 'social', color: '#E4405F', size: '1x1' },
    { id: 't68', name: 'X',          url: 'https://x.com',                    category: 'social', color: '#1C2833', size: '1x1' },
    { id: 't69', name: 'TikTok',     url: 'http://tiktok.com',                category: 'social', color: '#010101', size: '1x1' },
    { id: 't70', name: 'LinkedIn',   url: 'https://linkedin.com',             category: 'social', color: '#0A66C2', size: '1x1' },
    { id: 't71', name: 'Blog Admin', url: 'https://woodlandslaw.info/wp/admin', category: 'social', color: '#21759B', size: '1x1' },

    // ─── Texas Bar ───
    { id: 't72', name: 'Bar Benefits',     url: 'https://texasbar.memberbenefits.com/', category: 'texas-bar', color: '#C0392B', size: '1x1' },
    { id: 't73', name: 'State Bar of TX',  url: 'https://www.texasbar.com/AM/Template.cfm?Section=Lawyers_Home', category: 'texas-bar', color: '#922B21', size: '2x1' },
    { id: 't74', name: 'LRIS',             url: 'https://www.texasbar.com/AM/Template.cfm?Section=Join_or_Manage_Your_LRIS_Account', category: 'texas-bar', color: '#CA6F1E', size: '1x1' },
    { id: 't75', name: 'TX Bar Careers',   url: 'https://l.tx.bar.associationcareernetwork.com/', category: 'texas-bar', color: '#2471A3', size: '1x1' },
    { id: 't76', name: 'TLAP',             url: 'https://www.tlaphelps.org/',    category: 'texas-bar', color: '#27AE60', size: '1x1' },
    { id: 't77', name: 'TexasBarCLE',      url: 'http://www.texasbarcle.com/CLE/Home.asp', category: 'texas-bar', color: '#7D3C98', size: '1x1' },
    { id: 't78', name: 'TX Bar Practice',  url: 'https://www.texasbarpractice.com/', category: 'texas-bar', color: '#D4A017', size: '1x1' },

    // ─── Associations ───
    { id: 't79', name: 'Houston Bar',        url: 'https://www.hba.org/?pg=myhba',           category: 'associations', color: '#148F77', size: '1x1' },
    { id: 't80', name: 'Woodlands Bar',      url: 'https://www.woodlandsbarassociation.com/', category: 'associations', color: '#1E8449', size: '1x1' },
    { id: 't81', name: 'Federalist Society', url: 'https://fedsoc.org/',                      category: 'associations', color: '#1C2833', size: '1x1' },
    { id: 't82', name: 'MoCo Bar Assoc',     url: 'https://mcbatx.com/',                      category: 'associations', color: '#117A65', size: '1x1' },

    // ─── Law Books ───
    { id: 't83', name: 'West Academic',    url: 'https://signin.westacademic.com/',       category: 'law-books', color: '#6C3483', size: '1x1' },
    { id: 't84', name: 'CasebookConnect',  url: 'https://www.casebookconnect.com/login',  category: 'law-books', color: '#4A235A', size: '1x1' },

    // ─── Experts ───
    { id: 't85', name: 'JurisPro',     url: 'https://www.jurispro.com/',   category: 'experts', color: '#D4A017', size: '1x1' },
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
    { name:'Google', url:'https://www.google.com/search?q=', icon:'https://www.google.com/favicon.ico' },
    { name:'Bing',   url:'https://www.bing.com/search?q=',   icon:'https://www.bing.com/favicon.ico' },
    { name:'DuckDuckGo', url:'https://duckduckgo.com/?q=',   icon:'https://duckduckgo.com/favicon.ico' }
];

const SIZES = ['1x1','2x1','2x2','3x1','4x1'];

// ---- State ----
let state = { categories:[], tiles:[], settings:{ bgColor:'#0f1923', bgImage:'', tileSize:90, showLabels:true, showHeaders:true, searchEngine:0 }, notes:'', todos:[], editMode:false, editingTile:null };

// ---- Init ----
function init() {
    loadState();
    applyTileSize(state.settings.tileSize);
    renderPage();
    applySettings();
    startClock();
    setupEventListeners();
    setupSearch();
    startWidgetClocks();
}

function loadState() {
    const s = localStorage.getItem('twlf-portal-v4');
    if (s) { try { state = { ...state, ...JSON.parse(s) }; } catch { resetToDefaults(); } }
    else resetToDefaults();
}

function saveState() { localStorage.setItem('twlf-portal-v4', JSON.stringify(state)); }

function resetToDefaults() {
    state.categories = JSON.parse(JSON.stringify(DEFAULT_CATEGORIES));
    state.tiles = JSON.parse(JSON.stringify(DEFAULT_TILES));
    state.settings = { bgColor:'#0f1923', bgImage:'', tileSize:90, showLabels:true, showHeaders:true, searchEngine:0 };
    state.notes = ''; state.todos = [];
    saveState();
}

function applyTileSize(sz) {
    sz = parseInt(sz) || 90;
    document.documentElement.style.setProperty('--cell', sz + 'px');
    document.documentElement.style.setProperty('--radius', Math.max(6, Math.round(sz * 0.15)) + 'px');
    document.documentElement.style.setProperty('--gap', Math.max(3, Math.round(sz * 0.06)) + 'px');
}

// ---- Render all categories on one page ----
function renderPage() {
    const main = document.getElementById('mainContent');
    main.innerHTML = '';
    state.categories.forEach(cat => {
        const tiles = state.tiles.filter(t => t.category === cat.id);
        if (tiles.length === 0) return;

        const section = document.createElement('div');
        section.className = 'category-section';

        // Header
        const hdr = document.createElement('div');
        hdr.className = 'category-header';
        hdr.innerHTML = `<div class="cat-color-bar" style="background:${cat.color}"></div><h2>${esc(cat.name)}</h2><div class="cat-line"></div>`;
        section.appendChild(hdr);

        // Grid
        const grid = document.createElement('div');
        grid.className = 'tile-grid';
        grid.dataset.category = cat.id;
        tiles.forEach(t => grid.appendChild(createTile(t)));
        section.appendChild(grid);

        main.appendChild(section);
    });
    setupDragAndDrop();
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
    el.draggable = !isWidget;

    if (isWidget) {
        renderWidget(el, tile);
    } else {
        renderBookmarkTile(el, tile);
    }

    // Context menu (all tiles)
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
        window.open(tile.url, '_blank');
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
        case 'clock':  renderClockWidget(el); break;
        case 'notes':  renderNotesWidget(el); break;
        case 'todo':   renderTodoWidget(el); break;
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
            window.open('https://www.google.com/search?q=' + encodeURIComponent(input.value.trim()), '_blank');
            input.value = '';
        }
    });
    input.addEventListener('click', e => e.stopPropagation());
}

function renderClockWidget(el) {
    el.classList.add('widget-clock');
    el.innerHTML = `<div class="clock-time"></div><div class="clock-date"></div>`;
    updateClockWidget(el);
}

function updateClockWidget(el) {
    const now = new Date();
    const timeEl = el.querySelector('.clock-time');
    const dateEl = el.querySelector('.clock-date');
    if (timeEl) timeEl.textContent = now.toLocaleTimeString('en-US', { hour:'numeric', minute:'2-digit' });
    if (dateEl) dateEl.textContent = now.toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric' });
}

function startWidgetClocks() {
    setInterval(() => {
        document.querySelectorAll('.widget-clock').forEach(updateClockWidget);
    }, 30000);
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
            saveState(); renderPage();
        });
        li.addEventListener('click', e => e.stopPropagation());
        el.appendChild(li);
    });

    const inputRow = document.createElement('div');
    inputRow.className = 'todo-mini-input';
    inputRow.innerHTML = `<input type="text" placeholder="Add task..."><button>+</button>`;
    const inp = inputRow.querySelector('input');
    const btn = inputRow.querySelector('button');
    const addFn = () => {
        if (!inp.value.trim()) return;
        if (!state.todos) state.todos = [];
        state.todos.push({ text: inp.value.trim(), done: false });
        inp.value = '';
        saveState(); renderPage();
    };
    btn.addEventListener('click', e => { e.stopPropagation(); addFn(); });
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') addFn(); });
    inp.addEventListener('click', e => e.stopPropagation());
    el.appendChild(inputRow);
}

function renderWeatherWidget(el) {
    el.classList.add('widget-weather');
    el.innerHTML = `<div class="weather-temp"><i class="fa-solid fa-cloud-sun"></i> --°F</div><div class="weather-desc">Loading...</div><div class="weather-loc">Weather</div>`;
}

// ---- Modals ----
function openAddModal(catId) {
    state.editingTile = null;
    document.getElementById('modalTitle').textContent = 'Add Tile';
    document.getElementById('tileName').value = '';
    document.getElementById('tileUrl').value = '';
    document.getElementById('tileIconUrl').value = '';
    document.getElementById('tileWidgetType').value = '';
    document.getElementById('modalDelete').style.display = 'none';
    populateCategorySelect(catId || (state.categories[0] && state.categories[0].id));
    setSelectedSize('1x1');
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
    document.getElementById('modalDelete').style.display = 'block';
    populateCategorySelect(tile.category);
    setSelectedSize(tile.size || '1x1');
    renderColorPicker(tile.color || TILE_COLORS[0]);
    document.getElementById('tileModal').classList.add('active');
}

function populateCategorySelect(selectedId) {
    const sel = document.getElementById('tileCategory');
    sel.innerHTML = '';
    state.categories.forEach(c => {
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
    const url = document.getElementById('tileUrl').value.trim();
    const icon = document.getElementById('tileIconUrl').value.trim();
    const color = getSelectedColor();
    const size = getSelectedSize();
    const category = document.getElementById('tileCategory').value;
    const widgetType = document.getElementById('tileWidgetType').value || undefined;

    if (!name) return;

    if (state.editingTile) {
        const t = state.tiles.find(x => x.id === state.editingTile.id);
        if (t) { Object.assign(t, { name, url: url || '#', color, size, category, customIconUrl: icon || undefined, widgetType }); }
    } else {
        state.tiles.push({ id: 't' + Date.now(), name, url: url || '#', color, size, category, customIconUrl: icon || undefined, widgetType });
    }
    saveState(); renderPage(); closeTileModal();
}

function deleteTile() {
    if (!state.editingTile || !confirm(`Delete "${state.editingTile.name}"?`)) return;
    state.tiles = state.tiles.filter(t => t.id !== state.editingTile.id);
    saveState(); renderPage(); closeTileModal();
}

function closeTileModal() { document.getElementById('tileModal').classList.remove('active'); state.editingTile = null; }

// ---- Context Menu ----
let ctxTile = null;

function showContextMenu(e, tile) {
    ctxTile = tile;
    const m = document.getElementById('contextMenu');
    m.classList.add('active');
    m.style.left = Math.min(e.clientX, window.innerWidth - 190) + 'px';
    m.style.top = Math.min(e.clientY, window.innerHeight - 170) + 'px';
}

function hideContextMenu() { document.getElementById('contextMenu').classList.remove('active'); ctxTile = null; }

function handleCtx(action) {
    if (!ctxTile) return;
    const tile = ctxTile; hideContextMenu();
    switch (action) {
        case 'edit': openEditModal(tile); break;
        case 'resize': {
            const cur = SIZES.indexOf(tile.size || '1x1');
            const next = SIZES[(cur + 1) % SIZES.length];
            const t = state.tiles.find(x => x.id === tile.id);
            if (t) { t.size = next; saveState(); renderPage(); }
            break;
        }
        case 'color': {
            const c = prompt('Hex color (e.g. #FF017B):', tile.color);
            if (c && /^#[0-9A-Fa-f]{6}$/.test(c)) {
                const t = state.tiles.find(x => x.id === tile.id);
                if (t) { t.color = c; saveState(); renderPage(); }
            }
            break;
        }
        case 'duplicate': {
            state.tiles.push({ ...tile, id: 't' + Date.now() });
            saveState(); renderPage(); break;
        }
        case 'delete':
            if (confirm(`Delete "${tile.name}"?`)) {
                state.tiles = state.tiles.filter(x => x.id !== tile.id);
                saveState(); renderPage();
            }
            break;
    }
}

// ---- Settings ----
function openSettings() {
    document.getElementById('bgColor').value = state.settings.bgColor || '#0f1923';
    document.getElementById('bgImage').value = state.settings.bgImage || '';
    document.getElementById('showLabels').checked = state.settings.showLabels !== false;
    document.getElementById('showSectionHeaders').checked = state.settings.showHeaders !== false;
    document.getElementById('settingsModal').classList.add('active');
}

function saveSettings() {
    state.settings.bgColor = document.getElementById('bgColor').value;
    state.settings.bgImage = document.getElementById('bgImage').value.trim();
    state.settings.showLabels = document.getElementById('showLabels').checked;
    state.settings.showHeaders = document.getElementById('showSectionHeaders').checked;
    saveState(); applySettings();
    document.getElementById('settingsModal').classList.remove('active');
}

function applySettings() {
    const s = state.settings;
    document.body.style.backgroundColor = s.bgColor || '#0f1923';
    document.body.style.backgroundImage = s.bgImage ? `url(${s.bgImage})` : '';
    document.body.classList.toggle('hide-labels', s.showLabels === false);
    document.body.classList.toggle('hide-headers', s.showHeaders === false);
}

// ---- Drag & Drop ----
function setupDragAndDrop() {
    document.querySelectorAll('.tile-grid').forEach(grid => {
        let dragId = null;
        grid.addEventListener('dragstart', e => {
            const t = e.target.closest('.tile[data-id]'); if (!t) return;
            dragId = t.dataset.id; t.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
        });
        grid.addEventListener('dragend', e => {
            const t = e.target.closest('.tile'); if (t) t.classList.remove('dragging');
            grid.querySelectorAll('.drag-over').forEach(x => x.classList.remove('drag-over'));
        });
        grid.addEventListener('dragover', e => {
            e.preventDefault(); e.dataTransfer.dropEffect = 'move';
            const t = e.target.closest('.tile[data-id]');
            if (t && t.dataset.id !== dragId) {
                grid.querySelectorAll('.drag-over').forEach(x => x.classList.remove('drag-over'));
                t.classList.add('drag-over');
            }
        });
        grid.addEventListener('dragleave', e => {
            const t = e.target.closest('.tile'); if (t) t.classList.remove('drag-over');
        });
        grid.addEventListener('drop', e => {
            e.preventDefault();
            grid.querySelectorAll('.drag-over').forEach(x => x.classList.remove('drag-over'));
            const target = e.target.closest('.tile[data-id]');
            if (!target || !dragId || target.dataset.id === dragId) return;
            const fi = state.tiles.findIndex(t => t.id === dragId);
            const ti = state.tiles.findIndex(t => t.id === target.dataset.id);
            if (fi === -1 || ti === -1) return;
            const [m] = state.tiles.splice(fi, 1);
            state.tiles.splice(ti, 0, m);
            saveState(); renderPage();
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
        const matches = state.tiles.filter(t => !t.widgetType && (t.name.toLowerCase().includes(q) || t.url.toLowerCase().includes(q))).slice(0, 8);
        results.innerHTML = '';
        matches.forEach(tile => {
            const item = document.createElement('div');
            item.className = 'search-result-item';
            item.innerHTML = `<div class="result-icon" style="background:${tile.color}"><img src="${tile.customIconUrl || getLogoUrl(tile.url)}" alt="" onerror="this.src='${getGoogleFavicon(tile.url,32)}';this.onerror=null"></div><div class="result-info"><div class="result-name">${esc(tile.name)}</div><div class="result-url">${esc(tile.url)}</div></div>`;
            item.addEventListener('click', () => { window.open(tile.url, '_blank'); input.value = ''; results.classList.remove('active'); });
            results.appendChild(item);
        });
        const web = document.createElement('div');
        web.className = 'search-result-web';
        const eng = SEARCH_ENGINES[state.settings.searchEngine || 0];
        web.innerHTML = `<i class="fa-solid fa-magnifying-glass"></i> Search "${esc(input.value)}" on ${eng.name}`;
        web.addEventListener('click', () => { window.open(eng.url + encodeURIComponent(input.value), '_blank'); input.value = ''; results.classList.remove('active'); });
        results.appendChild(web);
        results.classList.add('active');
    });
    input.addEventListener('keydown', e => {
        if (e.key === 'Enter') { const q = input.value.trim(); if (!q) return; const m = state.tiles.find(t => !t.widgetType && t.name.toLowerCase().includes(q.toLowerCase())); if (m) window.open(m.url,'_blank'); else window.open(SEARCH_ENGINES[state.settings.searchEngine||0].url+encodeURIComponent(q),'_blank'); input.value=''; results.classList.remove('active'); }
        else if (e.key==='Escape') { input.value=''; results.classList.remove('active'); }
    });
    document.addEventListener('click', e => { if (!e.target.closest('.header-center')) results.classList.remove('active'); });
    document.getElementById('searchEngineToggle').addEventListener('click', () => {
        state.settings.searchEngine = ((state.settings.searchEngine||0)+1) % SEARCH_ENGINES.length;
        const eng = SEARCH_ENGINES[state.settings.searchEngine];
        document.getElementById('searchEngineIcon').src = eng.icon;
        saveState();
    });
}

// ---- Clock ----
function startClock() {
    const el = document.getElementById('clock');
    const upd = () => { el.textContent = new Date().toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'}); };
    upd(); setInterval(upd, 30000);
}

// ---- Event Listeners ----
function setupEventListeners() {
    const slider = document.getElementById('tileSizeSlider');
    slider.value = state.settings.tileSize || 90;
    slider.addEventListener('input', () => { state.settings.tileSize = parseInt(slider.value); applyTileSize(state.settings.tileSize); saveState(); });

    const lblBtn = document.getElementById('toggleLabels');
    lblBtn.classList.toggle('active', state.settings.showLabels !== false);
    lblBtn.addEventListener('click', () => { state.settings.showLabels = !state.settings.showLabels; lblBtn.classList.toggle('active', state.settings.showLabels); document.body.classList.toggle('hide-labels', !state.settings.showLabels); saveState(); });

    document.getElementById('editModeBtn').addEventListener('click', () => { state.editMode = !state.editMode; document.body.classList.toggle('edit-mode', state.editMode); document.getElementById('editModeBtn').classList.toggle('active', state.editMode); renderPage(); });
    document.getElementById('addTileBtn').addEventListener('click', () => openAddModal());
    document.getElementById('settingsBtn').addEventListener('click', openSettings);
    document.getElementById('settingsClose').addEventListener('click', () => document.getElementById('settingsModal').classList.remove('active'));
    document.getElementById('settingsSave').addEventListener('click', saveSettings);
    document.getElementById('modalClose').addEventListener('click', closeTileModal);
    document.getElementById('modalCancel').addEventListener('click', closeTileModal);
    document.getElementById('modalSave').addEventListener('click', saveTileFromModal);
    document.getElementById('modalDelete').addEventListener('click', deleteTile);

    // Size picker
    document.querySelectorAll('.size-option').forEach(o => {
        o.addEventListener('click', () => { document.querySelectorAll('.size-option').forEach(x => x.classList.remove('selected')); o.classList.add('selected'); });
    });

    // Add category
    document.getElementById('addCategoryBtn').addEventListener('click', () => {
        const name = document.getElementById('newCategoryName').value.trim();
        const color = document.getElementById('newCategoryColor').value;
        if (!name) return;
        const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        if (state.categories.find(c => c.id === id)) { alert('Exists'); return; }
        state.categories.push({ id, name, color });
        document.getElementById('newCategoryName').value = '';
        saveState(); renderPage();
    });

    // Export/Import/Reset
    document.getElementById('exportBtn').addEventListener('click', () => { const b = new Blob([JSON.stringify(state,null,2)],{type:'application/json'}); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'twlf-portal-backup.json'; a.click(); });
    document.getElementById('importBtn').addEventListener('click', () => document.getElementById('importFile').click());
    document.getElementById('importFile').addEventListener('change', e => { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = ev => { try { state = { ...state, ...JSON.parse(ev.target.result) }; saveState(); applyTileSize(state.settings.tileSize); applySettings(); renderPage(); alert('Done!'); } catch { alert('Invalid file.'); } }; r.readAsText(f); e.target.value=''; });
    document.getElementById('resetBtn').addEventListener('click', () => { if (!confirm('Reset everything?')) return; localStorage.removeItem('twlf-portal-v4'); resetToDefaults(); applyTileSize(state.settings.tileSize); applySettings(); renderPage(); document.getElementById('settingsModal').classList.remove('active'); });

    // Context menu
    document.querySelectorAll('.context-item[data-action]').forEach(i => i.addEventListener('click', () => handleCtx(i.dataset.action)));
    document.addEventListener('click', e => { if (!e.target.closest('.context-menu')) hideContextMenu(); });

    // Close modals on overlay
    document.querySelectorAll('.modal-overlay').forEach(o => o.addEventListener('click', e => { if (e.target === o) o.classList.remove('active'); }));

    // Keyboard
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') { document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active')); hideContextMenu(); }
        if ((e.ctrlKey && e.key === 'k') || (e.key === '/' && !e.target.closest('input,textarea'))) { e.preventDefault(); document.getElementById('searchInput').focus(); }
    });
}

// ---- Utilities ----
function esc(t) { const d = document.createElement('div'); d.textContent = t; return d.innerHTML; }
function hexToRgba(h, a) { h = h.replace('#',''); if (h.length===3) h = h.split('').map(c=>c+c).join(''); return `rgba(${parseInt(h.substr(0,2),16)},${parseInt(h.substr(2,2),16)},${parseInt(h.substr(4,2),16)},${a})`; }

// ---- Start ----
document.addEventListener('DOMContentLoaded', init);
