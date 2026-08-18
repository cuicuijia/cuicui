const source=window.PORTFOLIO_DATA||{images:[],videos:[]};
const works=[...source.images,...source.videos];
const folders=[...new Set(source.images.map(item=>item.folder))];
const folderCounts=Object.fromEntries(folders.map(folder=>[folder,source.images.filter(item=>item.folder===folder).length]));
const series=[
  {id:'perfume',title:'循时香氛',en:'XUNSHI FRAGRANCE',cover:'图片/0727_Mj+NanoBanana让详情转化翻倍/01.webp',description:'以宋代制香文化为灵感构建的原创虚构香氛品牌。从冰裂纹瓷颈、金属瓶盖与香水瓶型，到“栀露”、四季香调及宋时制香场景，完整建立一套兼具古韵与现代商业感的产品世界。',match:item=>item.folder==='0727_Mj+NanoBanana让详情转化翻倍'||(item.type==='video'&&item.name.includes('循时'))},
  {id:'tea',title:'茶道东方茶饮',en:'TEA · MILK · LIFE',cover:'图片/0707_AI品牌设计综合应用/高端中国奶茶纸杯设计.webp',description:'由崔崔原创设计的虚构东方茶饮品牌。以“茶·奶·日·常”为线索，将水墨山形、书写性标识与克制的产品摄影延伸到杯身、海报、马克杯及餐巾纸等完整触点。',match:item=>item.folder==='0707_AI品牌设计综合应用'},
  {id:'cat',title:'猫 IP 世界',en:'ORIGINAL CAT IP',cover:'图片/0710_MJ品牌IP全案/世界杯夏日特饮海报设计.webp',description:'原创猫角色与品牌 IP 系列。通过统一的角色比例、神态与毛发质感，延展出夏日特饮、世界杯传播和城市职业守护者等不同叙事场景，兼顾角色辨识度与商业应用。',match:item=>item.folder==='0710_MJ品牌IP全案'||item.name.includes('守护者')}
];
const grid=document.querySelector('#workGrid');
const numbers=document.querySelector('.page-numbers');
const filters=document.querySelector('#folderFilters');
const folderCards=document.querySelector('#folderCards');
let filter='all',page=1;
const perPage=12;

