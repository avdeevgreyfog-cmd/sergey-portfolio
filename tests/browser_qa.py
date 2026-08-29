from pathlib import Path
import contextlib,http.server,re,socketserver,threading,sys
from playwright.sync_api import sync_playwright,expect
ROOT=Path(__file__).resolve().parents[1]; DIST=ROOT/'dist'; BASE='/sergey-portfolio'
class H(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*a): pass
 def translate_path(self,p):
  raw=p.split('?',1)[0]; raw=raw[len(BASE):] if raw.startswith(BASE) else raw; rel=raw.lstrip('/'); t=DIST/rel
  if raw.endswith('/') or t.is_dir(): t=t/'index.html'
  return str(t if t.exists() else DIST/'404.html')
@contextlib.contextmanager
def server():
 with socketserver.ThreadingTCPServer(('127.0.0.1',0),H) as s:
  th=threading.Thread(target=s.serve_forever,daemon=True); th.start()
  try: yield f'http://127.0.0.1:{s.server_address[1]}{BASE}'
  finally: s.shutdown(); th.join(timeout=2)
def guard(page,label):
 faults=[]; page.on('pageerror',lambda e:faults.append(f'{label} JS {e}')); page.on('console',lambda m:faults.append(f'{label} console {m.text}') if m.type=='error' else None)
 page.on('response',lambda r:faults.append(f'{label} HTTP {r.status} {r.url}') if r.status>=400 and 'favicon.ico' not in r.url else None); return faults
def no_overflow(page):
 sw=page.evaluate('document.documentElement.scrollWidth'); cw=page.evaluate('document.documentElement.clientWidth')
 if sw>cw+1:
  bad=page.evaluate("""() => [...document.querySelectorAll('body *')].map((e)=>{const r=e.getBoundingClientRect();return {tag:e.tagName,cls:typeof e.className==='string'?e.className:'',text:(e.textContent||'').trim().replace(/\\s+/g,' ').slice(0,70),left:Math.round(r.left),right:Math.round(r.right),width:Math.round(r.width),display:getComputedStyle(e).display,position:getComputedStyle(e).position}}).filter((x)=>x.width>0&&(x.left < -1 || x.right > innerWidth+1)).sort((a,b)=>Math.max(b.right-innerWidth,-b.left)-Math.max(a.right-innerWidth,-a.left)).slice(0,12)""")
  raise AssertionError(f'overflow {sw}>{cw}; offenders={bad}')
def media_ok(page):
 page.evaluate("() => document.querySelectorAll('img').forEach(i=>i.loading='eager')")
 try: page.wait_for_function("() => [...document.images].every(i=>i.complete)",timeout=8000)
 except Exception: pass
 bad=page.evaluate("() => [...document.images].filter(i=>!i.complete||i.naturalWidth===0).map(i=>i.src)"); assert not bad,bad[:4]
