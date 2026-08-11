const baseCategories = [
  { id: 'most-used', name: 'Most Used', color: '#d9623f' },
  { id: 'govt', name: 'Government Offices/Courts', color: '#8f405d' },
  { id: 'twlf', name: 'TWLF Pages', color: '#287b67' },
  { id: 'reference', name: 'Reference', color: '#b88524' },
  { id: 'state-bar', name: 'State Bar', color: '#a33c35' },
  { id: 'ai', name: 'AI Tools', color: '#6656a5' },
  { id: 'associations', name: 'Associations', color: '#267b7d' },
];
const categoryStorageKey='twlf-custom-categories';
let customCategories=JSON.parse(localStorage.getItem(categoryStorageKey)||'[]');
let categories=[...baseCategories,...customCategories];

const seed = [
  ['t1','Clio','https://account.clio.com/','most-used','#0B70CE'],['t2','Box','https://app.box.com/folder/0','most-used','#0061D5'],['t3','eFile Texas','https://www.efiletexas.gov/','most-used','#1C3A5F'],['t4','Proof','https://app.proofserve.com/','most-used','#27AE60'],['t5','WestLaw','https://lawschool.thomsonreuters.com/','most-used','#E87722'],['t6','LexisNexis','https://plusai.lexis.com/','most-used','#D0232A'],['t7','Letterstream','https://www.letterstream.com/','most-used','#2980B9'],['t8','Public Data','https://www.publicdata.com/','most-used','#6C3483'],['t9','eFile Texas (Old)','https://texas.tylertech.cloud/OfsWeb','most-used','#5D6D7E'],['t10','re:SearchTX','https://research.txcourts.gov/CourtRecordsSearch/#!/dashboard','most-used','#1A5276'],['t11','CRIS Purchase','https://cris.dot.state.tx.us/public/Purchase/app/home','most-used','#117A65'],['t12','Houston Public Records','https://houstontx.govqa.us/WEBAPP/_rs/(S(x1znyclu25l1jq31hgycgwrs))/SupportHome.aspx','most-used','#C0392B'],
  ['t13','MoCo District Clerk','https://www.mctx.org/departments/departments_d_-_f/district_clerk/index.php','govt','#8B1A4A'],['t14','MoCo Odyssey','https://odyssey.mctx.org/Secured/Login.aspx','govt','#A93226'],['t15','HC District Clerk','https://www.hcdistrictclerk.com/Common/Default.aspx','govt','#6C3483'],['t16','HC County Clerk','https://cclerk.hctx.net/','govt','#1C2833'],['t17','Secretary of State','https://www.sos.state.tx.us/corp/sosda/index.shtml','govt','#148F77'],['t18','PACER','https://pacer.login.uscourts.gov/csologin/login.jsf','govt','#21618C'],['t19','Harris JP Public','http://www.jp.hctx.net/#gsc.tab=0','govt','#CA6F1E'],['t20','Harris JP Odyssey','https://jpodysseyportal.harriscountytx.gov/OdysseyPortalJP','govt','#AF601A'],['t21','Jefferson Co Clerk','https://co.jefferson.tx.us/dclerk/index.html','govt','#117A65'],['t22','Harris Probate','https://www.cclerk.hctx.net/applications/websearch/CourtSearch.aspx?CaseType=Probate','govt','#7D3C98'],['t23','MoCo County Clerk','https://countyfusion1.kofiletech.us/countyweb/loginDisplay.action?countyname=MontgomeryTX','govt','#C0392B'],['t24','Galveston Clerk','https://www.galvestoncountytx.gov/our-county/district-clerk','govt','#2471A3'],['t25','MoCo County Odyssey','https://odyssey.mctx.org/County/default.aspx','govt','#D4AC0D'],
  ['t26','Estate Site','https://woodlandslawestate.com','twlf','#1E8449'],['t27','Woodlands Law','https://Woodlands.law','twlf','#196F3D'],['t28','WordPress','https://woodlandslaw.info/wp/','twlf','#21759B'],['t29','N8N','https://n8n.twlf.dev/','twlf','#EA4B71'],['t30','Cal.com','https://app.cal.com/','twlf','#292929'],['t31','Phone Intake','https://intake.twlf.dev','twlf','#27AE60'],
  ['t32','TexasLawHelp','https://texaslawhelp.org/','reference','#D4A017'],['t33','TX Free Legal Answers','https://texas.freelegalanswers.org/','reference','#2471A3'],['t34','Pre-Judgment Calc','http://www.csgnetwork.com/interestloancalc.html','reference','#CA6F1E'],['t35','Post-Judgment Calc','https://www.webwinder.com/calculators/post_judge_calc.html','reference','#C0392B'],['t36','Houston Incidents','https://dmwilson.info/','reference','#922B21'],['t37','Debt Collector Lookup','https://direct.sos.state.tx.us/debtcollectors/DCSearch.asp','reference','#6C3483'],['t38','Date Calculator','https://www.timeanddate.com/date/duration.html','reference','#1C2833'],['t39','SCRA','https://scra.dmdc.osd.mil/scra/#/login','reference','#148F77'],['t40','STCL Clinic','https://www.stcl.edu/academics/legal-clinics/request-legal-assistance/','reference','#7D3C98'],['t41','Bloomberg Law','https://news.bloomberglaw.com/','reference','#1A5276'],['t42','Checkpoint','https://checkpoint.riag.com/app/login','reference','#1E8449'],['t43','Court Deadlines','https://courtdeadlines.com/','reference','#C0392B'],['t44','Clio University','https://cliouniversity.learnupon.com/dashboard','reference','#0B70CE'],
  ['t45','ChatGPT','https://chat.openai.com/','ai','#10A37F'],['t46','Gemini','https://deepmind.google/technologies/gemini/','ai','#4285F4'],['t47','Claude','https://claude.ai/new','ai','#D97757'],['t48','Grammarly','https://app.grammarly.com/','ai','#15C39A'],['t49','GroqChat','https://chat.groq.com/','ai','#F55036'],['t50','QuillBot','https://quillbot.com','ai','#499557'],['t51','WLF-AI','https://wlf-ai.com/','ai','#7D3C98'],['t52','N8N Auto','https://n8n.twlf.dev/','ai','#EA4B71'],['t53','Prompt Library','https://docs.anthropic.com/en/resources/prompt-library/library','ai','#D97757'],['t54','Perplexity','https://www.perplexity.ai/','ai','#1FB8CD'],['t55','NotebookLM','https://notebooklm.google.com/','ai','#FBBC04'],['t56','GPT Prompts','https://academy.openai.com/public/clubs/work-users-ynjqu/resources/chatgpt-for-any-role','ai','#10A37F'],['t57','PimEyes','https://pimeyes.com/en','ai','#CA6F1E'],['t58','Fathom','https://fathom.video/','ai','#7C3AED'],['t59','Spellbook','https://www.spellbook.legal/','ai','#6366F1'],['t60','EvenUp','https://www.evenuplaw.com/','ai','#2563EB'],['t61','DISCO','https://csdisco.com/','ai','#06B6D4'],['t62','Pre-dicta','https://www.pre-dicta.com/','ai','#14B8A6'],['t63','SlidesAI','https://www.slidesai.io/','ai','#F59E0B'],['t64','Beautiful.ai','https://www.beautiful.ai/','ai','#EC4899'],
  ['t72','Bar Benefits','https://texasbar.memberbenefits.com/','state-bar','#C0392B'],['t73','State Bar of TX','https://www.texasbar.com/AM/Template.cfm?Section=Lawyers_Home','state-bar','#922B21'],['t74','LRIS','https://www.texasbar.com/AM/Template.cfm?Section=Join_or_Manage_Your_LRIS_Account','state-bar','#CA6F1E'],['t75','TX Bar Careers','https://l.tx.bar.associationcareernetwork.com/','state-bar','#2471A3'],['t76','TLAP','https://www.tlaphelps.org/','state-bar','#27AE60'],['t77','TexasBarCLE','http://www.texasbarcle.com/CLE/Home.asp','state-bar','#7D3C98'],['t78','TX Bar Practice','https://www.texasbarpractice.com/','state-bar','#D4A017'],
  ['t79','Houston Bar','https://www.hba.org/?pg=myhba','associations','#148F77'],['t80','Woodlands Bar','https://www.woodlandsbarassociation.com/','associations','#1E8449'],['t81','Federalist Society','https://fedsoc.org/','associations','#1C2833'],['t82','MoCo Bar Assoc','https://mcbatx.com/','associations','#117A65'],
].map(([id,name,url,category,color]) => ({ id,name,url,category,color }));

