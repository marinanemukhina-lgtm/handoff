
const main=document.querySelector('main');
const statusNode=document.querySelector('#status');

const money=n=>n.toLocaleString('ru-RU')+' ₽';
const imagePath=p=>p.photo;
const productLink=p=>'#/look/'+p.id;
function restore(key,fallback){try{return JSON.parse(localStorage.getItem('miette.'+key))??fallback}catch{return fallback}}
let saved=restore('saved',[]), bag=restore('bag',{});
const persist=(key,value)=>{try{localStorage.setItem('miette.'+key,JSON.stringify(value))}catch{statusNode.textContent='Сохранение в этом браузере недоступно.'}};
const count=()=>document.querySelector('#count').textContent=Object.values(bag).reduce((a,b)=>a+b,0);
function heart(p){return '<button class="heart" data-save="'+p.id+'" aria-label="Избранное · '+p.name+'" aria-pressed="'+saved.includes(p.id)+'">'+(saved.includes(p.id)?'♥':'♡')+'</button>'}
function grid(items){return '<div class="grid">'+items.map(p=>'<article class="card"><a href="'+productLink(p)+'"><img loading="lazy" width="362" height="362" src="'+imagePath(p)+'" alt="'+p.type+' '+p.name+' на кошке"><h3>'+p.name+'</h3><small>'+p.type+' · '+p.color+'</small><br>'+money(p.price)+'</a>'+heart(p)+'</article>').join('')+'</div>'}
function empty(msg){return '<div class="empty"><p>'+msg+'</p><a class="under" href="#/collection">Посмотреть коллекцию</a></div>'}
let openingTimer, startSwipe;
function nextScene(stage,quick=false){
 if(document.body.dataset.presentation!==stage||!['opening','staircase'].includes(stage))return;
 history.replaceState(history.state,'',stage==='staircase'?'#/presentation/salon':'#/presentation/staircase');
 route(quick);
 statusNode.textContent=stage==='staircase'?'Зимняя коллекция открыта.':'Вечерние образы открыты.';
}
function home(stage='opening',quick=false){
 const salon=stage==='salon', stairs=stage==='staircase';
 document.body.dataset.presentation=stage;
 const badge='<div class="presentation-brand">Демо интернет-магазина</div>';
 const arrow='<svg width="19" height="12" viewBox="0 0 19 12" aria-hidden="true" focusable="false"><path d="M1 6h16m-5-5 5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.1"/></svg>';
 const first='<picture class="presentation-photo"><source media="(max-width:760px)" srcset="apparition-mobile.webp"><img width="1672" height="941" fetchpriority="high" src="apparition.webp" alt="Чёрная кошка выглядывает из-за каменной балясины. Видны глаз, передняя лапа и брошь."></picture>';
 const second='<picture class="presentation-photo"><img width="1536" height="1024" fetchpriority="high" src="salon.webp" alt="Рыжая кошка в шафрановом берете и белая пушистая кошка в голубом."></picture>';
 const staircase='<picture class="presentation-photo"><source media="(max-width:760px)" srcset="staircase-mobile.webp"><img width="1672" height="941" fetchpriority="high" src="staircase.webp" alt="Чёрная и рыжая кошки в вечерних нарядах на красной лестнице."></picture>';
 main.innerHTML='<section class="presentation presentation-'+stage+(quick?' presentation-quick':'')+'" aria-labelledby="presentation-title">'+(salon?second:stairs?staircase:first)+badge+
  (stage==='opening'?'<picture class="presentation-photo blink-layer" aria-hidden="true"><source media="(max-width:760px)" srcset="eye-blink-mobile.svg"><img width="1672" height="941" src="eye-blink.svg" alt=""></picture>':'')+
  '<div class="presentation-caption"><span class="presentation-index">'+(salon?'03 / 03':stairs?'02 / 03':'01 / 03')+'</span>'+
  (salon?'<p class="presentation-kicker">В центре внимания: новинки</p><h1 id="presentation-title">Зимняя коллекция 2026</h1><p>У рыжей модели шафрановый берет с листьями поддерживает цвет джемпера. Голубые перья и мягкий трикотаж белой кошки перекликаются с прохладным тоном резных панелей.</p><div class="presentation-actions"><a class="presentation-next" href="#/collection">Открыть каталог '+arrow+'</a></div>':
  stairs?'<h1 id="presentation-title">Вечерние образы</h1><div class="opening-progress" aria-hidden="true"></div>':'<h1 id="presentation-title">Элегантность в монохроме</h1><p>На чёрных перьях проступает рисунок света. Сверкающая брошь подчёркивает воротник первой модели, пятнистый воротник второй перекликается с рыжей шерстью.</p><div class="opening-progress" aria-hidden="true"></div>')+
  '</div></section>';
 if(!salon)openingTimer=setTimeout(()=>nextScene(stage),stairs?3000:4200);
}
function browse(search,group){const expanded=search||(typeof matchMedia==='function'&&matchMedia('(min-width:761px)').matches);main.innerHTML='<section class="wrap catalog-page"><h1>'+(search?'Поиск':group==='escalier'?'Элегантность в монохроме':group==='salon'?'Зимняя коллекция 2026':'Коллекция')+'</h1><p>Кейп с чёрными перьями, пелерина с бахромой и джемперы в шафрановом и припылённо-голубом оттенках.</p><details class="catalog-filters"'+(expanded?' open':'')+'><summary>Фильтры и сортировка <span aria-hidden="true" class="filter-symbol"></span></summary><div class="tools"><label>Поиск <input type="search" id="query" placeholder="Название или цвет"></label><label>Серия <select id="group"><option value="">Все</option><option value="escalier">Элегантность в монохроме</option><option value="salon">Зимняя коллекция 2026</option></select></label><label>Силуэт <select id="type"><option value="">Все</option>'+Array.from(new Set(looks.map(p=>p.type))).map(t=>'<option>'+t+'</option>').join('')+'</select></label><label>Сортировка <select id="sort"><option value="">Выбор ателье</option><option value="asc">Сначала дешевле</option><option value="desc">Сначала дороже</option></select></label><button data-reset>Сбросить</button></div></details><p id="matches" aria-live="polite"></p><div id="results"></div></section>';document.querySelector('#group').value=['escalier','salon'].includes(group)?group:'';filter();if(search)document.querySelector('#query').focus()}
function filter(){const q=document.querySelector('#query').value.toLocaleLowerCase().trim(),type=document.querySelector('#type').value,order=document.querySelector('#sort').value;let items=looks.filter(p=>(!type||p.type===type)&&(!document.querySelector('#group').value||p.collection===document.querySelector('#group').value)&&[p.name,p.type,p.color,p.desc].join(' ').toLocaleLowerCase().includes(q));if(order)items.sort((a,b)=>order==='asc'?a.price-b.price:b.price-a.price);document.querySelector('#matches').textContent='Найдено образов: '+items.length;document.querySelector('#results').innerHTML=items.length?grid(items):'<p>Попробуйте другое название, цвет или силуэт.</p>'}
const productEsc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function rememberLook(id){const items=restore('recent',[]);persist('recent',[id,...(Array.isArray(items)?items.filter(x=>x!==id):[])].slice(0,20))}
function recentLooks(){const items=restore('recent',[]);return (Array.isArray(items)?items:[]).map(id=>looks.find(p=>p.id===id)).filter(Boolean)}
function sizeGuide(){
 return '<details><summary>Гид по размеру</summary><p>Разложите изделие на ровной поверхности и измерьте его, не растягивая ткань. Сверьте схему и таблицу.</p>'+
 '<div class="size-guide"><svg viewBox="0 0 220 205" role="img" aria-label="Схема замеров изделия"><title>1. Ширина горловины. 2. Ширина по груди. 3. Длина по спинке.</title><path d="M77 31 53 43 25 80l34 24 10-13v80h82V91l10 13 34-24-28-37-24-12q-33 24-66 0z" fill="#f2e9df" stroke="#4d4037" stroke-width="1.6"/><g fill="none" stroke="#795151" stroke-width="1.7"><path d="M77 43h66M77 38v10m66-10v10M70 101h80M70 96v10m80-10v10M111 54v114m-5-114h10m-10 114h10"/></g><g fill="#543937" font-size="12" font-weight="650" text-anchor="middle"><text x="110" y="28">1</text><text x="55" y="105">2</text><text x="124" y="146">3</text></g></svg>'+
 '<table><caption>Демонстрационные замеры, см</caption><thead><tr><th scope="col">Замер</th><th scope="col">S</th><th scope="col">M</th></tr></thead><tbody><tr><th scope="row">1. Ширина горловины</th><td>12</td><td>14</td></tr><tr><th scope="row">2. Ширина по груди</th><td>17</td><td>20</td></tr><tr><th scope="row">3. Длина по спинке</th><td>25</td><td>29</td></tr></tbody></table></div>'+
 '<p class="muted">Значения приведены для примера, это не замеры наряда на фото.</p></details>';
}
function lookInfo(p){
 const esc=productEsc, details=String(p.detail||'').split(/\r?\n/).filter(Boolean);
 return '<div class="product-sections"><details open><summary>Описание</summary><p>'+esc(p.desc)+'</p><h2>Детали</h2><ul class="product-specs">'+details.map(v=>{const i=v.indexOf(':');return '<li>'+(i>0?'<strong>'+esc(v.slice(0,i+1))+'</strong>'+esc(v.slice(i+1)):esc(v))+'</li>'}).join('')+'</ul>'+
 (p.styling?'<h2>Рекомендации по стилю</h2><p>'+esc(p.styling)+'</p>':'')+
 '<p>Если вам понравился образ и хочется уточнить детали или размер, откройте «Оставить запрос». На этой витрине обращение сохраняется только в текущем браузере.</p></details>'+
 '<details><summary>Оставить запрос</summary><form data-demo-form="inquiry" data-id="'+esc(p.id)+'"><label>Тема <select name="topic"><option value="details">Детали образа</option><option value="size">Размер</option><option value="style">Сочетания</option></select></label> <button type="submit">Сохранить тестовый запрос</button></form><p data-demo-result role="status"></p></details>'+
 sizeGuide()+
 '<details><summary>Уход</summary><p>Наряды созданы для демонстрационной съёмки. Для товара в рабочем магазине в этом разделе указываются рекомендации производителя по уходу.</p></details>'+
 '<details><summary>Оплата и платежи</summary><p>Цены демонстрационные. В корзине можно попробовать оформление и тестовый платёж. Деньги не списываются.</p><a class="under" href="#/bag">Перейти в корзину</a></details></div>';
}
function detail(p){rememberLook(p.id);main.innerHTML='<section class="wrap"><p><a class="under" href="#/collection">← Коллекция</a></p><div class="product"><div class="gallery">'+(p.gallery||[{label:'Портрет из кампании',src:p.photo}]).map(({label:v,src},i)=>'<button data-zoom="'+i+'" aria-label="Увеличить · '+v+'"><img loading="'+(i?'lazy':'eager')+'" alt="'+p.name+' · '+v+'" src="'+src+'"></button>').join('')+'</div><div class="info"><span class="eyebrow">Демо · '+p.type+'</span><h1>'+p.name+'</h1><p class="price">'+money(p.price)+'</p><p>Оттенок · '+p.color+'</p><label>Демонстрационный размер <select id="size"><option>S</option><option>M</option></select></label><p class="actions"><button class="solid" data-add="'+p.id+'">В корзину</button><button data-save="'+p.id+'" aria-pressed="'+saved.includes(p.id)+'">Избранное '+(saved.includes(p.id)?'♥':'♡')+'</button></p><p class="muted" id="feedback">Демонстрационная примерка. Цена и наличие условные.</p>'+lookInfo(p)+'</div></div><nav class="demo-nav product-links" aria-label="Образы"><a href="#similar" data-similar>Вам понравится</a><a href="#/recent">Вы смотрели</a></nav><h2 id="similar" tabindex="-1">Вам понравится</h2>'+grid(looks.filter(x=>x!==p))+'</section>'}
function basket(){let total=0;const rows=Object.entries(bag).map(([key,n])=>{const [id,size]=key.split('.'),p=looks.find(x=>x.id===id);if(!p)return '';total+=p.price*n;return '<article class="bagrow"><a href="'+productLink(p)+'"><img src="'+imagePath(p)+'" alt="'+p.name+'"></a><div><h3><a href="'+productLink(p)+'">'+p.name+'</a></h3>'+size+' · '+money(p.price)+'</div><div class="actions"><button data-change="-1" data-key="'+key+'" aria-label="Уменьшить количество">−</button>'+n+'<button data-change="1" data-key="'+key+'" aria-label="Увеличить количество">+</button><button data-change="0" data-key="'+key+'">Удалить</button></div></article>'}).join('');main.innerHTML='<section class="wrap"><h1>Корзина</h1>'+(rows?rows+'<p class="price">Итого '+money(total)+'</p><p>Демонстрационная корзина сохраняется в этом браузере.</p><p><a class="solid demo-cta" href="#/checkout">Оформить тестовый заказ</a></p>':empty('Корзина пока пуста. Выберите образ и добавьте свой размер.'))+'</section>'}
document.querySelector('.skip').onclick=e=>{e.preventDefault();main.focus();main.scrollIntoView()};
function support(){
 main.innerHTML='<section class="wrap support-page"><span class="eyebrow">Демо интернет-магазина</span><h1>Служба поддержки и контакты</h1><div class="support-grid">'+
  '<section class="support-panel" aria-labelledby="support-order"><h2 id="support-order">Тестовые заказы</h2><p>Состав и статус заказа доступны в разделе «Мои тестовые заказы». По вопросам об образе можно оставить тестовый запрос в карточке товара.</p><div class="support-links"><a class="under" href="#/order">Мои тестовые заказы</a><a class="under" href="#/collection">Открыть каталог</a></div></section>'+
  '<section class="support-panel" aria-labelledby="support-map"><h2 id="support-map">Место на карте</h2><p><strong>Москва, Красная площадь</strong></p><a class="solid demo-cta" href="https://yandex.ru/maps/213/moscow/geo/krasnaya_ploshchad/1520633025/" target="_blank" rel="noopener noreferrer">Открыть в Яндекс Картах <span aria-hidden="true">↗</span></a></section>'+
  '</div></section>';
}
function route(quick=false){clearTimeout(openingTimer);openingTimer=undefined;const [,page,id,action]=location.hash.split('/');document.body.dataset.presentation='';document.body.dataset.page=page==='collection'||page==='search'?'catalog':'';if(page==='presentation'&&['salon','staircase'].includes(id))home(id,quick);else if(page==='admin'||page==='checkout'||page==='order')DemoUI.render(page,id,action);else if(page==='collection'||page==='search')browse(page==='search',id);else if(page==='recent'){const items=recentLooks();main.innerHTML='<section class="wrap"><h1>Вы смотрели</h1>'+(items.length?grid(items):empty('Здесь появятся образы, которые вы откроете.'))+'</section>'}else if(page==='saved'){const items=looks.filter(p=>saved.includes(p.id));main.innerHTML='<section class="wrap"><h1>Избранное</h1>'+(items.length?grid(items):empty('Здесь появятся образы, которые вы отметите сердцем.'))+'</section>'}else if(page==='bag')basket();else if(page==='support')support();else if(page==='look'&&looks.some(p=>p.id===id))detail(looks.find(p=>p.id===id));else home();count();document.title=(main.querySelector('h1')?.textContent||'Ателье')+' · Демо интернет-магазина'}
main.addEventListener('touchstart',e=>{
 const stage=document.body.dataset.presentation;
 if(e.touches.length!==1||!['opening','staircase'].includes(stage)||e.target.closest('a,button,input,select')){startSwipe=null;return;}
 const t=e.touches[0];startSwipe={id:t.identifier,x:t.clientX,y:t.clientY,stage};
},{passive:true});
main.addEventListener('touchcancel',()=>{startSwipe=null},{passive:true});
main.addEventListener('touchend',e=>{
 const s=startSwipe;startSwipe=null;if(!s||e.touches.length)return;
 const t=Array.from(e.changedTouches).find(x=>x.identifier===s.id);if(!t)return;
 const dx=s.x-t.clientX,dy=Math.abs(t.clientY-s.y);
 if(dx>=50&&dx>=dy*1.4)nextScene(s.stage,true);
},{passive:true});
main.addEventListener('click',e=>{if(e.target.closest('[data-similar]')){e.preventDefault();const h=document.querySelector('#similar');h?.focus({preventScroll:true});h?.scrollIntoView();return}const b=e.target.closest('button');if(!b)return;const d=b.dataset;if(d.save){saved=saved.includes(d.save)?saved.filter(x=>x!==d.save):[...saved,d.save];persist('saved',saved);if(location.hash==='#/saved')route();else{const on=saved.includes(d.save);b.setAttribute('aria-pressed',on);b.textContent=(b.classList.contains('heart')?'':'Избранное ')+(on?'♥':'♡')}statusNode.textContent=saved.includes(d.save)?'Образ в избранном':'Образ удалён из избранного'}else if(d.add){const k=d.add+'.'+document.querySelector('#size').value;bag[k]=(bag[k]||0)+1;persist('bag',bag);count();document.querySelector('#feedback').innerHTML='Добавлено. <a class="under" href="#/bag">Открыть корзину</a>';statusNode.textContent='Образ добавлен в корзину'}else if('change'in d){if(Number(d.change))bag[d.key]+=Number(d.change);if(!Number(d.change)||bag[d.key]<=0)delete bag[d.key];persist('bag',bag);basket();count()}else if('zoom'in d){const img=b.querySelector('img'),large=document.querySelector('#large');document.querySelector('#zoom').classList.remove('magnified');document.querySelector('#magnify').setAttribute('aria-pressed','false');document.querySelector('#magnify').textContent='Увеличить деталь';large.src=img.src;large.alt=img.alt;document.querySelector('#zoom').showModal()}else if('reset'in d){for(const id of ['query','type','sort','group'])document.getElementById(id).value='';filter()}});
main.addEventListener('input',e=>{if(e.target.id==='query')filter()});
main.addEventListener('change',e=>{if(['type','sort','group'].includes(e.target.id))filter()});
document.querySelector('#close').onclick=()=>document.querySelector('#zoom').close();
addEventListener('hashchange',()=>{route();scrollTo(0,0);if(location.hash!=='#/search')main.focus({preventScroll:true})});


document.querySelector('#magnify').onclick=e=>{const on=document.querySelector('#zoom').classList.toggle('magnified');e.currentTarget.setAttribute('aria-pressed',on);e.currentTarget.textContent=on?'Показать целиком':'Увеличить деталь';document.querySelector('.lightbox-body').focus()};
