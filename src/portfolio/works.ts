export function initWorks() {
  const filters = document.querySelector<HTMLElement>('[data-work-filters]');
  if (!filters) return;
  const buttons = [...filters.querySelectorAll<HTMLButtonElement>('[data-filter]')];
  const projects = [...document.querySelectorAll<HTMLElement>('[data-project-category]')];
  const apply = (value:string) => {
    buttons.forEach((button)=>{ const on=button.dataset.filter===value; button.setAttribute('aria-pressed',String(on)); button.classList.toggle('is-active',on); });
    projects.forEach((project)=>{ const show=value==='Все'||project.dataset.projectCategory===value; project.hidden=!show; });
  };
  buttons.forEach((button)=>button.addEventListener('click',()=>apply(button.dataset.filter||'Все')));
  if (buttons[0]) apply(buttons[0].dataset.filter||'Все');
}
