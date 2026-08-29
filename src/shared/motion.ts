export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function observeReveals(root: ParentNode = document) {
  const nodes = [...root.querySelectorAll<HTMLElement>('[data-reveal]')];
  if (reducedMotion()) { nodes.forEach((node)=>node.classList.add('is-visible')); return; }
  const io = new IntersectionObserver((entries)=>entries.forEach((entry)=>{
    if (entry.isIntersecting) { (entry.target as HTMLElement).classList.add('is-visible'); io.unobserve(entry.target); }
  }),{threshold:.12,rootMargin:'0px 0px -6%'});
  nodes.forEach((node)=>io.observe(node));
}
