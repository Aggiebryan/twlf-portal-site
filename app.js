/* ============================================
   TWLF Portal - Application Logic
   ============================================ */

// ---- Default Data (from Start.me) ----
const DEFAULT_CATEGORIES = [
    { id: 'most-used', name: 'Most Used', color: '#17D6E5' },
    { id: 'govt', name: 'Government Offices', color: '#FF017B' },
    { id: 'web-pages', name: 'TWLF Web Pages', color: '#51CA20' },
    { id: 'reference', name: 'Reference', color: '#FFBE00' },
    { id: 'writing-ai', name: 'Writing & AI', color: '#9B59B6' },
    { id: 'ai-tools', name: 'AI Tools', color: '#E67E22' },
    { id: 'social', name: 'Social Media', color: '#3498DB' },
    { id: 'texas-bar', name: 'Texas Bar', color: '#E74C3C' },
    { id: 'associations', name: 'Associations', color: '#1ABC9C' },
    { id: 'law-books', name: 'Law Books', color: '#8E44AD' },
    { id: 'experts', name: 'Experts', color: '#F39C12' },
    { id: 'widgets', name: 'Widgets', color: '#95A5A6' }
];

const DEFAULT_TILES = [
    // Most Used
    { id: 't1', name: 'Clio', url: 'https://account.clio.com/', category: 'most-used', color: '#17D6E5', icon: 'fa-solid fa-briefcase' },
    { id: 't2', name: 'Box', url: 'https://app.box.com/folder/0', category: 'most-used', color: '#0061D5', icon: 'fa-solid fa-box' },
    { id: 't3', name: 'eFile Texas', url: 'https://www.efiletexas.gov/', category: 'most-used', color: '#2C3E50', icon: 'fa-solid fa-file-lines' },
    { id: 't4', name: 'Proof', url: 'https://app.proofserve.com/', category: 'most-used', color: '#27AE60', icon: 'fa-solid fa-check-double' },
    { id: 't5', name: 'WestLaw', url: 'https://lawschool.thomsonreuters.com/', category: 'most-used', color: '#E67E22', icon: 'fa-solid fa-gavel' },
    { id: 't6', name: 'LexisNexis', url: 'https://plusai.lexis.com/', category: 'most-used', color: '#E74C3C', icon: 'fa-solid fa-scale-balanced' },
    { id: 't7', name: 'Letterstream', url: 'https://www.letterstream.com/', category: 'most-used', color: '#3498DB', icon: 'fa-solid fa-envelope' },
    { id: 't8', name: 'Public Data', url: 'https://www.publicdata.com/', category: 'most-used', color: '#8E44AD', icon: 'fa-solid fa-database' },
    { id: 't9', name: 'eFile Texas (Old)', url: 'https://texas.tylertech.cloud/OfsWeb', category: 'most-used', color: '#7F8C8D', icon: 'fa-solid fa-file' },
    { id: 't10', name: 're:SearchTX', url: 'https://research.txcourts.gov/CourtRecordsSearch/#!/dashboard', category: 'most-used', color: '#2980B9', icon: 'fa-solid fa-magnifying-glass' },
    { id: 't11', name: 'CRIS Purchase', url: 'https://cris.dot.state.tx.us/public/Purchase/app/home', category: 'most-used', color: '#16A085', icon: 'fa-solid fa-car-burst' },
    { id: 't12', name: 'Houston Public Records', url: 'https://houstontx.govqa.us/WEBAPP/_rs/(S(x1znyclu25l1jq31hgycgwrs))/SupportHome.aspx', category: 'most-used', color: '#D35400', icon: 'fa-solid fa-city' },

    // Government Offices
    { id: 't13', name: 'MoCo District Clerk', url: 'https://www.mctx.org/departments/departments_d_-_f/district_clerk/index.php', category: 'govt', color: '#FF017B', icon: 'fa-solid fa-landmark' },
    { id: 't14', name: 'MoCo Odyssey', url: 'https://odyssey.mctx.org/Secured/Login.aspx', category: 'govt', color: '#C0392B', icon: 'fa-solid fa-building-columns' },
    { id: 't15', name: 'HC District Clerk', url: 'https://www.hcdistrictclerk.com/Common/Default.aspx', category: 'govt', color: '#8E44AD', icon: 'fa-solid fa-landmark' },
    { id: 't16', name: 'HC County Clerk', url: 'https://cclerk.hctx.net/', category: 'govt', color: '#2C3E50', icon: 'fa-solid fa-stamp' },
    { id: 't17', name: 'Secretary of State', url: 'https://www.sos.state.tx.us/corp/sosda/index.shtml', category: 'govt', color: '#1ABC9C', icon: 'fa-solid fa-flag-usa' },
    { id: 't18', name: 'PACER', url: 'https://pacer.login.uscourts.gov/csologin/login.jsf', category: 'govt', color: '#2980B9', icon: 'fa-solid fa-university' },
    { id: 't19', name: 'Harris JP Public', url: 'http://www.jp.hctx.net/#gsc.tab=0', category: 'govt', color: '#E67E22', icon: 'fa-solid fa-gavel' },
    { id: 't20', name: 'Harris JP Odyssey', url: 'https://jpodysseyportal.harriscountytx.gov/OdysseyPortalJP', category: 'govt', color: '#D35400', icon: 'fa-solid fa-building' },
    { id: 't21', name: 'Jefferson Co Clerk', url: 'https://co.jefferson.tx.us/dclerk/index.html', category: 'govt', color: '#16A085', icon: 'fa-solid fa-landmark' },
    { id: 't22', name: 'Harris Probate', url: 'https://www.cclerk.hctx.net/applications/websearch/CourtSearch.aspx?CaseType=Probate', category: 'govt', color: '#9B59B6', icon: 'fa-solid fa-scroll' },
    { id: 't23', name: 'MoCo County Clerk', url: 'https://countyfusion1.kofiletech.us/countyweb/loginDisplay.action?countyname=MontgomeryTX', category: 'govt', color: '#E74C3C', icon: 'fa-solid fa-stamp' },
    { id: 't24', name: 'Galveston Clerk', url: 'https://www.galvestoncountytx.gov/our-county/district-clerk', category: 'govt', color: '#3498DB', icon: 'fa-solid fa-landmark' },
    { id: 't25', name: 'MoCo County Odyssey', url: 'https://odyssey.mctx.org/County/default.aspx', category: 'govt', color: '#F39C12', icon: 'fa-solid fa-building-columns' },

    // TWLF Web Pages
    { id: 't26', name: 'Estate Site', url: 'https://woodlandslawestate.com', category: 'web-pages', color: '#51CA20', icon: 'fa-solid fa-house' },
    { id: 't27', name: 'Woodlands Law', url: 'https://Woodlands.law', category: 'web-pages', color: '#27AE60', icon: 'fa-solid fa-scale-balanced' },
    { id: 't28', name: 'WordPress', url: 'https://woodlandslaw.info/wp/', category: 'web-pages', color: '#21759B', icon: 'fa-brands fa-wordpress' },
    { id: 't29', name: 'N8N', url: 'https://n8n.twlf.dev/', category: 'web-pages', color: '#EA4B71', icon: 'fa-solid fa-robot' },
    { id: 't30', name: 'Cal.com', url: 'https://app.cal.com/', category: 'web-pages', color: '#292929', icon: 'fa-solid fa-calendar' },
    { id: 't31', name: 'Phone Intake', url: 'https://intake.twlf.dev', category: 'web-pages', color: '#2ECC71', icon: 'fa-solid fa-phone' },

    // Reference
    { id: 't32', name: 'TexasLawHelp', url: 'https://texaslawhelp.org/', category: 'reference', color: '#FFBE00', icon: 'fa-solid fa-circle-question' },
    { id: 't33', name: 'TX Free Legal Answers', url: 'https://texas.freelegalanswers.org/', category: 'reference', color: '#3498DB', icon: 'fa-solid fa-comments' },
    { id: 't34', name: 'Pre-Judgment Calc', url: 'http://www.csgnetwork.com/interestloancalc.html', category: 'reference', color: '#E67E22', icon: 'fa-solid fa-calculator' },
    { id: 't35', name: 'Post-Judgment Calc', url: 'https://www.webwinder.com/calculators/post_judge_calc.html', category: 'reference', color: '#E74C3C', icon: 'fa-solid fa-calculator' },
    { id: 't36', name: 'Houston Incidents', url: 'https://dmwilson.info/', category: 'reference', color: '#C0392B', icon: 'fa-solid fa-triangle-exclamation' },
    { id: 't37', name: 'Debt Collector Lookup', url: 'https://direct.sos.state.tx.us/debtcollectors/DCSearch.asp', category: 'reference', color: '#8E44AD', icon: 'fa-solid fa-search-dollar' },
    { id: 't38', name: 'Date Calculator', url: 'https://www.timeanddate.com/date/duration.html', category: 'reference', color: '#2C3E50', icon: 'fa-solid fa-calendar-days' },
    { id: 't39', name: 'SCRA', url: 'https://scra.dmdc.osd.mil/scra/#/login', category: 'reference', color: '#1ABC9C', icon: 'fa-solid fa-shield-halved' },
    { id: 't40', name: 'STCL Clinic', url: 'https://www.stcl.edu/academics/legal-clinics/request-legal-assistance/', category: 'reference', color: '#9B59B6', icon: 'fa-solid fa-graduation-cap' },
    { id: 't41', name: 'Bloomberg Law', url: 'https://news.bloomberglaw.com/', category: 'reference', color: '#2980B9', icon: 'fa-solid fa-newspaper' },
    { id: 't42', name: 'Checkpoint', url: 'https://checkpoint.riag.com/app/login', category: 'reference', color: '#27AE60', icon: 'fa-solid fa-clipboard-check' },
    { id: 't43', name: 'Court Deadlines', url: 'https://courtdeadlines.com/', category: 'reference', color: '#E74C3C', icon: 'fa-solid fa-clock' },
    { id: 't44', name: 'Clio University', url: 'https://cliouniversity.learnupon.com/dashboard', category: 'reference', color: '#17D6E5', icon: 'fa-solid fa-graduation-cap' },

    // Writing & AI
    { id: 't45', name: 'ChatGPT', url: 'https://chat.openai.com/', category: 'writing-ai', color: '#10A37F', icon: 'fa-solid fa-robot' },
    { id: 't46', name: 'Gemini', url: 'https://deepmind.google/technologies/gemini/', category: 'writing-ai', color: '#4285F4', icon: 'fa-solid fa-diamond' },
    { id: 't47', name: 'Claude', url: 'https://claude.ai/new', category: 'writing-ai', color: '#D97757', icon: 'fa-solid fa-brain' },
    { id: 't48', name: 'Grammarly', url: 'https://app.grammarly.com/', category: 'writing-ai', color: '#15C39A', icon: 'fa-solid fa-spell-check' },
    { id: 't49', name: 'GroqChat', url: 'https://chat.groq.com/', category: 'writing-ai', color: '#F55036', icon: 'fa-solid fa-bolt' },
    { id: 't50', name: 'QuillBot', url: 'https://quillbot.com', category: 'writing-ai', color: '#499557', icon: 'fa-solid fa-feather' },
    { id: 't51', name: 'WLF-AI', url: 'https://wlf-ai.com/', category: 'writing-ai', color: '#9B59B6', icon: 'fa-solid fa-wand-magic-sparkles' },
    { id: 't52', name: 'N8N Automation', url: 'https://n8n.twlf.dev/', category: 'writing-ai', color: '#EA4B71', icon: 'fa-solid fa-gear' },
    { id: 't53', name: 'Prompt Library', url: 'https://docs.anthropic.com/en/resources/prompt-library/library', category: 'writing-ai', color: '#D97757', icon: 'fa-solid fa-book' },
    { id: 't54', name: 'Perplexity', url: 'https://www.perplexity.ai/', category: 'writing-ai', color: '#1FB8CD', icon: 'fa-solid fa-magnifying-glass-chart' },
    { id: 't55', name: 'NotebookLM', url: 'https://notebooklm.google.com/', category: 'writing-ai', color: '#FBBC04', icon: 'fa-solid fa-notebook' },
    { id: 't56', name: 'GPT Prompt Packs', url: 'https://academy.openai.com/public/clubs/work-users-ynjqu/resources/chatgpt-for-any-role', category: 'writing-ai', color: '#10A37F', icon: 'fa-solid fa-layer-group' },

    // AI Tools
    { id: 't57', name: 'PimEyes', url: 'https://pimeyes.com/en', category: 'ai-tools', color: '#E67E22', icon: 'fa-solid fa-eye' },
    { id: 't58', name: 'Fathom', url: 'https://fathom.video/', category: 'ai-tools', color: '#7C3AED', icon: 'fa-solid fa-video' },
    { id: 't59', name: 'Spellbook', url: 'https://www.spellbook.legal/', category: 'ai-tools', color: '#6366F1', icon: 'fa-solid fa-hat-wizard' },
    { id: 't60', name: 'EvenUp', url: 'https://www.evenuplaw.com/', category: 'ai-tools', color: '#2563EB', icon: 'fa-solid fa-file-contract' },
    { id: 't61', name: 'DISCO', url: 'https://csdisco.com/', category: 'ai-tools', color: '#06B6D4', icon: 'fa-solid fa-compact-disc' },
    { id: 't62', name: 'Pre-dicta', url: 'https://www.pre-dicta.com/', category: 'ai-tools', color: '#14B8A6', icon: 'fa-solid fa-chart-line' },
    { id: 't63', name: 'SlidesAI', url: 'https://www.slidesai.io/', category: 'ai-tools', color: '#F59E0B', icon: 'fa-solid fa-presentation-screen' },
    { id: 't64', name: 'Beautiful.ai', url: 'https://www.beautiful.ai/', category: 'ai-tools', color: '#EC4899', icon: 'fa-solid fa-palette' },

    // Social Media
    { id: 't65', name: 'Radaar', url: 'https://www.radaar.io/', category: 'social', color: '#6366F1', icon: 'fa-solid fa-bullhorn' },
    { id: 't66', name: 'Facebook', url: 'https://www.facebook.com/', category: 'social', color: '#1877F2', icon: 'fa-brands fa-facebook-f' },
    { id: 't67', name: 'Instagram', url: 'https://www.instagram.com/', category: 'social', color: '#E4405F', icon: 'fa-brands fa-instagram' },
    { id: 't68', name: 'X', url: 'https://x.com', category: 'social', color: '#000000', icon: 'fa-brands fa-x-twitter' },
    { id: 't69', name: 'TikTok', url: 'http://tiktok.com', category: 'social', color: '#010101', icon: 'fa-brands fa-tiktok' },
    { id: 't70', name: 'LinkedIn', url: 'https://linkedin.com', category: 'social', color: '#0A66C2', icon: 'fa-brands fa-linkedin-in' },
    { id: 't71', name: 'Blog Admin', url: 'https://woodlandslaw.info/wp/admin', category: 'social', color: '#21759B', icon: 'fa-brands fa-wordpress' },

    // Texas Bar
    { id: 't72', name: 'Bar Benefits', url: 'https://texasbar.memberbenefits.com/', category: 'texas-bar', color: '#E74C3C', icon: 'fa-solid fa-gift' },
    { id: 't73', name: 'State Bar of Texas', url: 'https://www.texasbar.com/AM/Template.cfm?Section=Lawyers_Home', category: 'texas-bar', color: '#C0392B', icon: 'fa-solid fa-scale-balanced' },
    { id: 't74', name: 'LRIS', url: 'https://www.texasbar.com/AM/Template.cfm?Section=Join_or_Manage_Your_LRIS_Account', category: 'texas-bar', color: '#E67E22', icon: 'fa-solid fa-address-book' },
    { id: 't75', name: 'TX Bar Career Center', url: 'https://l.tx.bar.associationcareernetwork.com/', category: 'texas-bar', color: '#3498DB', icon: 'fa-solid fa-briefcase' },
    { id: 't76', name: 'TLAP', url: 'https://www.tlaphelps.org/', category: 'texas-bar', color: '#2ECC71', icon: 'fa-solid fa-hand-holding-heart' },
    { id: 't77', name: 'TexasBarCLE', url: 'http://www.texasbarcle.com/CLE/Home.asp', category: 'texas-bar', color: '#9B59B6', icon: 'fa-solid fa-chalkboard-user' },
    { id: 't78', name: 'TX Bar Practice', url: 'https://www.texasbarpractice.com/', category: 'texas-bar', color: '#F39C12', icon: 'fa-solid fa-book-open' },

    // Associations
    { id: 't79', name: 'Houston Bar', url: 'https://www.hba.org/?pg=myhba', category: 'associations', color: '#1ABC9C', icon: 'fa-solid fa-users' },
    { id: 't80', name: 'Woodlands Bar', url: 'https://www.woodlandsbarassociation.com/', category: 'associations', color: '#2ECC71', icon: 'fa-solid fa-users' },
    { id: 't81', name: 'Federalist Society', url: 'https://fedsoc.org/', category: 'associations', color: '#2C3E50', icon: 'fa-solid fa-landmark-dome' },
    { id: 't82', name: 'MoCo Bar Assoc', url: 'https://mcbatx.com/', category: 'associations', color: '#16A085', icon: 'fa-solid fa-handshake' },

    // Law Books
    { id: 't83', name: 'West Academic', url: 'https://signin.westacademic.com/', category: 'law-books', color: '#8E44AD', icon: 'fa-solid fa-book' },
    { id: 't84', name: 'CasebookConnect', url: 'https://www.casebookconnect.com/login', category: 'law-books', color: '#6C3483', icon: 'fa-solid fa-book-bookmark' },

    // Experts
    { id: 't85', name: 'JurisPro', url: 'https://www.jurispro.com/', category: 'experts', color: '#F39C12', icon: 'fa-solid fa-user-tie' },
    { id: 't86', name: 'SEAK Experts', url: 'https://www.seakexperts.com/', category: 'experts', color: '#E67E22', icon: 'fa-solid fa-microscope' },

    // Widgets
    { id: 'w1', name: 'Quick Notes', url: '#notes', category: 'widgets', color: '#95A5A6', icon: 'fa-solid fa-sticky-note', isWidget: true, widgetType: 'notes' },
    { id: 'w2', name: 'To Do List', url: '#todo', category: 'widgets', color: '#95A5A6', icon: 'fa-solid fa-list-check', isWidget: true, widgetType: 'todo' },
    { id: 'w3', name: 'Clio Grow Training', url: 'https://www.loom.com/share/5234da14ff9a430ea7812dab55027ed2?sid=2f0ea8fb-1d16-434f-be50-c3c674b1bd0a', category: 'widgets', color: '#625DF5', icon: 'fa-solid fa-play-circle' },
];

