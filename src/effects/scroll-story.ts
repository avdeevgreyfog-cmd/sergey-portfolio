export function initScrollStory() {
  const stage=document.querySelector<HTMLElement>('[data-story-stage]');
  const steps=[...document.querySelectorAll<HTMLElement>('[data-story-step]')];
  if(!stage||!steps.length)return;
  const io=new IntersectionObserver((entries)=>entries.forEach((entry)=>{
    if(entry.isIntersecting){ const index=(entry.target as HTMLElement).dataset.storyStep||'0'; stage.dataset.scene=index; steps.forEach((step)=>step.classList.toggle('is-active',step.dataset.storyStep===index)); }
  }),{threshold:.55});
  steps.forEach((step)=>io.observe(step));
}
