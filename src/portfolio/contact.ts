export function initContact() {
  const form=document.querySelector<HTMLFormElement>('[data-contact-form]');
  const result=document.querySelector<HTMLElement>('[data-contact-result]');
  const copy=document.querySelector<HTMLButtonElement>('[data-contact-copy]');
  if(!form||!result)return;
  form.addEventListener('submit',(event)=>{
    event.preventDefault();
    const data=new FormData(form);
    const text=[`Имя: ${data.get('name')||'—'}`,`Контакт: ${data.get('contact')||'—'}`,`Нужно: ${data.get('type')||'—'}`,`Комментарий: ${data.get('message')||'—'}`].join('\n');
    result.textContent=`Запрос подготовлен. Пока публичный канал для отправки не подключён — можно скопировать текст и связаться через GitHub.\n\n${text}`;
    result.dataset.value=text; result.hidden=false; if(copy) copy.hidden=false;
  });
  copy?.addEventListener('click',async()=>{ const text=result.dataset.value||''; if(!text)return; await navigator.clipboard.writeText(text); copy.textContent='Скопировано'; setTimeout(()=>copy.textContent='Скопировать запрос',1400); });
}