const TILE_COLORS = [
    '#17D6E5', '#FF017B', '#51CA20', '#FFBE00', '#9B59B6',
    '#E67E22', '#3498DB', '#E74C3C', '#1ABC9C', '#2C3E50',
    '#F39C12', '#8E44AD', '#2980B9', '#27AE60', '#D35400',
    '#C0392B', '#16A085', '#7F8C8D', '#2ECC71', '#6366F1',
    '#EC4899', '#10A37F', '#F59E0B', '#06B6D4', '#000000'
];

const SEARCH_ENGINES = [
    { name: 'Google', url: 'https://www.google.com/search?q=', icon: 'https://www.google.com/favicon.ico' },
    { name: 'Bing', url: 'https://www.bing.com/search?q=', icon: 'https://www.bing.com/favicon.ico' },
    { name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=', icon: 'https://duckduckgo.com/favicon.ico' }
];

// ---- State ----
let state = {
    categories: [],
    tiles: [],
    activeCategory: null,
    settings: {
        bgColor: '#1a1a2e',
        bgImage: '',
        tileSize: 'medium',
        showLabels: true,
        searchEngine: 0
    },
    notes: 'Clio Grow Template Training:\nhttps://www.loom.com/share/5234da14ff9a430ea7812dab55027ed2',
    todos: [],
    editMode: false,
    editingTile: null
};

// ---- Init ----
function init() {
    loadState();
    renderMarkers();
    renderGrid();
    applySettings();
    startClock();
    setupEventListeners();
    setupDragAndDrop();
    setupSearch();
}

// ---- Persistence ----
function loadState() {
    const saved = localStorage.getItem('twlf-portal-state');
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
    localStorage.setItem('twlf-portal-state', JSON.stringify(state));
}

function resetToDefaults() {
    state.categories = JSON.parse(JSON.stringify(DEFAULT_CATEGORIES));
    state.tiles = JSON.parse(JSON.stringify(DEFAULT_TILES));
    state.activeCategory = DEFAULT_CATEGORIES[0].id;
    state.settings = {
        bgColor: '#1a1a2e',
        bgImage: '',
        tileSize: 'medium',
        showLabels: true,
        searchEngine: 0
    };
    state.notes = 'Clio Grow Template Training:\nhttps://www.loom.com/share/5234da14ff9a430ea7812dab55027ed2';
    state.todos = [];
    saveState();
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
        // Right click to edit category
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
        const el = createTileElement(tile);
        container.appendChild(el);
    });

    // Add empty slots to fill grid (for visual consistency)
    const minSlots = 24;
    const remaining = Math.max(0, minSlots - activeTiles.length);
    for (let i = 0; i < remaining; i++) {
        const empty = document.createElement('div');
        empty.className = 'tile empty-slot';
        empty.addEventListener('click', () => {
            if (state.editMode) {
                openAddModal();
            }
        });
        container.appendChild(empty);
    }
}

