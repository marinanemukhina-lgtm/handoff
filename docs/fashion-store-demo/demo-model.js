'use strict';
const DemoModel=(()=>{
 const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem('miette.demo.'+key))??fallback}catch{return fallback}};
 const write=(key,value)=>{try{localStorage.setItem('miette.demo.'+key,JSON.stringify(value));return true}catch{return false}};
 const seed=looks.map(p=>({...p}));
 const previousCopy={"minuit":{"desc":"Острые уголки светлого воротника выделяются на чёрной шерсти. Ниже расходятся длинные чёрные перья, а прозрачные бусины над ушами ловят тот же свет, что и воротник.","detail":"Гладкая линия плеч переходит в объёмный силуэт. Длинные перья спускаются на дорожку за передней лапой."},"ambre":{"desc":"Высокий пятнистый воротник подхватывает охристый цвет шерсти. Длинная чёрная бахрома расходится спереди и обрамляет лапы, не скрывая их.","detail":"Узкая горловина удерживает округлый объём у плеч. Тонкие блестящие пряди контрастируют с плотным рисунком воротника."},"safran":{"desc":"Шафрановый берет наклонён набок. Над его краем поднимаются зелёные листья, а золотистая отделка повторяет тёплый оттенок шерсти рыжей кошки.","detail":"Круглая горловина и короткие рукава с плотными манжетами. Гладкая поверхность джемпера оставляет главным акцентом отделку берета."},"azur":{"desc":"Мягкий голубой головной убор с тонкими перьями ниспадает набок. Белая пушистая шерсть обрамляет фактурный джемпер, а рыжеватый ошейник даёт тёплый акцент у горловины.","detail":"Свободный короткий рукав, округлая линия плеч и мелкий рельеф голубого полотна. В портрете сохранились холодные филёнки салона и тёплый паркет."}};
 const readCatalog=()=>{const v=read('catalog',seed);if(!Array.isArray(v))return seed;return v.map(p=>{const old=previousCopy[p.id],latest=seed.find(x=>x.id===p.id);if(!old||!latest)return p;return {...p,desc:p.desc===old.desc?latest.desc:p.desc,detail:p.detail===old.detail?latest.detail:p.detail,styling:p.styling??latest.styling}})};
 const status=['Новый','В работе','Готов','Завершён'];
 const delivery={pickup:{name:'Самовывоз',fee:0},courier:{name:'Курьерская доставка',fee:490}};
 const orders=()=>read('orders',[]);
 const orderRows=bag=>Object.entries(bag).map(([key,n])=>{const [id,size]=key.split('.'),p=looks.find(x=>x.id===id);return p&&['S','M'].includes(size)&&Number.isInteger(n)&&n>0?{id,size,n,name:p.name,price:p.price}:null}).filter(Boolean);
 function checkout(bag,method,payment){
  const rows=orderRows(bag);
  if(!rows.length||!Object.hasOwn(delivery,method)||!['mini','test-ok','test-fail'].includes(payment))return {error:'Проверьте корзину и способ получения.'};
  if(payment==='test-fail')return {error:'Тестовый платёж отклонён. Заказ не создан, корзина сохранена.'};
  const existing=orders(), subtotal=rows.reduce((n,r)=>n+r.n*r.price,0);
  const order={id:'DEMO-'+String(existing.length+1).padStart(3,'0'),time:new Date().toISOString(),rows,method:delivery[method].name,payment:payment==='mini'?'Без оплаты':'Тестовая оплата подтверждена',fee:delivery[method].fee,subtotal,total:subtotal+delivery[method].fee,status:status[0]};
  order.log=[{channel:'Письмо о заказе',body:order.id+' · '+order.method+' · '+order.total+' ₽. '+rows.map(r=>r.name+' × '+r.n).join(', ')}];
  if(payment==='test-ok')order.log.push({channel:'Telegram',body:'Новый тестовый заказ '+order.id+' · '+order.payment+' · '+order.total+' ₽. Проверьте сборку в кабинете.'});
  return write('orders',[...existing,order])?{order}:{error:'Браузер не сохранил заказ. Корзина не очищена.'};
 }
 const nextStatus=current=>{const i=status.indexOf(current);return i>=0?status[i+1]:undefined};
 const canCancel=o=>Boolean(o&&status.includes(o.status)&&o.status!=='Завершён');
 const advance=(id,next)=>{const list=orders(),idx=list.findIndex(o=>o.id===id);if(idx<0||!next||nextStatus(list[idx].status)!==next)return false;list[idx]={...list[idx],status:next};return write('orders',list)};
 function cancel(id){
  const list=orders(),idx=list.findIndex(o=>o.id===id),o=list[idx];
  if(!canCancel(o))return false;
  list[idx]={...o,status:'Отменён',cancelledAt:new Date().toISOString(),log:[...o.log,{channel:'Отмена заказа',body:o.id+' · Заказ отменён. Списаний и возвратов в демо нет.'}]};
  return write('orders',list);
 }
 const saleDays=[
  {day:1,plan:55000,revenue:58000,orders:4,units:5,traffic:38},{day:2,plan:55000,revenue:57000,orders:4,units:5,traffic:40},
  {day:3,plan:55000,revenue:40000,orders:3,units:4,traffic:40},{day:4,plan:55000,revenue:34000,orders:2,units:2,traffic:42},
  {day:5,plan:55000,revenue:44000,orders:3,units:4,traffic:41},{day:6,plan:55000,revenue:49000,orders:3,units:4,traffic:43},
  {day:7,plan:55000,revenue:59000,orders:4,units:6,traffic:42},{day:8,plan:55000,revenue:63000,orders:4,units:5,traffic:44},
  {day:9,plan:55000,revenue:62000,orders:4,units:6,traffic:45},{day:10,plan:55000,revenue:68000,orders:5,units:6,traffic:46}
 ];
 const total=days=>days.reduce((a,x)=>{for(const k of ['plan','revenue','orders','units','traffic'])a[k]+=x[k];return a},{plan:0,revenue:0,orders:0,units:0,traffic:0});
 const stats=days=>{const x=total(days);return {...x,gap:x.revenue-x.plan,check:x.orders?x.revenue/x.orders:0,conversion:x.traffic?x.orders/x.traffic:0}};
 const firstGap=days=>days.find((_,i)=>stats(days.slice(0,i+1)).gap<0)?.day;
 const actions={staff:{name:'Усилить смену в часы пик',why:'На третий день трафик не упал, а покупок стало меньше. По часам можно проверить, где нужна помощь.'},clients:{name:'Вернуть покупателей, давно не совершавших покупок',why:'В демобазе есть клиенты без недавних визитов. Это отдельная мера, а не доказанная причина отставания.'},stock:{name:'Проверить наличие ходового размера',why:'В отчёте по спросу и остаткам у одного из образов остаток S ниже спроса. Наличие можно уточнить до пополнения.'}};
 const stock=[
  ['Minuit','Кейп','S','Чёрный и серебро','Зима',8,2],['Minuit','Кейп','M','Чёрный и серебро','Зима',3,5],
  ['Ambre','Пелерина','S','Чёрный и охра','Зима',5,4],['Béret safran','Трикотаж','S','Шафран','Зима',7,5],
  ['Brume bleue','Трикотаж','M','Голубой','Зима',6,7],['Brume bleue','Трикотаж','S','Голубой','Демисезон',3,3]
 ];
 const clients=[
  {name:'Клиент А01',segment:'Постоянные',purchases:[['03.11','Minuit',18400],['08.11','Brume bleue',15800]],preference:'Чёрный и голубой, размер S',note:'Пригласить на показ вечерних образов.'},
  {name:'Клиент А02',segment:'Давно не покупали',purchases:[['14.09','Ambre',17200]],preference:'Тёплая палитра, размер M',note:'Подобрать два образа в тёплых оттенках.'},
  {name:'Клиент А03',segment:'Новые',purchases:[['09.11','Béret safran',14200]],preference:'Аксессуары, шафран',note:'Показать новые головные уборы.'}
 ];
 const team=[
  {name:'Консультант 01',role:'Продавец',shifts:'1, 2, 4, 6, 8',weight:6,revenue:265000,base:42000},
  {name:'Консультант 02',role:'Продавец',shifts:'2, 3, 5, 7, 9, 10',weight:7,revenue:269000,base:42000},
  {name:'Управляющий 01',role:'Управляющий',shifts:'1–10',weight:0,revenue:0,base:60000}
 ];
 function payroll(){
  const s=stats(saleDays),weight=team.reduce((sum,e)=>sum+e.weight,0);
  return team.map(e=>{const manager=e.role==='Управляющий',plan=manager?s.plan:Math.round(s.plan*e.weight/weight),sales=manager?s.revenue:e.revenue;
   const rate=manager?(sales>=plan?.025:.012):(sales>=plan?.035:.02), bonus=Math.round(sales*rate);
   return {...e,plan,sales,rate,bonus,pay:e.base+bonus,contribution:manager?null:sales/s.revenue};
  });
 }
 return {read,write,seed,readCatalog,status,delivery,orders,orderRows,checkout,advance,nextStatus,canCancel,cancel,saleDays,stats,firstGap,actions,stock,clients,team,payroll};
})();
looks.splice(0,looks.length,...DemoModel.readCatalog());