function shortFolder(folder){return folder.replace(/^\d{4}[_ ]?/,'').replace(/一/g,'—')}
function createFilters(){
  const items=[['all',`全部 ${works.length}`],...series.map(item=>[`series:${item.id}`,`${item.title} ${works.filter(item.match).length}`]),['视频作品',`视频作品 ${source.videos.length}`],...folders.map(folder=>[folder,`${folder} ${folderCounts[folder]}`])];
  filters.innerHTML=items.map(([value,label],i)=>`<button class="${i===0?'active':''}" data-filter="${value}" title="${label}">${label}</button>`).join('');
  filters.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>selectFolder(button.dataset.filter,true)));
}
function createFolderCards(){
  folderCards.innerHTML=series.map((item,i)=>`<button class="style-card series-card tilt" data-folder="series:${item.id}" style="--cover:url('${item.cover}')"><span>${String(i+1).padStart(2,'0')} / ORIGINAL</span><h3>${item.title}</h3><p>${item.description}</p><b>${works.filter(item.match).length} WORKS · ${item.en}</b></button>`).join('');
  folderCards.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>selectFolder(button.dataset.folder,true)));
  bindTilt();
}
function selectFolder(value,scroll){
  filter=value;page=1;
  filters.querySelectorAll('button').forEach(button=>button.classList.toggle('active',button.dataset.filter===value));
  render();
  if(scroll)document.querySelector('#works').scrollIntoView({behavior:'smooth',block:'start'});
}
function currentList(){
  if(filter==='all')return works;
  if(filter==='视频作品')return source.videos;
  if(filter.startsWith('series:')){const selected=series.find(item=>item.id===filter.split(':')[1]);return selected?works.filter(selected.match):[];}
  return source.images.filter(item=>item.folder===filter);
}
function render(){
  const list=currentList();
  const pages=Math.max(1,Math.ceil(list.length/perPage));
  page=Math.min(page,pages);
  const visible=list.slice((page-1)*perPage,page*perPage);
  grid.innerHTML=visible.map((work,i)=>`<button class="work-card" data-path="${work.path}">${work.type==='video'?`<video src="${work.path}#t=0.1" muted preload="metadata"></video><span class="video-badge">▶ VIDEO</span>`:`<img src="${work.path}" alt="${work.name}" loading="lazy">`}<span class="work-card-copy"><small>${String((page-1)*perPage+i+1).padStart(3,'0')} / ${work.folder}</small><h3>${work.name}</h3><p>${work.path}</p></span></button>`).join('');
  const pageWindow=Array.from({length:pages},(_,i)=>i+1).filter(n=>pages<=7||n===1||n===pages||Math.abs(n-page)<=2);
  numbers.innerHTML=pageWindow.map((n,i,arr)=>`${i&&n-arr[i-1]>1?'<span>…</span>':''}<button class="${page===n?'active':''}" data-page="${n}">${String(n).padStart(2,'0')}</button>`).join('');
  const selectedSeries=filter.startsWith('series:')?series.find(item=>item.id===filter.split(':')[1]):null;
  document.querySelector('#resultSummary').textContent=`${filter==='all'?'全部作品':selectedSeries?.title||filter} · ${list.length} 件 · 第 ${page}/${pages} 页`;
  document.querySelector('#totalCount').textContent=works.length;
  bindCards();
}
function bindCards(){
  document.querySelectorAll('.work-card').forEach(card=>{
    card.addEventListener('mouseenter',()=>document.querySelector('.cursor').classList.add('view'));
    card.addEventListener('mouseleave',()=>document.querySelector('.cursor').classList.remove('view'));
    card.addEventListener('click',()=>openWork(works.find(item=>item.path===card.dataset.path)));
  });
}
numbers.addEventListener('click',event=>{if(event.target.dataset.page){page=+event.target.dataset.page;render();grid.scrollIntoView({behavior:'smooth',block:'start'});}});
document.querySelector('.page-prev').onclick=()=>{if(page>1){page--;render();grid.scrollIntoView({behavior:'smooth',block:'start'});}};
document.querySelector('.page-next').onclick=()=>{const pages=Math.ceil(currentList().length/perPage);if(page<pages){page++;render();grid.scrollIntoView({behavior:'smooth',block:'start'});}};

const dialog=document.querySelector('.work-dialog');
const dialogImg=dialog.querySelector('img');
const dialogVideo=dialog.querySelector('video');
function openWork(work){
  const isVideo=work.type==='video';
  dialogImg.style.display=isVideo?'none':'block';
  dialogVideo.style.display=isVideo?'block':'none';
  if(isVideo){dialogVideo.src=work.path;dialogVideo.load();}else{dialogImg.src=work.path;dialogImg.alt=work.name;}
  const belongingSeries=series.find(item=>item.match(work));
  dialog.querySelector('small').textContent=belongingSeries?`原创系列 / ${belongingSeries.title}`:work.folder;
  dialog.querySelector('h2').textContent=work.name;
  dialog.querySelector('p').textContent=belongingSeries?belongingSeries.description:`课程练习 · ${work.folder}`;
  dialog.showModal();document.body.classList.add('no-scroll');
}
function closeWork(){dialogVideo.pause();dialogVideo.removeAttribute('src');dialog.close();}
document.querySelector('.dialog-close').onclick=closeWork;
dialog.addEventListener('click',event=>{if(event.target===dialog)closeWork()});
dialog.addEventListener('close',()=>document.body.classList.remove('no-scroll'));