function createTileElement(tile) {
    const el = document.createElement('div');
    el.className = 'tile';
    if (!state.settings.showLabels) el.classList.add('no-labels');
    if (tile.isWidget) el.classList.add('widget-tile');
    el.style.background = tile.color || '#333';
    el.dataset.id = tile.id;
    el.draggable = true;

    // Favicon or icon
    const iconDiv = document.createElement('div');
    iconDiv.className = 'tile-icon';
    if (tile.icon) {
        const i = document.createElement('i');
        i.className = tile.icon;
        iconDiv.appendChild(i);
    } else {
        // Use favicon
        const img = document.createElement('img');
        try {
            const domain = new URL(tile.url).hostname;
            img.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
        } catch {
            img.src = '';
        }
        img.alt = tile.name;
        img.onerror = function() {
            this.parentElement.innerHTML = '<i class="fa-solid fa-globe"></i>';
        };
        iconDiv.appendChild(img);
    }
    el.appendChild(iconDiv);

    const label = document.createElement('div');
    label.className = 'tile-label';
    label.textContent = tile.name;
    el.appendChild(label);

    // Click handler
    el.addEventListener('click', (e) => {
        if (state.editMode) {
            e.preventDefault();
            openEditModal(tile);
            return;
        }
        if (tile.isWidget) {
            e.preventDefault();
            handleWidget(tile);
            return;
        }
        window.open(tile.url, '_blank');
    });

    // Context menu
    el.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        showContextMenu(e, tile);
    });

    return el;
}