const storageKey = 'twlf-firm-hub-links-v3';
let links = JSON.parse(localStorage.getItem(storageKey) || 'null') || seed;
const legacyHome={t1:'twlf',t2:'twlf',t3:'govt',t4:'twlf',t5:'reference',t6:'reference',t7:'twlf',t8:'reference',t9:'govt',t10:'govt',t11:'govt',t12:'govt'};
links=links.map(link=>link.category==='most-used'?{...link,category:legacyHome[link.id]||'reference',mostUsed:true,mostUsedSize:link.size||'standard'}:link);
let active = 'all';
let query = '';
let displayColumns = Number(localStorage.getItem('twlf-display-columns') || 2);
let categoryOrder = JSON.parse(localStorage.getItem('twlf-category-order') || 'null') || categories.map(category => category.id);
categoryOrder=['most-used',...categoryOrder.filter(id=>id!=='most-used'),...categories.map(category=>category.id).filter(id=>!categoryOrder.includes(id))];
let mostUsedOrder=JSON.parse(localStorage.getItem('twlf-most-used-order')||'[]');
let editingId = null;
let editingContext = null;

const categoryById = id => categories.find(category => category.id === id);
const hostname = url => { try { return new URL(url).hostname.replace(/^www\./,''); } catch { return url; } };
const logo = url => `https://www.google.com/s2/favicons?domain=${encodeURIComponent(hostname(url))}&sz=128`;
const escapeHtml = value => { const node=document.createElement('div'); node.textContent=value; return node.innerHTML; };

