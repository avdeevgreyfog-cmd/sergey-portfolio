export function initNavigation() {
 const toggle=document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
 const nav=document.querySelector<HTMLElement>('[data-shell-nav]');
 if(!toggle||!nav)return;
 const editorial=document.body.classList.contains('editorial');
 const mobile=()=>matchMedia(editorial?'(max-width: 700px)':'(max-width: 800px)').matches;
 const setOpen=(open:boolean,returnFocus=false)=>{
  nav.classList.toggle('is-open',open);
  toggle.setAttribute('aria-expanded',String(open));
  toggle.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню');
  document.body.classList.toggle('menu-open',open);
  nav.inert=mobile()&&!open;
  if(!editorial)nav.style.display=mobile()?(open?'flex':'none'):'';
  if(returnFocus)toggle.focus();
 };
 setOpen(false);
 toggle.addEventListener('click',()=>setOpen(toggle.getAttribute('aria-expanded')!=='true'));
 nav.addEventListener('click',e=>{if((e.target as Element).closest('a'))setOpen(false)});
 document.addEventListener('keydown',e=>{
  if(toggle.getAttribute('aria-expanded')!=='true'||!mobile())return;
  if(e.key==='Escape'){setOpen(false,true);return}
  if(e.key==='Tab'){
   const links=[...nav.querySelectorAll<HTMLElement>('a,button')];
   if(e.shiftKey&&document.activeElement===links[0]){e.preventDefault();toggle.focus()}
   else if(!e.shiftKey&&document.activeElement===toggle){e.preventDefault();links[0]?.focus()}
   else if(!e.shiftKey&&document.activeElement===links.at(-1)){e.preventDefault();toggle.focus()}
   else if(e.shiftKey&&document.activeElement===toggle){e.preventDefault();links.at(-1)?.focus()}
  }
 });
 addEventListener('resize',()=>{if(!mobile())setOpen(false);else nav.inert=toggle.getAttribute('aria-expanded')!=='true'},{passive:true});
}