// ---- Widgets ----
function handleWidget(tile) {
    if (tile.widgetType === 'notes') {
        openNotesModal();
    } else if (tile.widgetType === 'todo') {
        openTodoModal();
    }
}

function openNotesModal() {
    document.getElementById('notesArea').value = state.notes || '';
    document.getElementById('notesModal').classList.add('active');
}

function openTodoModal() {
    renderTodos();
    document.getElementById('todoModal').classList.add('active');
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
            saveState();
            renderTodos();
        });
        li.querySelector('button').addEventListener('click', () => {
            state.todos.splice(idx, 1);
            saveState();
            renderTodos();
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
    document.getElementById('tileIcon').value = '';
    document.getElementById('modalDelete').style.display = 'none';
    renderColorPicker(TILE_COLORS[0]);
    document.getElementById('tileModal').classList.add('active');
}

function openEditModal(tile) {
    state.editingTile = tile;
    document.getElementById('modalTitle').textContent = 'Edit Tile';
    document.getElementById('tileName').value = tile.name;
    document.getElementById('tileUrl').value = tile.url;
    document.getElementById('tileIcon').value = tile.icon || '';
    document.getElementById('modalDelete').style.display = 'inline-block';
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
        swatch.addEventListener('click', () => {
            picker.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
            swatch.classList.add('selected');
        });
        picker.appendChild(swatch);
    });
}

