from pathlib import Path
import contextlib,http.server,socketserver,threading,sys,re
from playwright.sync_api import sync_playwright,expect
ROOT=Path(__file__).resolve().parents[1]; D=ROOT/'dist'; BASE='/sergey-portfolio'
class H(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*a): pass
 def translate_path(self,p):
  raw=p.split('?',1)[0]; raw=raw[len(BASE):] if raw.startswith(BASE) else raw; t=D/raw.lstrip('/')
  if raw.endswith('/') or t.is_dir(): t=t/'index.html'
  return str(t if t.exists() else D/'404.html')
@contextlib.contextmanager
def server():
 with socketserver.ThreadingTCPServer(('127.0.0.1',0),H) as s:
  th=threading.Thread(target=s.serve_forever,daemon=True); th.start()
  try: yield f'http://127.0.0.1:{s.server_address[1]}{BASE}'
  finally: s.shutdown(); th.join(timeout=2)
def no_overflow(page):
 assert page.evaluate('document.documentElement.scrollWidth') <= page.evaluate('document.documentElement.clientWidth')+1
with server() as origin,sync_playwright() as p:
 b=p.chromium.launch(headless=True,args=['--no-sandbox','--disable-dev-shm-usage']); page=b.new_page(viewport={'width':1440,'height':900})
 page.goto(origin+'/',wait_until='domcontentloaded'); expect(page.locator('h1')).to_contain_text('Проектирую'); expect(page.locator('h1')).to_contain_text('Собираю продукт'); expect(page.locator('.homeHero__media')).to_be_visible(); expect(page.locator('.homeServices__cards')).to_be_visible(); assert page.locator('text=Избранная работа').count()==0; no_overflow(page)
 page.goto(origin+'/works/',wait_until='domcontentloaded'); expect(page.locator('[data-work-filters]')).to_be_visible(); page.locator('[data-filter="Системы"]').click(); expect(page.locator('[data-project-category="Системы"]')).to_be_visible(); expect(page.locator('[data-project-category="Сайты"]')).to_be_hidden()
 page.goto(origin+'/contact/',wait_until='domcontentloaded'); page.locator('input[name=name]').fill('QA'); page.locator('input[name=contact]').fill('@qa'); page.locator('button[type=submit]').click(); expect(page.locator('[data-contact-result]')).to_be_visible(); expect(page.locator('[data-email-draft]')).to_have_attribute('href',re.compile(r'^mailto:avdeevgreyfog@gmail.com\?subject='))
 for w,h in [(390,844),(834,1112),(1440,900)]:
  page.set_viewport_size({'width':w,'height':h})
  for r in ['/','/works/','/work/raznye-ludi/','/work/operations-os/','/about/','/contact/']:
   page.goto(origin+r,wait_until='domcontentloaded'); no_overflow(page)
 page.set_viewport_size({'width':390,'height':844}); page.goto(origin+'/',wait_until='domcontentloaded'); page.locator('[data-menu-toggle]').click(); expect(page.locator('[data-shell-nav]')).to_have_class(re.compile('is-open'))
 b.close()
print('V10 BROWSER QA PASS')
