/* ===== ROSSI & GRASSI · main.js ===== */
(function(){
  'use strict';

  /* ---------- INTRO ---------- */
  var intro=document.getElementById('intro'),skip=document.getElementById('intro-skip');
  function closeIntro(){if(intro){intro.classList.add('done');}try{sessionStorage.setItem('rg_seen','1');}catch(e){}}
  var seen=false;try{seen=sessionStorage.getItem('rg_seen')==='1';}catch(e){}
  if(seen&&intro){intro.parentNode.removeChild(intro);}
  else if(intro){setTimeout(closeIntro,2100);if(skip)skip.addEventListener('click',closeIntro);}

  /* ---------- HEADER SCROLL ---------- */
  var header=document.getElementById('site-header');
  function onScroll(){if(header)header.classList.toggle('scrolled',window.scrollY>12);}
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();

  /* ---------- BURGER / NAV ---------- */
  var burger=document.getElementById('burger'),nav=document.querySelector('.nav');
  if(burger&&nav){
    burger.addEventListener('click',function(){
      var open=nav.classList.toggle('open');
      burger.setAttribute('aria-expanded',open?'true':'false');
    });
    nav.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){nav.classList.remove('open');burger.setAttribute('aria-expanded','false');});});
  }

  /* ---------- ORARI DINAMICI ---------- */
  // getDay() 0=Dom..6=Sab. Lun 08:30–14:30 · Mar–Sab 08:30–19:30 · Dom chiuso
  var TABLE={
    0:[],
    1:[[8.5,14.5]],
    2:[[8.5,19.5]],
    3:[[8.5,19.5]],
    4:[[8.5,19.5]],
    5:[[8.5,19.5]],
    6:[[8.5,19.5]]
  };
  var DAYS_IT=['dom','lun','mar','mer','gio','ven','sab'];
  var DAYS_EN=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  function fmt(h){h=h%24;var H=Math.floor(h),M=Math.round((h-H)*60);return H+':'+(M<10?'0'+M:''+M);}
  function nowRome(){var s=new Date().toLocaleString('en-US',{timeZone:'Europe/Rome'});return new Date(s);}
  function computeLive(){
    var d=nowRome(),day=d.getDay(),hour=d.getHours()+d.getMinutes()/60;
    var wins=TABLE[day]||[],openNow=false,closeAt=null;
    for(var i=0;i<wins.length;i++){if(hour>=wins[i][0]&&hour<wins[i][1]){openNow=true;closeAt=wins[i][1];break;}}
    var nextOpen=null,nextDay=null;
    if(!openNow){
      for(var j=0;j<wins.length;j++){if(wins[j][0]>hour){nextOpen=wins[j][0];nextDay=day;break;}}
      if(nextOpen===null){for(var k=1;k<=7;k++){var dd=(day+k)%7,w2=TABLE[dd];if(w2&&w2.length){nextOpen=w2[0][0];nextDay=dd;break;}}}
    }
    return {openNow:openNow,closeAt:closeAt,nextOpen:nextOpen,nextDay:nextDay,day:day};
  }
  function renderLive(){
    var dot=document.getElementById('live-dot'),txt=document.getElementById('live-text');
    if(!dot||!txt)return;
    var L=computeLive(),en=document.documentElement.lang==='en',DAYS=en?DAYS_EN:DAYS_IT;
    dot.className='';
    if(L.openNow){
      dot.classList.add('open');
      txt.textContent=en?('Open now · until '+fmt(L.closeAt)):('Aperto ora · fino alle '+fmt(L.closeAt));
    }else{
      dot.classList.add('closed');
      if(L.nextOpen!==null){
        var sameDay=L.nextDay===L.day;
        var dl=DAYS[L.nextDay];
        if(en)txt.textContent='Closed · opens '+(sameDay?'':dl+' ')+fmt(L.nextOpen);
        else txt.textContent='Chiuso · apre '+(sameDay?'':dl+' ')+fmt(L.nextOpen);
      }else{txt.textContent=en?'Closed':'Chiuso';}
    }
  }

  /* ---------- I18N ---------- */
  var EN={
    'intro.skip':'Enter →',
    'brand.sub':'Delicatessen · since 1971',
    'nav.storia':'Since 1971','nav.banco':'At the counter','nav.sumisura':'Made to order','nav.dove':'Find us',
    'cta.call':'Call',
    'hero.eyebrow':'Via Solferino · Brera · since 1971',
    'hero.tag':'Delicatessen &amp; Salumeria',
    'hero.sub':'Since <b>1971</b>, the delicatessen of Brera. Cured meats from every region, Italian and foreign cheeses, <b>fresh pasta made by hand every day</b> and ready dishes from our own recipes. <em>Quality has a price — and it’s worth it.</em>',
    'hero.cta1':'Take a walk to the counter','hero.cta2':'Call us',
    'hero.live':'Checking hours…','hero.f2':'★ 4.0 · since 1971 · 45+ years','hero.ticket':'since',
    'storia.kicker':'Since 1971',
    'storia.h2':'The delicatessen<br>of Brera.',
    'storia.p1':'Rossi & Grassi opened in <b>1971</b>, in the heart of Brera. The same craft for over <b>forty years</b>: choosing the finest cured meats and cheeses, cooking ready dishes every day from our own recipes, rolling fresh pasta by hand.',
    'storia.p2':'A <b>salumeria</b> born in the shadow of the Pinacoteca, become over the years the neighbourhood’s <em>trusted delicatessen</em> — with a second shop on Via Ponte Vetero.',
    'storia.s1':'in the heart of Brera','storia.s2b':'2 shops','storia.s2':'Solferino & Ponte Vetero','storia.s3b':'Every day','storia.s3':'ready dishes & fresh pasta',
    'banco.kicker':'At the counter','banco.h2':'A walk along the counter',
    'banco.sub':'Five departments, one beside the other. Take a number and let us guide you.',
    'rep.1h':'The cured meats','rep.1p':'From every region of Italy: prosciutti, culatelli, mortadella and salami chosen one by one. Sliced to order, the way it should be.',
    'rep.2h':'The cheeses','rep.2p':'Italian and foreign, from selected producers: fresh, aged, blue. «An incredible variety», the customers say — and we’ll vacuum-seal them for the journey.',
    'rep.3h':'The gastronomy','rep.3p':'Every day a rich counter of ready dishes from our own recipes: first courses, mains, vegetables and sides. Home cooking, without the cooking.',
    'rep.4h':'The fresh pasta','rep.4p':'Rolled by hand every day with genuine ingredients and chosen suppliers: ravioli, tortelli, tagliatelle. The department that tastes of Sunday.',
    'rep.5h':'The desserts','rep.5p':'Traditional cakes, spoon desserts and a wide choice of sweets to finish in style — or to bring to the table at a friend’s.',
    'sumisura.kicker':'Made to order','sumisura.h2':'From a hundred grams<br>to a big event.',
    'sumisura.p':'A hundred grams of prosciutto for the lunch-break sandwich, or a buffet for a hundred people: we do both. <b>Catering</b> for business lunches, celebrations and events, <b>take-away</b> and <b>home delivery</b>. Tell us what you need — we’ll take care of the rest.',
    'sumisura.cta':'Call us about catering',
    'gallery.kicker':'In the shop','gallery.h2':'A look at the counter',
    'rev.kicker':'Voices','rev.h2':'“The quality is worth it”',
    'dove.kicker':'Find us','dove.h2':'Two shops,<br>in the heart of Brera.',
    'dove.addr':'Historic shop','dove.addr2':'— Brera','dove.addr3':'Second location','dove.hours':'Hours','dove.hoursv':'Tue–Sat 08:30–19:30 · Mon 08:30–14:30 · Sun closed',
    'dove.phone':'Phone','dove.call':'Call us','dove.route':'Get directions',
    'faq.h2':'Frequently asked questions',
    'faq.q1':'Where is Rossi & Grassi?','faq.a1':'On Via Solferino 12, in the heart of Brera in Milan. There is also a second location on Via Ponte Vetero 4. The delicatessen has been open since 1971.',
    'faq.q2':'What do you sell?','faq.a2':'Cured meats from every Italian region, Italian and foreign cheeses, fresh pasta made by hand every day, ready dishes from the deli, cakes and desserts. We also do catering.',
    'faq.q3':'Do you do ready dishes to take away?','faq.a3':'Yes: every day we prepare a rich menu of ready dishes from our own recipes, to enjoy at home. We do take-away and home delivery.',
    'faq.q4':'When are you open?','faq.a4':'Tuesday to Saturday 08:30–19:30 continuously, Monday 08:30–14:30. Closed Sunday.',
    'foot.sub':'Delicatessen & Salumeria · Brera · since 1971',
    'foot.where':'Where','foot.hours':'Hours','foot.hours2':'Tue–Sat 08:30–19:30','foot.hours3':'Mon 08:30–14:30 · Sun closed','foot.contact':'Contact',
    'foot.disclaimer':'Demonstration site. Content and photos gathered from public sources (Google Maps); hours, products and details are indicative, to be confirmed with the shop.',
    'ab.call':'Call','ab.banco':'At the counter','ab.route':'Directions'
  };
  var IT={};
  function snapshotIT(){document.querySelectorAll('[data-i18n]').forEach(function(el){IT[el.getAttribute('data-i18n')]=el.innerHTML;});}
  function applyLang(lang){
    var dict=lang==='en'?EN:IT;
    document.querySelectorAll('[data-i18n]').forEach(function(el){
      var k=el.getAttribute('data-i18n');
      if(dict[k]!==undefined)el.innerHTML=dict[k];
      else if(IT[k]!==undefined)el.innerHTML=IT[k];
    });
    document.documentElement.lang=lang;
    document.querySelectorAll('.lang button').forEach(function(b){b.classList.toggle('active',b.getAttribute('data-lang')===lang);});
    try{sessionStorage.setItem('rg_lang',lang);}catch(e){}
    renderLive();
  }
  snapshotIT();
  document.querySelectorAll('.lang button').forEach(function(b){b.addEventListener('click',function(){applyLang(b.getAttribute('data-lang'));});});
  var savedLang='it';try{savedLang=sessionStorage.getItem('rg_lang')||'it';}catch(e){}
  if(savedLang==='en')applyLang('en');else renderLive();

  /* ---------- REVEAL ---------- */
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);}});
  },{threshold:0.12,rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});

  /* ---------- LIGHTBOX ---------- */
  var lb=document.getElementById('lightbox'),lbImg=document.getElementById('lb-img'),lbClose=document.getElementById('lb-close');
  document.querySelectorAll('.g-item').forEach(function(fig){
    fig.addEventListener('click',function(){
      var full=fig.getAttribute('data-full');if(!full)return;
      lbImg.src=full;var im=fig.querySelector('img');lbImg.alt=im?im.alt:'';
      lb.classList.add('open');lb.setAttribute('aria-hidden','false');
    });
  });
  function closeLb(){lb.classList.remove('open');lb.setAttribute('aria-hidden','true');setTimeout(function(){lbImg.src='';},300);}
  if(lbClose)lbClose.addEventListener('click',closeLb);
  if(lb)lb.addEventListener('click',function(e){if(e.target===lb)closeLb();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&lb.classList.contains('open'))closeLb();});

  /* ---------- LIVE tick ---------- */
  setInterval(renderLive,60000);
})();