function getSelectedColor() {
    const selected = document.querySelector('.color-swatch.selected');
    return selected ? selected.style.background : TILE_COLORS[0];
}

function saveTile() {
    const name = document.getElementById('tileName').value.trim();
    const url = document.getElementById('tileUrl').value.trim();
    const icon = document.getElementById('tileIcon').value.trim();
    const color = rgbToHex(getSelectedColor());

    if (!name || !url) return;

    if (state.editingTile) {
        const tile = state.tiles.find(t => t.id === state.editingTile.id);
        if (tile) {
            tile.name = name;
            tile.url = url;
            tile.icon = icon || null;
            tile.color = color;
        }
    } else {
        state.tiles.push({
            id: 't' + Date.now(),
            name,
            url,
            icon: icon || null,
            color,
            category: state.activeCategory
        });
    }

    saveState();
    renderGrid();
    closeAllModals();
}

function deleteTile() {
    if (state.editingTile) {
        state.tiles = state.tiles.filter(t => t.id !== state.editingTile.id);
        saveState();
        renderGrid();
        closeAllModals();
    }
}

function closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    state.editingTile = null;
}

// ---- Context Menu ----
function showContextMenu(e, tile) {
    const menu = document.getElementById('contextMenu');
    menu.classList.add('active');
    menu.style.left = Math.min(e.clientX, window.innerWidth - 200) + 'px';
    menu.style.top = Math.min(e.clientY, window.innerHeight - 200) + 'px';
    menu.dataset.tileId = tile.id;
}

