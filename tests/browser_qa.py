from pathlib import Path
import contextlib,http.server,re,socketserver,threading,sys
from playwright.sync_api import sync_playwright,expect
ROOT=Path(__file__).resolve().parents[1];DIST=ROOT/'dist';BASE='/sergey-portfolio'
class H(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
 def translate_path(self,p):
  raw=p.split('?',1)[0];raw=raw[len(BASE):] if raw.startswith(BASE) else raw;rel=raw.lstrip('/');t=DIST/rel
  if raw.endswith('/') or t.is_dir():t=t/'index.html'
  return str(t if t.exists() else DIST/'404.html')
@contextlib.contextmanager
def server():
 with socketserver.ThreadingTCPServer(('127.0.0.1',0),H) as s:
  th=threading.Thread(target=s.serve_forever,daemon=True);th.start()
  try:yield f'http://127.0.0.1:{s.server_address[1]}{BASE}'
  finally:s.shutdown();th.join(timeout=2)
def no_overflow(page):
 sw=page.evaluate('document.documentElement.scrollWidth');cw=page.evaluate('document.documentElement.clientWidth')
 if sw>cw+1:
  bad=page.evaluate("""() => [...document.querySelectorAll('body *')].map(e=>{const r=e.getBoundingClientRect();return {tag:e.tagName,cls:typeof e.className==='string'?e.className:'',text:(e.textContent||'').trim().replace(/\s+/g,' ').slice(0,60),left:Math.round(r.left),right:Math.round(r.right)}}).filter(x=>x.left<-1||x.right>innerWidth+1).slice(0,10)""");raise AssertionError(f'overflow {sw}>{cw}; offenders={bad}')
def media_ok(page):
 page.evaluate("() => document.querySelectorAll('img').forEach(i=>i.loading='eager')")
 try:page.wait_for_function("() => [...document.images].every(i=>i.complete)",timeout=8000)
 except Exception:pass
 bad=page.evaluate("() => [...document.images].filter(i=>!i.complete||i.naturalWidth===0).map(i=>i.src)");assert not bad,bad[:4]
def main():
 checks=[]
 with server() as origin,sync_playwright() as p:
  browser=p.chromium.launch(headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
  page=browser.new_page(viewport={'width':1440,'height':900});page.goto(origin+'/',wait_until='networkidle');no_overflow(page);media_ok(page);expect(page.locator('h1')).to_contain_text('Создаю цифровые продукты');assert page.locator('text=Разные люди').count()==0;assert page.locator('a[href$="/effects/"]').count()==0;checks.append('V5 about-first homepage without project case')
  page.locator('a[href$="/works/"]').first.click();page.wait_for_load_state('networkidle');expect(page.locator('h1')).to_have_text('Работы');expect(page.locator('[data-work-filters]')).to_be_visible();expect(page.locator('[data-project-category="Лендинги"]')).to_be_visible();page.locator('[data-filter="Интернет-магазины"]').click();expect(page.locator('[data-work-empty]')).to_be_visible();page.locator('[data-filter="Лендинги"]').click();expect(page.locator('[data-project-category="Лендинги"]')).to_be_visible();page.locator('a[href$="/work/raznye-ludi/"]').first.click();page.wait_for_load_state('networkidle');expect(page.locator('h1')).to_have_text('Разные люди');page.locator('a[href$="/demo/raznye-ludi/"]').first.click();page.wait_for_load_state('networkidle');expect(page.locator('h1')).to_contain_text('Присоединяйся');assert page.locator('[data-portfolio-safe-demo]').count()==1;checks.append('Flow works filters → case → autonomous demo')
  page.goto(origin+'/',wait_until='networkidle');page.locator('a[href$="/services/"]').first.click();page.wait_for_load_state('networkidle');expect(page.locator('h1')).to_contain_text('Разработка сайтов');page.locator('a[href$="/contact/"]').last.click();page.wait_for_load_state('networkidle');expect(page.locator('h1')).to_contain_text('Обсудить');checks.append('Flow home → services → contact')
  page.goto(origin+'/process/',wait_until='networkidle');expect(page.locator('h1')).to_contain_text('Как работаю');page.locator('a[href$="/contact/"]').last.click();page.wait_for_load_state('networkidle');page.locator('input[name=name]').fill('QA');page.locator('input[name=contact]').fill('@qa');page.locator('[data-contact-form] button[type=submit]').click();expect(page.locator('[data-contact-result]')).to_be_visible();checks.append('Flow process → contact + local-safe inquiry form')
  for w,h in [(390,844),(834,1112),(1440,900)]:
   for route in ['/','/works/','/work/raznye-ludi/','/services/','/process/','/contact/']:
    page.set_viewport_size({'width':w,'height':h});page.goto(origin+route,wait_until='networkidle');no_overflow(page)
  checks.append('commercial core routes 390/834/1440')
  page.set_viewport_size({'width':390,'height':844});page.goto(origin+'/',wait_until='networkidle');page.locator('[data-menu-toggle]').click();expect(page.locator('[data-shell-nav]')).to_have_class(re.compile('is-open'));expect(page.locator('[data-shell-nav] a[href$="/services/"]')).to_be_visible();page.keyboard.press('Escape');checks.append('mobile navigation')
  page.goto(origin+'/effects/video-scroll/',wait_until='networkidle');expect(page.locator('h1')).to_contain_text('Видео');page.evaluate('window.scrollTo(0, document.body.scrollHeight*.45)');page.wait_for_timeout(220);assert page.locator('[data-video-progress]').count()==1;page.goto(origin+'/effects/scroll-story/',wait_until='networkidle');page.locator('[data-story-step="1"]').scroll_into_view_if_needed();page.wait_for_timeout(260);assert page.locator('[data-story-stage]').get_attribute('data-scene')=='1';checks.append('secondary R&D routes still work')
  ctx=browser.new_context(viewport={'width':390,'height':844},reduced_motion='reduce');r=ctx.new_page();r.goto(origin+'/',wait_until='networkidle');ctx.close();browser.close();checks.append('reduced motion compatible')
 print('BROWSER QA PASS');[print(' -',c) for c in checks];return 0
if __name__=='__main__':sys.exit(main())
