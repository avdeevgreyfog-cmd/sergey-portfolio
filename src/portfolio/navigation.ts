export function initNavigation() {
  const button = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const nav = document.querySelector<HTMLElement>('[data-shell-nav]');
  if (!button || !nav) return;

  const mobile = () => innerWidth <= 800;
  const hideClosedMobileNav = () => {
    if (mobile() && !nav.classList.contains('is-open')) nav.style.display = 'none';
    if (!mobile()) nav.style.removeProperty('display');
  };
  const close = () => {
    nav.classList.remove('is-open');
    button.setAttribute('aria-expanded','false');
    document.body.classList.remove('menu-open');
    if (mobile()) nav.style.display = 'none';
  };
  hideClosedMobileNav();
  addEventListener('resize', hideClosedMobileNav, { passive:true });
  button.addEventListener('click', () => {
    const open = !nav.classList.contains('is-open');
    if (open && mobile()) nav.style.display = 'flex';
    nav.classList.toggle('is-open', open);
    button.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
    if (!open && mobile()) nav.style.display = 'none';
  });
  nav.addEventListener('click', (event) => { if ((event.target as Element).closest('a')) close(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') close(); });
}
