/* The catalog (links + categories) is shared: it comes from links.json and is
 * the same for everyone. Everything personal — card sizes, ordering, column
 * count, theme, Most Used, which modules are on — comes from window.twlfPrefs,
 * which syncs to the signed-in user's OneDrive app folder. */

const mostUsedCategory = { id: 'most-used', name: 'Most Used', color: '#d9623f' };

let catalog = { version: 1, categories: [], defaultMostUsed: [], links: [] };
let prefs = window.twlfPrefs.get();
let categories = [mostUsedCategory];
let links = [];
let mostUsed = [];
let mostUsedOrder = [];
let categoryOrder = ['most-used'];
let linkOrder = {};
let sizes = {};
let displayColumns = 2;

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
const escapeHtml = value => { const node=document.createElement('div'); node.textContent=value; return node.innerHTML; };

const isMostUsed = id => mostUsed.includes(String(id));
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
  categories = [mostUsedCategory, ...catalog.categories, ...(prefs.customCategories || [])];
  links = [...catalog.links, ...(prefs.customLinks || [])];
  mostUsed = (prefs.mostUsed || catalog.defaultMostUsed || []).map(String);
  mostUsedOrder = (prefs.mostUsedOrder || []).map(String);
  linkOrder = prefs.linkOrder || {};
  sizes = prefs.sizes || {};
  displayColumns = Number(prefs.displayColumns) || 2;
  const known = categories.map(category => category.id);
  const saved = (prefs.categoryOrder || []).filter(id => known.includes(id));
  categoryOrder = ['most-used', ...saved.filter(id => id !== 'most-used'),
    ...known.filter(id => id !== 'most-used' && !saved.includes(id))];
  applyTheme(prefs.theme || 'light');
}

function save() {
  window.twlfPrefs.set({
    customLinks: links.filter(isPersonalLink),
    customCategories: prefs.customCategories || [],
    mostUsed, mostUsedOrder, categoryOrder, linkOrder, sizes, displayColumns,
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
    <a href="${safeUrl}" target="_blank" rel="noreferrer">
      <span class="logo"><span class="fallback">${safeName.slice(0,2).toUpperCase()}</span><img src="${escapeHtml(link.logo || officialLogo(link.id))}" alt="" onerror="this.style.display='none'" onload="if(this.naturalWidth)this.parentNode.classList.add('has-logo')"></span>
      <span class="link-copy"><strong>${safeName}</strong><small class="link-address">${safeHost}</small><small class="description">${description}</small></span><span class="open">↗</span>
    </a></article>`;
}

function matching(categoryId) {
  const found=links.filter(link => (categoryId==='most-used'?isMostUsed(link.id):link.category===categoryId) && `${link.name} ${hostname(link.url)}`.toLowerCase().includes(query));
  const order = categoryId==='most-used' ? mostUsedOrder : (linkOrder[categoryId] || []);
  if (!order.length) return found;
  return [...found].sort((a,b)=>{const ai=order.indexOf(String(a.id)),bi=order.indexOf(String(b.id));return (ai<0?9999:ai)-(bi<0?9999:bi)});
}

function render() {
  document.documentElement.style.setProperty('--display-columns',displayColumns);
  const nav = [{id:'all',name:'All'},...categories];
  document.querySelector('#categoryNav').innerHTML = nav.map(item => `<button class="${active===item.id?'active':''}" data-category="${item.id}">${item.name}<span>${item.id==='all'?links.length:item.id==='most-used'?links.filter(link=>isMostUsed(link.id)).length:links.filter(link=>link.category===item.id).length}</span></button>`).join('');
  const orderedCategories = categoryOrder.map(id => categoryById(id)).filter(Boolean);
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
  document.querySelector('#modalIntro').textContent=link?'Its category card and Most Used card can have different sizes.':'Adds a link to your own portal. Firm-wide links are managed in the shared catalog.';
  document.querySelector('#saveLink').textContent=link?'Save changes':'Add link';
  if(link){
    form.elements.name.value=link.name;form.elements.url.value=link.url;
    form.elements.logo.value=link.logo||'';form.elements.description.value=link.description||'';
    form.elements.category.value=link.category;
    form.elements.size.value=sizeFor(link,'category');
    form.elements.mostUsed.checked=isMostUsed(link.id);
    form.elements.mostUsedSize.value=sizeFor(link,'most-used');
  }
  setSharedFieldsEnabled(!shared);
  toggleMostUsedSize();
  document.querySelector('#backdrop').hidden=false;
}
const closeModal=()=>{document.querySelector('#backdrop').hidden=true;editingId=null;editingContext=null};
document.querySelector('#close').onclick=closeModal; document.querySelector('#cancel').onclick=closeModal;
document.querySelector('#backdrop').addEventListener('click',event=>{if(event.target.id==='backdrop')closeModal()});
function populateCategorySelect(){document.querySelector('#categorySelect').innerHTML=categories.filter(category=>category.id!=='most-used').map(category=>`<option value="${category.id}">${category.name}</option>`).join('')}
function toggleMostUsedSize(){document.querySelector('#mostUsedSizeLabel').hidden=!document.querySelector('#form').elements.mostUsed.checked}
document.querySelector('#form').elements.mostUsed.addEventListener('change',toggleMostUsedSize);

document.querySelector('#form').addEventListener('submit',async event=>{
  event.preventDefault();
  const data=Object.fromEntries(new FormData(event.target));
  const existing=editingId?links.find(link=>String(link.id)===String(editingId)):null;
  const writable=catalogWritable();
  const personal=existing?isPersonalLink(existing):!writable;
  const id=existing?existing.id:(writable?`s-${Date.now()}`:`custom-${Date.now()}`);
  if(!/^https?:\/\//i.test(data.url))data.url=`https://${data.url}`;
  if(data.logo && !/^https?:\/\//i.test(data.logo))data.logo=`https://${data.logo}`;
  const category=categoryById(data.category);
  const entry={id,name:data.name.trim(),url:data.url,logo:data.logo.trim(),description:data.description.trim(),category:data.category,color:category?.color||'#75808a'};

  // Size and Most Used are personal for every link, shared or not.
  sizes={...sizes,[id]:{category:data.size||'standard',mostUsed:data.mostUsedSize||data.size||'standard'}};
  const wanted=Boolean(data.mostUsed);
  if(wanted&&!isMostUsed(id))mostUsed=[...mostUsed,String(id)];
  if(!wanted)mostUsed=mostUsed.filter(item=>item!==String(id));

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
  window.twlfPrefs.set({mostUsed:null,mostUsedOrder:[],categoryOrder:[],linkOrder:{},sizes:{},customLinks:[],displayColumns:2});
  adoptPrefs();columnsInput.value=displayColumns;document.querySelector('#columnCount').value=displayColumns;
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
  populateCategorySelect();applyModules();render();
  document.querySelector('#reset').hidden=false;
  // When the account's settings arrive after a redirect sign-in, re-adopt.
  window.twlfPrefs.onChange(()=>{adoptPrefs();columnsInput.value=displayColumns;document.querySelector('#columnCount').value=displayColumns;applyModules();populateCategorySelect();render();updateAccountUI()});
  window.twlfCatalog.onChange(()=>{adoptPrefs();populateCategorySelect();render();updateCatalogUI()});
  updateCatalogUI();
  window.twlfAuth.ready.then(async()=>{
    await window.twlfPrefs.adoptAfterSignIn();
    await window.twlfCatalog.sync();
    updateAccountUI();updateCatalogUI();
  }).catch(showAuthError);
}
boot();