def main():
 checks=[]; faults=[]
 with server() as origin,sync_playwright() as p:
  browser=p.chromium.launch(headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
  page=browser.new_page(viewport={'width':1440,'height':900}); faults+=guard(page,'flow1'); page.goto(origin+'/',wait_until='networkidle'); no_overflow(page); media_ok(page); expect(page.locator('h1')).to_contain_text('Сайты и')
  before=page.locator('[data-live-hero]').evaluate("e=>getComputedStyle(e).getPropertyValue('--hero-p')"); page.evaluate('window.scrollTo(0, innerHeight*.7)'); page.wait_for_timeout(180); after=page.locator('[data-live-hero]').evaluate("e=>e.style.getPropertyValue('--hero-p')"); assert after and after!=before
  page.goto(origin+'/works/',wait_until='networkidle'); expect(page.locator('h1')).to_have_text('Работы'); assert page.locator('[data-project-category]').count()==1; page.locator('a[href$="/work/raznye-ludi/"]').first.click(); page.wait_for_load_state('networkidle'); expect(page.locator('h1')).to_have_text('Разные люди'); media_ok(page); page.locator('a[href$="/demo/raznye-ludi/"]').first.click(); page.wait_for_load_state('networkidle'); expect(page.locator('h1')).to_contain_text('Присоединяйся'); assert page.locator('[data-portfolio-safe-demo]').count()==1; checks.append('Flow 1 home → works → case → autonomous demo')
  page.goto(origin+'/',wait_until='networkidle'); page.locator('a[href$="/effects/"]').first.click(); page.wait_for_load_state('networkidle'); expect(page.locator('h1')).to_have_text('Интерактив'); page.locator('a[href$="/effects/video-scroll/"]').first.click(); page.wait_for_load_state('networkidle'); expect(page.locator('h1')).to_contain_text('Видео'); page.evaluate('window.scrollTo(0, document.body.scrollHeight*.45)'); page.wait_for_timeout(220); assert page.locator('[data-video-progress]').evaluate("e=>e.style.getPropertyValue('--progress')") not in ('','0%'); checks.append('Flow 2 home → effects → live effect')
  page.goto(origin+'/process/',wait_until='networkidle'); expect(page.locator('h1')).to_contain_text('Как'); page.locator('a[href$="/contact/"]').last.click(); page.wait_for_load_state('networkidle'); expect(page.locator('h1')).to_contain_text('Обсудить'); page.locator('input[name=name]').fill('QA'); page.locator('input[name=contact]').fill('@qa'); page.locator('[data-contact-form] button[type=submit]').click(); expect(page.locator('[data-contact-result]')).to_be_visible(); checks.append('Flow 3 process → contact + local-safe inquiry form')
  for route,title in [('/works/','Работы'),('/work/raznye-ludi/','Разные люди'),('/effects/','Интерактив'),('/process/','Как'),('/contact/','Обсудить')]: page.goto(origin+route,wait_until='networkidle'); no_overflow(page); expect(page.locator('h1')).to_contain_text(title)
  checks.append('direct routes'); page.close()
  page=browser.new_page(viewport={'width':390,'height':844}); faults+=guard(page,'mobile'); page.goto(origin+'/',wait_until='networkidle'); no_overflow(page); page.locator('[data-menu-toggle]').click(); expect(page.locator('[data-shell-nav]')).to_have_class(re.compile('is-open')); expect(page.locator('[data-shell-nav] a[href$="/works/"]')).to_be_visible(); page.keyboard.press('Escape'); expect(page.locator('[data-shell-nav]')).not_to_have_class(re.compile('is-open')); checks.append('mobile navigation')
  page.goto(origin+'/effects/scroll-story/',wait_until='networkidle'); no_overflow(page); page.locator('[data-story-step="1"]').scroll_into_view_if_needed(); page.wait_for_timeout(260); assert page.locator('[data-story-stage]').get_attribute('data-scene')=='1'; page.goto(origin+'/effects/kinetic-type/',wait_until='networkidle'); no_overflow(page); before=page.locator('[data-kinetic-field]').get_attribute('style') or ''; page.locator('[data-kinetic-field]').hover(position={'x':300,'y':300}); page.wait_for_timeout(100); after=page.locator('[data-kinetic-field]').get_attribute('style') or ''; assert after!=before; checks.append('scroll story + kinetic type interactions'); page.close()
  page=browser.new_page(viewport={'width':834,'height':1112}); faults+=guard(page,'tablet')
  for route in ['/', '/works/', '/work/raznye-ludi/', '/effects/', '/process/', '/contact/']:
   page.goto(origin+route,wait_until='networkidle'); no_overflow(page)
  checks.append('tablet core routes'); page.close()
  ctx=browser.new_context(viewport={'width':390,'height':844},reduced_motion='reduce'); r=ctx.new_page(); r.goto(origin+'/',wait_until='networkidle'); assert r.locator('[data-reveal]').first.evaluate("e=>getComputedStyle(e).opacity")=='1'; ctx.close(); checks.append('reduced motion fallback'); browser.close()
 if faults: print('BROWSER QA FAIL'); [print('-',f) for f in faults]; return 1
 print('BROWSER QA PASS'); [print(' -',c) for c in checks]; return 0
if __name__=='__main__': sys.exit(main())