function save() { localStorage.setItem(storageKey, JSON.stringify(links)); document.querySelector('#reset').hidden = false; }

function linkCard(link, index, context) {
  const safeName=escapeHtml(link.name), safeUrl=escapeHtml(link.url), safeHost=escapeHtml(hostname(link.url));
  const selectedSize=context==='most-used'?(link.mostUsedSize||link.size):link.size;
  const size=['small','standard','large'].includes(selectedSize)?selectedSize:'standard';
  const sourceCategory=categoryById(link.category);
  const description=escapeHtml(link.description || `${categoryById(link.category)?.name || 'Portal'} resource`);
  return `<article class="link-card size-${size} ${context==='most-used'?'most-used-card':''}" data-link="${link.id}" data-context="${context}" style="--accent:${link.color};--source-color:${sourceCategory?.color||link.color};--delay:${Math.min(index,16)*18}ms">
    <button class="card-drag" draggable="true" aria-label="Move ${safeName}" title="Drag to reorder">⠿</button>
    <button class="remove" data-remove="${link.id}" data-remove-context="${context}" aria-label="Remove ${safeName}" title="${context==='most-used'?'Remove from Most Used':'Remove link'}">×</button>
    <button class="edit" data-edit="${link.id}" data-edit-context="${context}" aria-label="Edit ${safeName}" title="Edit link and logo">✎</button>
    <a href="${safeUrl}" target="_blank" rel="noreferrer">
      <span class="logo"><span class="fallback">${safeName.slice(0,2).toUpperCase()}</span><img src="${escapeHtml(link.logo || logo(link.url))}" alt="" onerror="this.style.display='none'" onload="if(this.naturalWidth)this.parentNode.classList.add('has-logo')"></span>
      <span class="link-copy"><strong>${safeName}</strong><small class="link-address">${safeHost}</small><small class="description">${description}</small></span><span class="open">↗</span>
    </a></article>`;
}

function matching(categoryId) {
  const found=links.filter(link => (categoryId==='most-used'?link.mostUsed:link.category===categoryId) && `${link.name} ${hostname(link.url)}`.toLowerCase().includes(query));
  return categoryId==='most-used'?[...found].sort((a,b)=>{const ai=mostUsedOrder.indexOf(String(a.id)),bi=mostUsedOrder.indexOf(String(b.id));return (ai<0?9999:ai)-(bi<0?9999:bi)}):found;
}