const heroVideo=document.querySelector('.hero-video');
const sound=document.querySelector('.sound');
sound.addEventListener('click',()=>{heroVideo.muted=!heroVideo.muted;sound.querySelector('span').textContent=heroVideo.muted?'SOUND OFF':'SOUND ON';});
function setupHeroFilmstrip(){
  const strip=document.querySelector('.filmstrip');
  const preview=document.querySelector('.film-hover-preview');
  const hero=document.querySelector('.hero');
  const coarsePointer=matchMedia('(pointer: coarse)');
  const isTouchLayout=()=>coarsePointer.matches||innerWidth<=900;
  const featured=[
    ...source.images.filter(item=>item.folder==='0727_Mj+NanoBanana让详情转化翻倍').slice(0,7),
    ...source.images.filter(item=>item.folder==='0707_AI品牌设计综合应用').slice(0,5),
    ...source.images.filter(item=>item.folder==='0710_MJ品牌IP全案').slice(0,4),
    ...source.images.filter(item=>item.folder==='0730_未来感全开一赛博朋克炫到看不清字').slice(0,2)
  ];
  const cardMarkup=featured.map((item,i)=>`<button class="film-card ${i===0?'active':''}" data-index="${i}" data-title="${item.name}" data-en="${shortFolder(item.folder)}"><img src="${item.path}" alt="${item.name}" loading="eager"></button>`).join('');
  strip.innerHTML=cardMarkup+cardMarkup.replaceAll('film-card ','film-card is-clone ');
  let paused=false;
  function selectCard(card){
    strip.querySelectorAll('.film-card.active').forEach(item=>item.classList.remove('active'));
    card.classList.add('active');
    const index=Number(card.dataset.index);
    document.querySelector('.film-caption strong').textContent=String(index+1).padStart(2,'0');
    document.querySelector('.film-caption span').textContent=card.dataset.title;
    document.querySelector('.film-caption small').textContent=card.dataset.en;
  }
  function showPreview(card){
    paused=true;
    preview.querySelector('img').src=card.querySelector('img').src;
    preview.querySelector('img').alt=card.dataset.title;
    preview.querySelector('strong').textContent=card.dataset.title;
    preview.querySelector('small').textContent=card.dataset.en;
    preview.classList.add('show');
    preview.setAttribute('aria-hidden','false');
    hero.classList.add('film-is-focused');
    selectCard(card);
  }
  function hidePreview(resume=false){
    preview.classList.remove('show');
    preview.setAttribute('aria-hidden','true');
    hero.classList.remove('film-is-focused');
    if(resume)paused=false;
  }
  strip.querySelectorAll('.film-card').forEach(card=>{
    card.addEventListener('click',()=>{
      if(isTouchLayout()){
        const isOpen=preview.classList.contains('show')&&card.classList.contains('active');
        if(isOpen)hidePreview(true);else showPreview(card);
        return;
      }
      selectCard(card);
    });
    card.addEventListener('pointerenter',event=>{if(event.pointerType!=='touch'&&!isTouchLayout())showPreview(card)});
    card.addEventListener('pointerleave',event=>{if(event.pointerType!=='touch'&&!isTouchLayout())hidePreview()});
    card.addEventListener('focus',()=>{if(!isTouchLayout())showPreview(card)});
    card.addEventListener('blur',()=>{if(!isTouchLayout())hidePreview()});
  });
  strip.addEventListener('pointerenter',event=>{if(event.pointerType!=='touch'&&!isTouchLayout())paused=true});
  strip.addEventListener('pointerleave',event=>{if(event.pointerType!=='touch'&&!isTouchLayout())hidePreview(true)});
  strip.addEventListener('wheel',event=>{if(Math.abs(event.deltaY)>Math.abs(event.deltaX)){event.preventDefault();strip.scrollLeft+=event.deltaY;}},{passive:false});
  preview.addEventListener('click',()=>{if(isTouchLayout())hidePreview(true)});
  document.addEventListener('pointerdown',event=>{
    if(isTouchLayout()&&preview.classList.contains('show')&&!strip.contains(event.target)&&!preview.contains(event.target))hidePreview(true);
  });
  document.addEventListener('keydown',event=>{if(event.key==='Escape')hidePreview(true)});
  let lastTime=performance.now();
  function autoScroll(time){
    const delta=Math.min(32,time-lastTime);lastTime=time;
    if(!paused&&!document.hidden&&!matchMedia('(prefers-reduced-motion: reduce)').matches){strip.scrollLeft+=delta*.035;if(strip.scrollLeft>=strip.scrollWidth/2)strip.scrollLeft-=strip.scrollWidth/2;}
    requestAnimationFrame(autoScroll);
  }
  requestAnimationFrame(autoScroll);
}
const cursor=document.querySelector('.cursor');
window.addEventListener('pointermove',event=>{cursor.style.left=event.clientX+'px';cursor.style.top=event.clientY+'px';});
document.querySelectorAll('.magnetic').forEach(el=>{
  el.addEventListener('pointermove',event=>{const rect=el.getBoundingClientRect();el.style.transform=`translate(${(event.clientX-rect.left-rect.width/2)*.12}px,${(event.clientY-rect.top-rect.height/2)*.12}px)`;});
  el.addEventListener('pointerleave',()=>el.style.transform='');
});
function bindTilt(){
  document.querySelectorAll('.tilt').forEach(el=>{
    if(el.dataset.tiltBound)return;el.dataset.tiltBound='1';
    el.addEventListener('pointermove',event=>{const rect=el.getBoundingClientRect(),x=(event.clientX-rect.left)/rect.width-.5,y=(event.clientY-rect.top)/rect.height-.5;el.style.transform=`perspective(900px) rotateX(${-y*5}deg) rotateY(${x*7}deg)`;});
    el.addEventListener('pointerleave',()=>el.style.transform='');
  });
}
function setupMethodInteraction(){
  const method=document.querySelector('.method');
  if(!method)return;
  method.addEventListener('pointermove',event=>{const rect=method.getBoundingClientRect();method.style.setProperty('--method-x',`${((event.clientX-rect.left)/rect.width)*100}%`);method.style.setProperty('--method-y',`${((event.clientY-rect.top)/rect.height)*100}%`);});
  method.addEventListener('pointerleave',()=>{method.style.setProperty('--method-x','50%');method.style.setProperty('--method-y','35%');});
}
function setupPanelInteraction(){
  document.querySelectorAll('.panel-interactive').forEach(panel=>{
    panel.addEventListener('pointermove',event=>{const rect=panel.getBoundingClientRect();panel.style.setProperty('--panel-x',`${((event.clientX-rect.left)/rect.width)*100}%`);panel.style.setProperty('--panel-y',`${((event.clientY-rect.top)/rect.height)*100}%`);});
    panel.addEventListener('pointerleave',()=>{panel.style.setProperty('--panel-x','50%');panel.style.setProperty('--panel-y','50%');});
  });
}
function setupMicroInteractions(){
  const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('.micro-item').forEach(item=>{
    item.addEventListener('pointerenter',()=>item.classList.add('micro-active'));
    item.addEventListener('pointermove',event=>{
      const rect=item.getBoundingClientRect();
      const x=(event.clientX-rect.left)/rect.width;
      const y=(event.clientY-rect.top)/rect.height;
      item.style.setProperty('--item-x',`${x*100}%`);item.style.setProperty('--item-y',`${y*100}%`);
      if(reduceMotion)return;
      const rotateY=(x-.5)*7,rotateX=(.5-y)*6;
      const lift=item.matches('.ticker span')?32:item.matches('li')?22:18;
      const shift=item.matches('.ticker span')?8:item.matches('li')?6:0;
      item.style.transform=`perspective(700px) translateX(${shift}px) translateZ(${lift}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    item.addEventListener('pointerleave',()=>{item.classList.remove('micro-active');item.style.transform='';item.style.removeProperty('--item-x');item.style.removeProperty('--item-y');});
  });
}
const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add('visible')}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
let lastY=0;
addEventListener('scroll',()=>{const y=scrollY;document.querySelector('.topbar').classList.toggle('hide',y>lastY&&y>180);lastY=y;},{passive:true});
createFilters();createFolderCards();render();bindTilt();setupHeroFilmstrip();setupMethodInteraction();setupPanelInteraction();setupMicroInteractions();
window.addEventListener('load',()=>setTimeout(()=>document.querySelector('.loader').classList.add('done'),450));
