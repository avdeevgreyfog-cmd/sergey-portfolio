export function initNavigation() {
  const button = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const nav = document.querySelector<HTMLElement>('[data-shell-nav]');
  if (!button || !nav) return;
  const close = () => { nav.classList.remove('is-open'); button.setAttribute('aria-expanded','false'); document.body.classList.remove('menu-open'); };
  button.addEventListener('click',()=>{
    const open = !nav.classList.contains('is-open');
    nav.classList.toggle('is-open',open); button.setAttribute('aria-expanded',String(open)); document.body.classList.toggle('menu-open',open);
  });
  nav.addEventListener('click',(event)=>{ if ((event.target as Element).closest('a')) close(); });
  document.addEventListener('keydown',(event)=>{ if (event.key==='Escape') close(); });
}