function render() {
  document.documentElement.style.setProperty('--display-columns',displayColumns);
  const nav = [{id:'all',name:'All'},...categories];
  document.querySelector('#categoryNav').innerHTML = nav.map(item => `<button class="${active===item.id?'active':''}" data-category="${item.id}">${item.name}<span>${item.id==='all'?links.length:item.id==='most-used'?links.filter(link=>link.mostUsed).length:links.filter(link=>link.category===item.id).length}</span></button>`).join('');
  const orderedCategories = ['most-used',...categoryOrder.filter(id=>id!=='most-used')].map(id => categoryById(id)).filter(Boolean);
  const shownCategories = active === 'all' ? orderedCategories : categories.filter(category => category.id === active);
  const sections = shownCategories.map(category => ({category,items:matching(category.id)})).filter(section => section.items.length || !query);
  const count = sections.reduce((sum,section) => sum + section.items.length,0);
  document.querySelector('#pageTitle').textContent = active === 'all' ? 'All resources' : categoryById(active)?.name || '';
  document.querySelector('#pageCount').textContent = `${count} ${count===1?'link':'links'}`;
  document.querySelector('#content').className = active === 'all' ? 'dashboard-grid masonry-board' : 'single-category';
  document.querySelector('#content').innerHTML = sections.map(({category,items}) => `<section class="category-panel ${category.id==='most-used'?'pinned-panel':''}" data-panel="${category.id}" style="--category:${category.color}"><header draggable="${active==='all'&&category.id!=='most-used'}"><span class="drag-handle" title="${category.id==='most-used'?'Pinned':'Drag to move category'}">${category.id==='most-used'?'⌖':'⠿'}</span><span class="category-dot"></span><h2>${category.name}</h2><small>${items.length}</small></header><div class="link-grid">${items.map((link,index)=>linkCard(link,index,category.id)).join('')}</div></section>`).join('');
  document.querySelector('#empty').hidden = count > 0;
}

document.addEventListener('click', event => {
  const categoryButton = event.target.closest('[data-category]');
  if (categoryButton) { active=categoryButton.dataset.category; render(); }
  if (event.target.closest('[data-add]')) openModal();
  const removeButton = event.target.closest('[data-remove]');
  if (removeButton) { event.preventDefault(); const link=links.find(item=>String(item.id)===removeButton.dataset.remove);const fromMostUsed=removeButton.dataset.removeContext==='most-used';if(link && window.confirm(fromMostUsed?`Remove “${link.name}” from Most Used?`:`Remove “${link.name}” from the portal?`)){if(fromMostUsed){link.mostUsed=false}else{links=links.filter(item=>String(item.id)!==removeButton.dataset.remove)}save();render()} }
  const editButton = event.target.closest('[data-edit]');
  if (editButton) { event.preventDefault(); openModal(links.find(link=>String(link.id)===editButton.dataset.edit),editButton.dataset.editContext); }
});

document.querySelector('#search').addEventListener('input', event => { query=event.target.value.trim().toLowerCase(); render(); });
document.addEventListener('keydown', event => { if(event.key==='/' && document.activeElement.tagName!=='INPUT'){event.preventDefault();document.querySelector('#search').focus()} });

