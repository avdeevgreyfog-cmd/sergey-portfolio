export function initContact(){
 const form=document.querySelector<HTMLFormElement>('[data-contact-form]');
 const result=document.querySelector<HTMLElement>('[data-contact-result]');
 const copy=document.querySelector<HTMLButtonElement>('[data-contact-copy]');
 if(!form||!result)return;
 form.addEventListener('submit',e=>{
  e.preventDefault();
  const fields=[...form.querySelectorAll<HTMLInputElement|HTMLTextAreaElement>('input,textarea')];
  fields.forEach(field=>field.setCustomValidity(field.required&&!field.value.trim()?'Заполните это поле.':''));
  if(!form.reportValidity())return;
  const data=new FormData(form);
  const text=[`Имя: ${String(data.get('name')).trim()}`,`Контакт: ${String(data.get('contact')).trim()}`,`Задача: ${String(data.get('message')).trim()}`].join('\n');
  result.dataset.value=text;result.textContent=`Текст подготовлен. Сообщение не отправлено.\n\n${text}`;result.hidden=false;
  if(copy){copy.hidden=false;copy.textContent='Скопировать текст';}
 });
 form.addEventListener('input',e=>{(e.target as HTMLInputElement).setCustomValidity?.('')});
 copy?.addEventListener('click',async()=>{
  try{await navigator.clipboard.writeText(result.dataset.value||'');copy.textContent='Текст скопирован'}
  catch{copy.textContent='Выделите и скопируйте текст выше';const selection=window.getSelection();const range=document.createRange();range.selectNodeContents(result);selection?.removeAllRanges();selection?.addRange(range);}
 });
}
