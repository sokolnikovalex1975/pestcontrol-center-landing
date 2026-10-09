(function(){
  if(window.lucide) lucide.createIcons({attrs:{'stroke-width':1.7}});

  // header + mobile bar
  const hdr=document.getElementById('hdr'), mbar=document.getElementById('mbar');
  const onScroll=()=>{
    const y=scrollY;
    hdr.classList.toggle('scrolled',y>30);
    const f=document.getElementById('zayavka').getBoundingClientRect();
    mbar.classList.toggle('show',y>innerHeight*.6 && f.top>innerHeight*.5);
    // timeline progress
    const tl=document.getElementById('tl'), p=document.getElementById('tlprog');
    if(tl){const r=tl.getBoundingClientRect();const v=Math.min(1,Math.max(0,(innerHeight*.6-r.top)/r.height));p.style.height=(v*100)+'%';}
  };
  addEventListener('scroll',onScroll,{passive:true});onScroll();

  // burger
  const b=document.getElementById('burger');
  b.addEventListener('click',()=>{const o=document.body.classList.toggle('menu-open');b.setAttribute('aria-expanded',o);});
  document.querySelectorAll('.mmenu a').forEach((a,i)=>{a.style.transitionDelay=(i*.04)+'s';a.addEventListener('click',()=>{document.body.classList.remove('menu-open');b.setAttribute('aria-expanded',false);});});

  // reveal
  const io=new IntersectionObserver(es=>es.forEach(e=>{
    if(!e.isIntersecting) return;
    const el=e.target; el.classList.add('in');
    el.querySelectorAll('.bar-f').forEach(f=>f.style.width=f.dataset.w+'%');
    el.querySelectorAll('[data-count]').forEach(countUp);
    if(el.matches('[data-count]')) countUp(el);
    io.unobserve(el);
  }),{threshold:.18,rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.rv,.tl-row').forEach(el=>io.observe(el));

  function countUp(el){
    if(el.dataset.done) return; el.dataset.done=1;
    const to=+el.dataset.count, suf=el.dataset.suf||''; if(!to){el.textContent='0'+suf;return;}
    const t0=performance.now(), d=1400;
    (function tick(t){const k=Math.min(1,(t-t0)/d), e=1-Math.pow(1-k,3);el.textContent=Math.round(to*e)+suf; if(k<1) requestAnimationFrame(tick);})(t0);
  }

  // IPM cycle: auto-advance + hover sync
  const steps=[...document.querySelectorAll('.step')], nodes=[...document.querySelectorAll('.node')];
  let cur=0, timer;
  const setOn=i=>{cur=i;steps.forEach((s,j)=>s.classList.toggle('on',j===i));nodes.forEach((n,j)=>n.classList.toggle('on',j===i));};
  const run=()=>{clearInterval(timer);timer=setInterval(()=>setOn((cur+1)%4),2600);};
  setOn(0);run();
  steps.forEach((s,i)=>{s.addEventListener('mouseenter',()=>{clearInterval(timer);setOn(i);});s.addEventListener('mouseleave',run);});

  // doc cards spotlight
  document.querySelectorAll('.doc').forEach(c=>c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect();c.style.setProperty('--mx',(e.clientX-r.left)+'px');c.style.setProperty('--my',(e.clientY-r.top)+'px');}));

  // FAQ
  document.querySelectorAll('.qa button').forEach(btn=>btn.addEventListener('click',()=>{
    const qa=btn.parentElement, open=!qa.classList.contains('open');
    qa.classList.toggle('open',open); btn.setAttribute('aria-expanded',open);
  }));
  const first=document.querySelector('.qa'); if(first){first.classList.add('open');first.querySelector('button').setAttribute('aria-expanded',true);}

  // nav active
  const links=[...document.querySelectorAll('.nav a')];
  const so=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){links.forEach(l=>l.classList.toggle('active',l.getAttribute('href')==='#'+e.target.id));}}),{rootMargin:'-45% 0px -50% 0px'});
  links.forEach(l=>{const s=document.querySelector(l.getAttribute('href'));if(s) so.observe(s);});

  // phone mask
  const ph=document.getElementById('phone');
  ph.addEventListener('input',()=>{
    let d=ph.value.replace(/\D/g,''); if(d[0]==='8') d='7'+d.slice(1); if(d[0]!=='7') d='7'+d; d=d.slice(0,11);
    const p=d.slice(1); let s='+7';
    if(p.length) s+=' ('+p.slice(0,3); if(p.length>=3) s+=')'; if(p.length>3) s+=' '+p.slice(3,6); if(p.length>6) s+='-'+p.slice(6,8); if(p.length>8) s+='-'+p.slice(8,10);
    ph.value=s;
  });

  // form (demo: no backend yet)
  const form=document.getElementById('form');
  form.addEventListener('submit',e=>{
    e.preventDefault(); let ok=true;
    form.querySelectorAll('[required]').forEach(i=>{
      const bad=i.name==='phone'? i.value.replace(/\D/g,'').length<11 : !i.value.trim();
      i.parentElement.classList.toggle('err',bad); if(bad) ok=false;
    });
    if(ok){form.classList.add('sent');}
  });
})();