function openModal(link=null,context=null){editingId=link?.id||null;editingContext=context;const form=document.querySelector('#form');form.reset();document.querySelector('#modalTitle').textContent=link?'Edit portal link':'Add a portal link';document.querySelector('#modalIntro').textContent=link?'Its category card and Most Used card can have different sizes.':'Add a destination to this browser’s TWLF portal.';document.querySelector('#saveLink').textContent=link?'Save changes':'Add link';if(link){form.elements.name.value=link.name;form.elements.url.value=link.url;form.elements.logo.value=link.logo||'';form.elements.description.value=link.description||'';form.elements.category.value=link.category;form.elements.size.value=link.size||'standard';form.elements.mostUsed.checked=Boolean(link.mostUsed);form.elements.mostUsedSize.value=link.mostUsedSize||link.size||'standard'}toggleMostUsedSize();document.querySelector('#backdrop').hidden=false}
const closeModal=()=>{document.querySelector('#backdrop').hidden=true;editingId=null;editingContext=null};
document.querySelector('#close').onclick=closeModal; document.querySelector('#cancel').onclick=closeModal;
document.querySelector('#backdrop').addEventListener('click',event=>{if(event.target.id==='backdrop')closeModal()});
function populateCategorySelect(){document.querySelector('#categorySelect').innerHTML=categories.filter(category=>category.id!=='most-used').map(category=>`<option value="${category.id}">${category.name}</option>`).join('')}
function toggleMostUsedSize(){document.querySelector('#mostUsedSizeLabel').hidden=!document.querySelector('#form').elements.mostUsed.checked}
populateCategorySelect();document.querySelector('#form').elements.mostUsed.addEventListener('change',toggleMostUsedSize);
document.querySelector('#form').addEventListener('submit',event=>{event.preventDefault();const data=Object.fromEntries(new FormData(event.target));if(!/^https?:\/\//i.test(data.url))data.url=`https://${data.url}`;if(data.logo && !/^https?:\/\//i.test(data.logo))data.logo=`https://${data.logo}`;const category=categoryById(data.category);const entry={name:data.name.trim(),url:data.url,logo:data.logo.trim(),description:data.description.trim(),size:data.size,mostUsed:Boolean(data.mostUsed),mostUsedSize:data.mostUsedSize||'standard',category:data.category,color:category.color};const wasEditing=Boolean(editingId);if(wasEditing){links=links.map(link=>String(link.id)===String(editingId)?{...link,...entry}:link)}else{links.push({id:`custom-${Date.now()}`,...entry})}save();event.target.reset();closeModal();document.querySelector('#notice').innerHTML=`<div class="notice">${wasEditing?'Link updated':'Link added to your portal'}.<button aria-label="Dismiss">×</button></div>`;render()});

document.querySelector('#theme').addEventListener('click',()=>{const next=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=next;localStorage.setItem('twlf-theme',next);document.querySelector('#themeIcon').textContent=next==='dark'?'☀':'☾'});
const theme=localStorage.getItem('twlf-theme')||'light';document.documentElement.dataset.theme=theme;document.querySelector('#themeIcon').textContent=theme==='dark'?'☀':'☾';
document.querySelector('#reset').addEventListener('click',()=>{links=seed.map(link=>link.category==='most-used'?{...link,category:legacyHome[link.id]||'reference',mostUsed:true,mostUsedSize:'standard'}:{...link});localStorage.removeItem(storageKey);mostUsedOrder=[];localStorage.removeItem('twlf-most-used-order');document.querySelector('#reset').hidden=true;render()});
document.querySelector('#reset').hidden=!localStorage.getItem(storageKey);render();

const settingsBackdrop=document.querySelector('#settingsBackdrop');
const columnsInput=document.querySelector('#columns');
columnsInput.value=displayColumns;document.querySelector('#columnCount').value=displayColumns;
document.querySelector('#settings').addEventListener('click',()=>{settingsBackdrop.hidden=false});
document.querySelector('#settingsClose').addEventListener('click',()=>{settingsBackdrop.hidden=true});
settingsBackdrop.addEventListener('click',event=>{if(event.target===settingsBackdrop)settingsBackdrop.hidden=true});
columnsInput.addEventListener('input',event=>{displayColumns=Number(event.target.value);document.querySelector('#columnCount').value=displayColumns;localStorage.setItem('twlf-display-columns',displayColumns);render()});
document.querySelector('#categoryForm').addEventListener('submit',event=>{event.preventDefault();const data=Object.fromEntries(new FormData(event.target));const category={id:`custom-category-${Date.now()}`,name:data.name.trim(),color:data.color};customCategories.push(category);categories.push(category);categoryOrder.push(category.id);localStorage.setItem(categoryStorageKey,JSON.stringify(customCategories));localStorage.setItem('twlf-category-order',JSON.stringify(categoryOrder));populateCategorySelect();event.target.reset();event.target.elements.color.value='#287b67';document.querySelector('#notice').innerHTML=`<div class="notice">${escapeHtml(category.name)} category added.<button aria-label="Dismiss">×</button></div>`;render()});
function showAuthError(error){const message=error?.errorMessage||error?.message||'Microsoft sign-in could not be completed.';document.querySelector('#notice').innerHTML=`<div class="notice auth-error">${escapeHtml(message)}<button aria-label="Dismiss">×</button></div>`}
function updateAccountUI(){const account=window.twlfAuth.getAccount();const topButton=document.querySelector('#account'),settingsButton=document.querySelector('#settingsAccount');if(account){const name=account.name||account.username;topButton.textContent=name.split(' ')[0];topButton.title=account.username;document.querySelector('#accountName').textContent=name;document.querySelector('#accountStatus').textContent=account.username;settingsButton.textContent='Sign out'}else{topButton.textContent='Sign in';topButton.title='Sign in with Microsoft 365';document.querySelector('#accountName').textContent='Your portal';document.querySelector('#accountStatus').textContent='Not signed in';settingsButton.textContent='Sign in'}}
document.querySelector('#account').addEventListener('click',async()=>{if(window.twlfAuth.getAccount()){settingsBackdrop.hidden=false;return}try{await window.twlfAuth.signIn();updateAccountUI();document.querySelector('#notice').innerHTML='<div class="notice">Signed in with Microsoft 365.<button aria-label="Dismiss">×</button></div>'}catch(error){showAuthError(error)}});
document.querySelector('#settingsAccount').addEventListener('click',async()=>{try{if(window.twlfAuth.getAccount()){await window.twlfAuth.signOut()}else{await window.twlfAuth.signIn()}updateAccountUI();settingsBackdrop.hidden=true}catch(error){showAuthError(error)}});
window.twlfAuth.ready.then(updateAccountUI).catch(showAuthError);

let draggedPanel=null,draggedLink=null,draggedContext=null;
document.querySelector('#content').addEventListener('dragstart',event=>{const card=event.target.closest('[data-link]');if(card&&event.target.closest('.card-drag')){draggedLink=card.dataset.link;draggedContext=card.dataset.context;card.classList.add('dragging');event.dataTransfer.effectAllowed='move';return}const panel=event.target.closest('[data-panel]');if(!panel||active!=='all'||panel.dataset.panel==='most-used')return;draggedPanel=panel.dataset.panel;panel.classList.add('dragging');event.dataTransfer.effectAllowed='move'});
document.querySelector('#content').addEventListener('dragover',event=>{if(draggedLink){const target=event.target.closest('[data-link]');if(!target||target.dataset.context!==draggedContext)return;event.preventDefault();document.querySelectorAll('[data-link]').forEach(item=>item.classList.toggle('card-drag-target',item===target&&item.dataset.link!==draggedLink));return}if(!draggedPanel)return;const panel=event.target.closest('[data-panel]');if(!panel||panel.dataset.panel==='most-used')return;event.preventDefault();document.querySelectorAll('[data-panel]').forEach(item=>item.classList.toggle('drag-target',item===panel&&item.dataset.panel!==draggedPanel))});
document.querySelector('#content').addEventListener('drop',event=>{event.preventDefault();if(draggedLink){const targetCard=event.target.closest('[data-link]'),target=targetCard?.dataset.link;if(!target||target===draggedLink||targetCard.dataset.context!==draggedContext)return;if(draggedContext==='most-used'){const current=matching('most-used').map(link=>String(link.id));const from=current.indexOf(draggedLink),to=current.indexOf(target);const [moved]=current.splice(from,1);current.splice(to,0,moved);mostUsedOrder=current;localStorage.setItem('twlf-most-used-order',JSON.stringify(mostUsedOrder))}else{const from=links.findIndex(link=>String(link.id)===draggedLink),to=links.findIndex(link=>String(link.id)===target);const [moved]=links.splice(from,1);links.splice(to,0,moved);save()}draggedLink=null;draggedContext=null;render();return}const target=event.target.closest('[data-panel]')?.dataset.panel;if(!target||target==='most-used'||target===draggedPanel)return;const from=categoryOrder.indexOf(draggedPanel),to=categoryOrder.indexOf(target);categoryOrder.splice(from,1);categoryOrder.splice(to,0,draggedPanel);categoryOrder=['most-used',...categoryOrder.filter(id=>id!=='most-used')];localStorage.setItem('twlf-category-order',JSON.stringify(categoryOrder));draggedPanel=null;render()});
document.querySelector('#content').addEventListener('dragend',()=>{draggedPanel=null;draggedLink=null;draggedContext=null;document.querySelectorAll('[data-panel],[data-link]').forEach(item=>item.classList.remove('dragging','drag-target','card-drag-target'))});
