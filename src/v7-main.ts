const base=(document.querySelector<HTMLMetaElement>('meta[name="app-base"]')?.content||'').replace(/\/$/,'');

const menu=document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
const nav=document.querySelector<HTMLElement>('[data-shell-nav]');
const closeMenu=()=>{nav?.classList.remove('is-open');menu?.setAttribute('aria-expanded','false');document.body.classList.remove('menu-open')};
menu?.addEventListener('click',()=>{const open=!nav?.classList.contains('is-open');nav?.classList.toggle('is-open',open);menu.setAttribute('aria-expanded',String(open));document.body.classList.toggle('menu-open',open)});
document.addEventListener('keydown',(e)=>{if(e.key==='Escape')closeMenu()});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));

const reveal=[...document.querySelectorAll<HTMLElement>('[data-reveal]')];
if('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches){
  const io=new IntersectionObserver((entries)=>entries.forEach((entry)=>{if(entry.isIntersecting){(entry.target as HTMLElement).classList.add('is-visible');io.unobserve(entry.target)}}),{threshold:.08,rootMargin:'0px 0px -5%'});
  reveal.forEach(el=>io.observe(el));
}else reveal.forEach(el=>el.classList.add('is-visible'));

const filters=[...document.querySelectorAll<HTMLButtonElement>('[data-filter]')];
const cards=[...document.querySelectorAll<HTMLElement>('[data-project-category]')];
const empty=document.querySelector<HTMLElement>('[data-work-empty]');
filters.forEach(button=>button.addEventListener('click',()=>{
  const filter=button.dataset.filter||'Все';
  filters.forEach(b=>{const active=b===button;b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active))});
  let visible=0;
  cards.forEach(card=>{const show=filter==='Все'||card.dataset.projectCategory===filter;card.hidden=!show;if(show)visible++});
  if(empty) empty.hidden=visible>0;
}));

const form=document.querySelector<HTMLFormElement>('[data-contact-form]');
form?.addEventListener('submit',(event)=>{event.preventDefault();if(!form.reportValidity())return;const result=form.querySelector<HTMLElement>('[data-contact-result]')||document.querySelector<HTMLElement>('[data-contact-result]');if(result)result.hidden=false;});

document.querySelectorAll<HTMLAnchorElement>('a[href^="/"]').forEach(a=>{if(base && !a.href.includes(base)) a.href=`${base}${a.getAttribute('href')}`});