function handleContextAction(action) {
    const tileId = document.getElementById('contextMenu').dataset.tileId;
    const tile = state.tiles.find(t => t.id === tileId);
    if (!tile) return;

    switch (action) {
        case 'edit':
            openEditModal(tile);
            break;
        case 'color':
            const newColor = TILE_COLORS[Math.floor(Math.random() * TILE_COLORS.length)];
            tile.color = newColor;
            saveState();
            renderGrid();
            break;
        case 'duplicate':
            const dup = { ...tile, id: 't' + Date.now() };
            state.tiles.push(dup);
            saveState();
            renderGrid();
            break;
        case 'delete':
            if (confirm(`Delete "${tile.name}"?`)) {
                state.tiles = state.tiles.filter(t => t.id !== tileId);
                saveState();
                renderGrid();
            }
            break;
    }
    document.getElementById('contextMenu').classList.remove('active');
}

// ---- Drag & Drop ----
function setupDragAndDrop() {
    const container = document.getElementById('gridContainer');
    let draggedId = null;

    container.addEventListener('dragstart', (e) => {
        const tile = e.target.closest('.tile');
        if (!tile || tile.classList.contains('empty-slot')) return;
        draggedId = tile.dataset.id;
        tile.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
    });

    container.addEventListener('dragend', (e) => {
        const tile = e.target.closest('.tile');
        if (tile) tile.classList.remove('dragging');
        container.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
        draggedId = null;
    });

    container.addEventListener('dragover', (e) => {
        e.preventDefault();
        const tile = e.target.closest('.tile');
        if (tile && tile.dataset.id !== draggedId) {
            tile.classList.add('drag-over');
        }
    });

    container.addEventListener('dragleave', (e) => {
        const tile = e.target.closest('.tile');
        if (tile) tile.classList.remove('drag-over');
    });

    container.addEventListener('drop', (e) => {
        e.preventDefault();
        const targetTile = e.target.closest('.tile');
        if (!targetTile || !draggedId) return;
        targetTile.classList.remove('drag-over');

        const tiles = state.tiles.filter(t => t.category === state.activeCategory);
        const dragIdx = tiles.findIndex(t => t.id === draggedId);
        const targetId = targetTile.dataset.id;
        const targetIdx = tiles.findIndex(t => t.id === targetId);

        if (dragIdx >= 0 && targetIdx >= 0 && dragIdx !== targetIdx) {
            // Swap in the main array
            const mainDragIdx = state.tiles.findIndex(t => t.id === draggedId);
            const mainTargetIdx = state.tiles.findIndex(t => t.id === targetId);
            [state.tiles[mainDragIdx], state.tiles[mainTargetIdx]] = [state.tiles[mainTargetIdx], state.tiles[mainDragIdx]];
            saveState();
            renderGrid();
        }
    });
}

