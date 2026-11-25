'use strict';
const DemoUI=(()=>{
 const m=DemoModel;
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const f=n=>money(Math.round(n)), pct=n=>(n*100).toLocaleString('ru-RU',{maximumFractionDigits:1})+'%';
 const price=n=>n.toLocaleString('ru-RU');
 const table=(h,rows)=>'<div class="demo-table" tabindex="0" role="region" aria-label="Таблица показателей"><table><thead><tr>'+h.map(x=>'<th scope="col">'+esc(x)+'</th>').join('')+'</tr></thead><tbody>'+rows.map(row=>'<tr>'+row.map(x=>'<td>'+esc(x)+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';
 const links='<nav class="demo-nav" aria-label="Кабинет"><a href="#/admin/products">Товары</a><a href="#/admin/orders">Заказы и уведомления</a><a href="#/admin/analytics">Аналитика</a><a href="#/admin/clients">Клиенты</a><a href="#/admin/team">Команда и начисления</a><a href="guide.pdf">Инструкция PDF</a></nav>';
 const section=(title,body,admin=false)=>'<section class="wrap demo-content"><span class="eyebrow">Демо интернет-магазина</span><h1>'+title+'</h1>'+(admin?links:'')+body+'</section>';
 const options=(items,selected)=>items.map(([k,v])=>'<option value="'+esc(k)+'"'+(k===selected?' selected':'')+'>'+esc(v)+'</option>').join('');
 const manual='<p class="muted">Все данные вымышлены. Изменения сохраняются только в этом браузере. Письма, сообщения и платежи наружу не отправляются.</p>';
 const checkoutPage=()=>{
  const rows=m.orderRows(bag);
  main.innerHTML=section('Оформление тестового заказа',rows.length?manual+table(['Образ','Размер','Количество','Сумма'],rows.map(x=>[x.name,x.size,x.n,f(x.price*x.n)]))+
    '<form data-demo-form="checkout"><label>Получение <select name="delivery">'+options(Object.entries(m.delivery).map(([k,v])=>[k,v.name+' · '+f(v.fee)]),'pickup')+'</select></label><label>Оплата <select name="payment">'+options([['mini','Без оплаты'],['test-ok','Тестовая оплата: успешно'],['test-fail','Тестовая оплата: отклонена']],'mini')+'</select></label><p>Итого с получением: <output id="checkout-sum"></output></p><button class="solid" type="submit">Оформить тестовый заказ</button></form><p data-demo-result role="status"></p><a class="under" href="#/bag">Вернуться в корзину</a>':empty('Добавьте образ в корзину, чтобы пройти оформление.'));
  if(rows.length)updateCheckout();
 };
 function updateCheckout(){const form=main.querySelector('[data-demo-form="checkout"]');if(form)main.querySelector('#checkout-sum').textContent=f(m.orderRows(bag).reduce((n,r)=>n+r.price*r.n,0)+m.delivery[form.elements.delivery.value].fee)}
 const orderUrl=id=>'#/order/'+encodeURIComponent(id);
 function buyerOrder(id,confirm=false){
  const list=m.orders().slice().reverse();
  if(!id){main.innerHTML=section('Мои тестовые заказы',list.length?list.map(o=>'<article class="demo-order"><h2><a class="under" href="'+orderUrl(o.id)+'">'+esc(o.id)+'</a></h2><p>'+esc(o.status)+' · '+f(o.total)+'</p>'+(m.canCancel(o)?'<a class="under" href="'+orderUrl(o.id)+'/cancel">Отменить тестовый заказ</a>':'')+'</article>').join(''):empty('В этом браузере пока нет тестовых заказов.'));return;}
  const o=list.find(x=>x.id===id);
  if(!o){main.innerHTML=section('Тестовый заказ не найден','<p>Заказ доступен только в том браузере, где его оформили.</p><a class="under" href="#/order">Мои тестовые заказы</a>');return;}
  main.innerHTML=section('Ваш тестовый заказ','<p><strong>'+esc(o.id)+'</strong> · '+esc(o.status)+'</p>'+
   table(['Образ','Размер','Количество','Сумма'],o.rows.map(r=>[r.name,r.size,r.n,f(r.price*r.n)]))+
   '<dl class="demo-order"><dt>Товары</dt><dd>'+f(o.subtotal)+'</dd><dt>Получение: '+esc(o.method)+'</dt><dd>'+f(o.fee)+'</dd><dt><strong>Итого</strong></dt><dd><strong>'+f(o.total)+'</strong></dd></dl><p>'+esc(o.payment)+'</p>'+
   (m.canCancel(o)?'<details class="demo-order cancellation"'+(confirm?' open':'')+'><summary>Отменить тестовый заказ</summary><form data-demo-form="cancel" data-id="'+esc(o.id)+'"><p>Заказ останется в истории со статусом «Отменён». Деньги не списывались.</p><button type="submit">Подтвердить отмену</button><p data-demo-result role="status"></p></form></details>':'')+
   '<details class="demo-order"><summary>О тестовом заказе</summary><p>Деньги не списываются, доставка не выполняется. Заказ сохранён только в этом браузере.</p></details><nav class="demo-nav" aria-label="Действия с заказом"><a href="#/order">Мои тестовые заказы</a><a href="#/support">Служба поддержки и контакты</a><a href="#/collection">Продолжить просмотр</a></nav>');
 }
 const inquiries=()=>'<section><h2>Запросы по образам</h2>'+((m.read('inquiries',[])).map(q=>'<p>'+esc(q.product)+' · '+esc(q.topic)+'</p>').join('')||'<p>Пока нет тестовых запросов.</p>')+'</section>';
 const orderPage=()=>manual+inquiries()+(m.orders().length?m.orders().slice().reverse().map(o=>{
  const next=m.nextStatus(o.status);
  return '<article class="demo-order"><h2>'+esc(o.id)+'</h2><p>'+esc(o.status)+' · '+esc(o.method)+' · '+esc(o.payment)+' · '+f(o.total)+'</p>'+
    table(['Образ','Размер','Количество','Цена'],o.rows.map(r=>[r.name,r.size,r.n,f(r.price)]))+
    (next?'<button data-order-id="'+esc(o.id)+'" data-next="'+esc(next)+'">Перевести в «'+esc(next)+'»</button>':'')+
    '<details><summary>Журнал уведомлений</summary>'+o.log.map(x=>'<p><strong>'+esc(x.channel)+' (симуляция)</strong><br>'+esc(x.body)+'</p>').join('')+'</details></article>';
 }).join(''):'<p>Тестовых заказов пока нет. <a class="under" href="#/collection">Начать с каталога</a>.</p>');
 const categories=[['escalier','Элегантность в монохроме'],['salon','Зимняя коллекция 2026']];
 function productPage(){return manual+
  '<p><button data-pick-product="">Добавить товар</button></p><div class="demo-product-list">'+looks.map(p=>'<button data-pick-product="'+esc(p.id)+'">'+esc(p.name)+' · '+f(p.price)+'</button>').join('')+'</div>'+
  '<div id="product-editor"></div>';}
 function editProduct(id){
  const p=looks.find(x=>x.id===id)||{};
  main.querySelector('#product-editor').innerHTML='<form data-demo-form="product" data-id="'+esc(p.id||'')+'"><h2>'+(p.id?'Изменить товар':'Новый товар')+'</h2>'+
   '<div class="demo-fields">'+[['name','Название',90],['type','Категория / силуэт',60],['color','Цвет',60]].map(([k,l,n])=>'<label>'+l+' <input required name="'+k+'" maxlength="'+n+'" value="'+esc(p[k])+'"></label>').join('')+
   [['desc','Описание',420],['detail','Детали: по одной на строку',700],['styling','Рекомендации по стилю',420]].map(([k,l,n])=>'<label>'+l+' <textarea name="'+k+'" maxlength="'+n+'"'+(k==='styling'?'':' required')+'>'+esc(p[k])+'</textarea></label>').join('')+
   '<label>Цена, ₽ <input name="price" type="number" required min="1" max="9999999" step="1" value="'+esc(p.price)+'"></label><label>Коллекция <select name="collection">'+options(categories,p.collection||'salon')+'</select></label>'+
   '<label>Фото: JPG, PNG или WebP, до 1,5 МБ <input type="file" name="photo" accept="image/jpeg,image/png,image/webp"'+(p.id?'':' required')+'></label></div>'+
   '<p class="muted">Для демонстрации загружайте только изображения, которыми готовы пользоваться на собственном устройстве.</p><button class="solid" type="submit">Сохранить товар</button></form><p data-demo-result role="status"></p>';
 }
 function readPhoto(file){return new Promise((resolve,reject)=>{
   if(!/^image\/(jpeg|png|webp)$/.test(file.type)||file.size>1500000){reject(Error('Нужно изображение JPG, PNG или WebP не более 1,5 МБ.'));return}
   const reader=new FileReader();reader.onerror=()=>reject(Error('Фото не прочитано.'));reader.onload=()=>{
    const img=new Image();img.onload=()=>resolve(String(reader.result));img.onerror=()=>reject(Error('Файл не распознаётся как изображение.'));img.src=String(reader.result);
   };reader.readAsDataURL(file);
 });}
 function metrics(x){return [['План',f(x.plan)],['Факт',f(x.revenue)],['Отклонение',f(x.gap)],['Покупки',x.orders],['Единицы',x.units],['Средний чек',f(x.check)]].map(([k,v])=>'<div><span>'+k+'</span><strong>'+esc(v)+'</strong></div>').join('');}
 function chart(days){
  const max=Math.max(...days.map(d=>Math.max(d.plan,d.revenue)));
  return '<div class="demo-chart" aria-hidden="true">'+days.map(d=>'<div><span>'+d.day+'.11</span><i style="width:'+d.plan/max*100+'%"></i><b style="width:'+d.revenue/max*100+'%"></b></div>').join('')+'</div>';
 }
 function analytics(){
  const days=m.saleDays, all=m.stats(days), first=m.firstGap(days), current=days.find(d=>d.day===first), prev=days.find(d=>d.day===first-1), action=m.read('action','');
  return manual+'<h2>Итоги месяца · ноябрь</h2><p>Закрытый учебный период: 1–10 ноября, одна розничная точка.</p><div class="demo-metrics">'+metrics(all)+'</div>'+
   '<h3>План и факт по дням</h3><p class="muted">Светлая полоса: план. Тёмная: факт.</p>'+chart(days)+table(['День','План','Выручка','Трафик','Покупки','Единицы','Средний чек'],days.map(d=>[d.day+'.11',f(d.plan),f(d.revenue),d.traffic,d.orders,d.units,f(d.revenue/d.orders)]))+
   '<h2>Где появился разрыв</h2><p>Первое накопленное отставание: <strong>'+first+' ноября</strong>. Отставание к этой дате '+f(m.stats(days.filter(x=>x.day<=first)).gap)+'. К предыдущему дню покупки изменились с '+prev.orders+' до '+current.orders+', средний чек с '+f(prev.revenue/prev.orders)+' до '+f(current.revenue/current.orders)+'. Эти данные показывают сопутствующие изменения, а не их причину.</p>'+
   '<form data-demo-form="action"><label>Проверить управленческую меру <select name="action" required><option value="">Выберите меру</option>'+options(Object.entries(m.actions).map(([k,x])=>[k,x.name]),action)+'</select></label><button class="solid" type="submit">Зафиксировать меру</button></form><p data-demo-result role="status"></p>'+
   (m.actions[action]?'<h3>Сравнение до и после</h3><p>'+esc(m.actions[action].why)+'</p>'+table(['Период','Выручка','Разрыв с планом','Покупки','Средний чек','Конверсия'],[['3–6 ноября',m.stats(days.slice(2,6))],['7–10 ноября',m.stats(days.slice(6,10))]].map(([l,x])=>[l,f(x.revenue),f(x.gap),x.orders,f(x.check),pct(x.conversion)]))+'<p class="muted">Периоды равной длины. Демоданные иллюстрируют проверку; они не доказывают, что показатели изменились из-за выбранной меры.</p>':'')+
   '<h2>Спрос и остатки</h2><p>Введите категорию, размер, цвет или сезон.</p><label>Фильтр <input type="search" id="stock-filter" placeholder="Например, трикотаж"></label><div id="stock-results">'+stockTable('')+'</div>';
 }
 function stockTable(value){const rows=m.stock.filter(x=>x.slice(0,5).join(' ').toLowerCase().includes(value.toLowerCase().trim()));return table(['Образ','Категория','Размер','Цвет','Сезон','Спрос','Остаток','Дефицит'],rows.map(x=>[...x,Math.max(0,x[5]-x[6])]))}
 function clients(){
  return manual+'<label>Сегмент <select id="client-filter">'+options([['','Все'],...m.clients.map(x=>[x.segment,x.segment])],'')+'</select></label><div id="client-records">'+clientList('')+'</div>';
 }
 function clientList(segment){return m.clients.filter(x=>!segment||x.segment===segment).map(x=>'<article class="demo-order"><h2>'+esc(x.name)+'</h2><p>'+esc(x.segment)+' · '+esc(x.preference)+'</p><details><summary>История покупок и заметки</summary>'+table(['Дата','Покупка','Сумма'],x.purchases.map(([d,p,n])=>[d,p,f(n)]))+'<p>'+esc(x.note)+'</p></details></article>').join('');}
 function team(){return manual+'<p>Вес смен распределяет план продавцов. Премия продавца считается от личных продаж, управляющего — от выручки точки.</p>'+
   table(['Сотрудник','Роль','Смены','Вес','План','Продажи','Выполнение','Вклад','Оклад','Ставка премии','Премия','К начислению'],m.payroll().map(x=>[x.name,x.role,x.shifts,x.weight||'—',f(x.plan),f(x.sales),pct(x.sales/x.plan),x.contribution===null?'—':pct(x.contribution),f(x.base),pct(x.rate),f(x.bonus),f(x.pay)]))+
   '<details><summary>Правила демонстрационного расчёта</summary><p>Продавец: 2% от личных продаж до выполнения плана, 3,5% при выполнении. Управляющий: 1,2% от выручки точки до выполнения плана, 2,5% при выполнении. К премии прибавляется оклад. Правила этого магазина вымышлены.</p></details>';}
 const pages={products:['Управление товарами',productPage],orders:['Заказы и уведомления',orderPage],analytics:['Управление розницей',analytics],clients:['Клиентская база',clients],team:['Команда и начисления',team]};
 function render(page,id,action){if(page==='checkout'){checkoutPage();return}if(page==='order'){buyerOrder(id,action==='cancel');return}const key=Object.hasOwn(pages,id)?id:'products',[title,body]=pages[key];main.innerHTML=section(title,body(),true);}
 main.addEventListener('change',e=>{if(e.target.name==='delivery')updateCheckout();if(e.target.id==='client-filter')main.querySelector('#client-records').innerHTML=clientList(e.target.value);});
 main.addEventListener('input',e=>{if(e.target.id==='stock-filter')main.querySelector('#stock-results').innerHTML=stockTable(e.target.value);});
 main.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const {pickProduct,orderId,next}=b.dataset;if(pickProduct!==undefined)editProduct(pickProduct);if(orderId&&m.advance(orderId,next))render('admin','orders');});
 main.addEventListener('submit',async e=>{
  const form=e.target,k=form.dataset.demoForm;if(!k)return;e.preventDefault();const result=main.querySelector('[data-demo-result]'),d=new FormData(form);
  if(k==='checkout'){
   const x=m.checkout(bag,d.get('delivery'),d.get('payment'));
   if(x.error){result.textContent=x.error;return}
   bag={};persist('bag',bag);count();
   location.hash=orderUrl(x.order.id);
  }else if(k==='cancel'){
   const id=form.dataset.id;
   if(!m.cancel(id)){if(result)result.textContent='Заказ не удалось отменить. Проверьте его текущий статус.';return}
   history.replaceState(history.state,'',orderUrl(id));
   buyerOrder(id);
   main.focus({preventScroll:true});
   statusNode.textContent='Тестовый заказ отменён.';
  }else if(k==='inquiry'){
   const names={details:'Детали образа',size:'Размер',style:'Сочетания'},key=d.get('topic'),product=looks.find(x=>x.id===form.dataset.id);
   if(!result||!product||!Object.hasOwn(names,key))return;
   const stored=m.read('inquiries',[]);
   result.textContent=m.write('inquiries',[{product:product.name,topic:names[key]},...stored].slice(0,50))?'Тестовый запрос сохранён в этом браузере. Никуда не отправлен.':'Браузер не смог сохранить запрос.';
  }else if(k==='action'){
   if(!Object.hasOwn(m.actions,d.get('action'))||!m.write('action',d.get('action'))){result.textContent='Не удалось сохранить меру.';return}
   render('admin','analytics');main.querySelector('[data-demo-result]').textContent='Мера сохранена. Сравнение доступно ниже.';
  }else if(k==='product'){
   const fields=['name','type','color','desc','detail','styling'],p=Object.fromEntries(fields.map(x=>[x,String(d.get(x)||'').trim()])),n=Number(d.get('price')),g=d.get('collection'),orig=looks.find(x=>x.id===form.dataset.id);
   if(fields.some(k=>(k!=='styling'&&!p[k])||/[<>&"'\u0000-\u0008\u000b\u000c\u000e-\u001f]/u.test(p[k]))||!Number.isSafeInteger(n)||n<1||n>9999999||!categories.some(x=>x[0]===g)){result.textContent='Проверьте поля. Уберите HTML-символы из текста.';return;}
   p.id=orig?.id||'demo-'+crypto.randomUUID();p.price=n;p.collection=g;
   const file=d.get('photo');
   try{if(file?.size){p.photo=await readPhoto(file);}else if(orig){p.photo=orig.photo;p.gallery=orig.gallery;}else throw Error('Добавьте фотографию.');
     const updated=orig?looks.map(x=>x.id===orig.id?p:x):[...looks,p];
     if(!m.write('catalog',updated))throw Error('Хранилище браузера заполнено. Выберите фото меньшего размера.');
     looks.splice(0,looks.length,...updated);render('admin','products');editProduct(p.id);main.querySelector('[data-demo-result]').textContent='Товар сохранён и виден в каталоге.';
   }catch(err){result.textContent=err.message}
  }
 });
 return {render};
})();
route();