// ---- Search ----
function setupSearch() {
    const input = document.getElementById('searchInput');
    const results = document.getElementById('searchResults');
    const toggle = document.getElementById('searchEngineToggle');

    input.addEventListener('input', () => {
        const query = input.value.trim().toLowerCase();
        if (!query) {
            results.classList.remove('active');
            return;
        }

        const matches = state.tiles.filter(t =>
            t.name.toLowerCase().includes(query) ||
            t.url.toLowerCase().includes(query)
        ).slice(0, 8);

        results.innerHTML = '';
        matches.forEach(tile => {
            const item = document.createElement('div');
            item.className = 'search-result-item';
            item.innerHTML = `
                <div class="result-icon" style="background:${tile.color}">
                    <i class="${tile.icon || 'fa-solid fa-globe'}" style="color:#fff;font-size:14px"></i>
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
        const engine = SEARCH_ENGINES[state.settings.searchEngine];
        const webItem = document.createElement('div');
        webItem.className = 'search-result-web';
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
            const match = state.tiles.find(t =>
                t.name.toLowerCase().includes(query.toLowerCase())
            );
            if (match) {
                window.open(match.url, '_blank');
            } else {
                const engine = SEARCH_ENGINES[state.settings.searchEngine];
                window.open(engine.url + encodeURIComponent(query), '_blank');
            }
            input.value = '';
            results.classList.remove('active');
        }
        if (e.key === 'Escape') {
            input.value = '';
            results.classList.remove('active');
        }
    });

    // Toggle search engine
    toggle.addEventListener('click', () => {
        state.settings.searchEngine = (state.settings.searchEngine + 1) % SEARCH_ENGINES.length;
        const engine = SEARCH_ENGINES[state.settings.searchEngine];
        document.getElementById('searchEngineIcon').src = engine.icon;
        document.getElementById('searchEngineIcon').alt = engine.name;
        saveState();
    });

    // Close results on outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.header-center')) {
            results.classList.remove('active');
        }
    });

    // Set initial engine icon
    const engine = SEARCH_ENGINES[state.settings.searchEngine];
    document.getElementById('searchEngineIcon').src = engine.icon;
    document.getElementById('searchEngineIcon').alt = engine.name;
}

// ---- Settings ----
function applySettings() {
    const s = state.settings;
    document.body.style.backgroundColor = s.bgColor;
    document.documentElement.style.setProperty('--bg-color', s.bgColor);

    if (s.bgImage) {
        document.body.style.backgroundImage = `url(${s.bgImage})`;
        document.body.classList.add('has-bg-image');
    } else {
        document.body.style.backgroundImage = '';
        document.body.classList.remove('has-bg-image');
    }

    document.body.classList.remove('tile-small', 'tile-medium', 'tile-large');
    document.body.classList.add(`tile-${s.tileSize}`);
}

function openSettings() {
    document.getElementById('bgColor').value = state.settings.bgColor;
    document.getElementById('bgImage').value = state.settings.bgImage || '';
    document.getElementById('tileSize').value = state.settings.tileSize;
    document.getElementById('showLabels').checked = state.settings.showLabels;
    document.getElementById('settingsModal').classList.add('active');
}

function saveSettings() {
    state.settings.bgColor = document.getElementById('bgColor').value;
    state.settings.bgImage = document.getElementById('bgImage').value.trim();
    state.settings.tileSize = document.getElementById('tileSize').value;
    state.settings.showLabels = document.getElementById('showLabels').checked;
    saveState();
    applySettings();
    renderGrid();
    closeAllModals();
}

// ---- Clock ----
function startClock() {
    function update() {
        const now = new Date();
        document.getElementById('clock').textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    update();
    setInterval(update, 1000);
}

// ---- Event Listeners ----
function setupEventListeners() {
    // Edit mode toggle
    document.getElementById('editModeBtn').addEventListener('click', () => {
        state.editMode = !state.editMode;
        document.body.classList.toggle('edit-mode', state.editMode);
        document.getElementById('editModeBtn').classList.toggle('active', state.editMode);
        renderGrid();
    });

    // Add tile
    document.getElementById('addTileBtn').addEventListener('click', openAddModal);

    // Settings
    document.getElementById('settingsBtn').addEventListener('click', openSettings);

    // Modal buttons
    document.getElementById('modalSave').addEventListener('click', saveTile);
    document.getElementById('modalDelete').addEventListener('click', deleteTile);
    document.getElementById('modalCancel').addEventListener('click', closeAllModals);
    document.getElementById('modalClose').addEventListener('click', closeAllModals);
    document.getElementById('settingsSave').addEventListener('click', saveSettings);
    document.getElementById('settingsClose').addEventListener('click', closeAllModals);

    // Notes modal
    document.getElementById('notesClose').addEventListener('click', closeAllModals);
    document.getElementById('notesSave').addEventListener('click', () => {
        state.notes = document.getElementById('notesArea').value;
        saveState();
        closeAllModals();
    });

    // Todo modal
    document.getElementById('todoClose').addEventListener('click', closeAllModals);
    document.getElementById('todoAddBtn').addEventListener('click', () => {
        const input = document.getElementById('todoInput');
        const text = input.value.trim();
        if (text) {
            if (!state.todos) state.todos = [];
            state.todos.push({ text, done: false });
            saveState();
            input.value = '';
            renderTodos();
        }
    });
    document.getElementById('todoInput').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') document.getElementById('todoAddBtn').click();
    });

    // Add category
    document.getElementById('addCategoryBtn').addEventListener('click', () => {
        const name = document.getElementById('newCategoryName').value.trim();
        const color = document.getElementById('newCategoryColor').value;
        if (name) {
            state.categories.push({
                id: 'cat-' + Date.now(),
                name,
                color
            });
            document.getElementById('newCategoryName').value = '';
            saveState();
            renderMarkers();
        }
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
    document.getElementById('importBtn').addEventListener('click', () => {
        document.getElementById('importFile').click();
    });
    document.getElementById('importFile').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                try {
                    const data = JSON.parse(ev.target.result);
                    state = { ...state, ...data };
                    saveState();
                    renderMarkers();
                    renderGrid();
                    applySettings();
                    closeAllModals();
                } catch (err) {
                    alert('Invalid backup file.');
                }
            };
            reader.readAsText(file);
        }
    });

    // Reset
    document.getElementById('resetBtn').addEventListener('click', () => {
        if (confirm('Reset all data to defaults? This cannot be undone.')) {
            resetToDefaults();
            renderMarkers();
            renderGrid();
            applySettings();
            closeAllModals();
        }
    });

    // Context menu actions
    document.querySelectorAll('.context-item[data-action]').forEach(item => {
        item.addEventListener('click', () => handleContextAction(item.dataset.action));
    });

    // Close context menu on outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.context-menu')) {
            document.getElementById('contextMenu').classList.remove('active');
        }
    });

    // Close modals on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeAllModals();
        });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
            document.getElementById('contextMenu').classList.remove('active');
        }
        // Ctrl+K to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            document.getElementById('searchInput').focus();
        }
    });
}

// ---- Utilities ----
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function hexToRgba(hex, alpha) {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return `rgba(${r},${g},${b},${alpha})`;
}

function rgbToHex(color) {
    if (color.startsWith('#')) return color;
    const match = color.match(/\d+/g);
    if (!match || match.length < 3) return color;
    return '#' + match.slice(0, 3).map(c => parseInt(c).toString(16).padStart(2, '0')).join('');
}

// ---- Start ----
document.addEventListener('DOMContentLoaded', init);
