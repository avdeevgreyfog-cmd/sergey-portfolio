from pathlib import Path
import contextlib, http.server, os, re, socketserver, threading, time, sys
from playwright.sync_api import sync_playwright, expect

ROOT=Path(__file__).resolve().parents[1]
DIST=ROOT/'dist'
BASE='/sergey-portfolio'

class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*args): pass
    def translate_path(self,path):
        raw=path.split('?',1)[0].split('#',1)[0]
        if raw.startswith(BASE): raw=raw[len(BASE):] or '/'
        rel=raw.lstrip('/')
        target=(DIST/rel)
        if raw.endswith('/') or target.is_dir(): target=target/'index.html'
        if target.exists(): return str(target)
        return str(DIST/'404.html')

@contextlib.contextmanager
def server():
    with socketserver.ThreadingTCPServer(('127.0.0.1',0),QuietHandler) as httpd:
        port=httpd.server_address[1]
        thread=threading.Thread(target=httpd.serve_forever,daemon=True); thread.start()
        try: yield f'http://127.0.0.1:{port}{BASE}'
        finally: httpd.shutdown(); thread.join(timeout=2)

def launch(p):
    return p.chromium.launch(headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])

def attach_guards(page, label):
    faults=[]
    page.on('pageerror',lambda exc:faults.append(f'{label} JS: {exc}'))
    page.on('console',lambda msg: faults.append(f'{label} console error: {msg.text}') if msg.type=='error' else None)
    def response(res):
        if res.status>=400 and 'favicon.ico' not in res.url: faults.append(f'{label} HTTP {res.status}: {res.url}')
    page.on('response',response)
    return faults

def no_overflow(page):
    sw=page.evaluate('document.documentElement.scrollWidth'); cw=page.evaluate('document.documentElement.clientWidth')
    assert sw <= cw+1, f'overflow {sw}>{cw}'

def media_ok(page):
    bad=page.evaluate("""() => [...document.images].filter(i => i.getBoundingClientRect().width>0 && (!i.complete || i.naturalWidth===0)).map(i=>i.src)""")
    assert not bad, f'broken images: {bad[:5]}'


def main():
  checks=[]
  with server() as origin, sync_playwright() as p:
    browser=launch(p)
    all_faults=[]

    for width,height in [(390,844),(834,1112),(1440,900),(1920,1080)]:
      page=browser.new_page(viewport={'width':width,'height':height})
      faults=attach_guards(page,f'home-{width}'); all_faults+=faults
      page.goto(origin+'/',wait_until='networkidle')
      no_overflow(page); media_ok(page)
      expect(page.locator('h1')).to_contain_text('Сайты и')
      expect(page.locator('#work')).to_be_visible()
      if width==390:
        page.locator('[data-menu-toggle]').click(); expect(page.locator('[data-shell-nav]')).to_have_class(re.compile('is-open'))
        page.keyboard.press('Escape'); expect(page.locator('[data-shell-nav]')).not_to_have_class(re.compile('is-open'))
      page.close()
    checks.append('homepage responsive 390/834/1440/1920 + menu + media')

    page=browser.new_page(viewport={'width':1440,'height':900}); faults=attach_guards(page,'case'); all_faults+=faults
    page.goto(origin+'/work/raznye-ludi/',wait_until='networkidle'); no_overflow(page); media_ok(page)
    expect(page.locator('h1')).to_have_text('Разные люди')
    demo_href=page.locator('a[href$="/demo/raznye-ludi/"]').first.get_attribute('href'); assert demo_href==BASE+'/demo/raznye-ludi/'
    page.close(); checks.append('case presentation + demo CTA')

    page=browser.new_page(viewport={'width':390,'height':844}); faults=attach_guards(page,'demo'); all_faults+=faults
    page.goto(origin+'/demo/raznye-ludi/',wait_until='networkidle'); no_overflow(page); media_ok(page)
    assert page.locator('.site-header').count()==0 and page.locator('[data-viewport]').count()==0
    expect(page.locator('h1')).to_contain_text('Присоединяйся')
    page.locator('.mobile-menu-btn').click(); expect(page.locator('#mobileMenu')).to_have_class(re.compile('open'))
    assert page.locator('[data-portfolio-safe-demo]').count()==1
    page.close(); checks.append('autonomous Raznye demo + mobile menu + no portfolio chrome')

    page=browser.new_page(viewport={'width':1440,'height':900}); faults=attach_guards(page,'material'); all_faults+=faults
    page.goto(origin+'/effects/digital-material/',wait_until='networkidle'); no_overflow(page)
    obj=page.locator('[data-material-object]'); before=obj.evaluate("e=>getComputedStyle(e).getPropertyValue('--mat-ry')")
    page.locator('[data-material-stage]').hover(position={'x':900,'y':300}); page.wait_for_timeout(100)
    after=obj.evaluate("e=>e.style.getPropertyValue('--mat-ry')"); assert after and after!=before
    page.close(); checks.append('digital material pointer interaction')

    page=browser.new_page(viewport={'width':834,'height':900}); faults=attach_guards(page,'video'); all_faults+=faults
    page.goto(origin+'/effects/video-scroll/',wait_until='networkidle'); no_overflow(page)
    page.evaluate('window.scrollTo(0, document.body.scrollHeight * .45)'); page.wait_for_timeout(250)
    progress=page.locator('[data-video-progress]').evaluate("e=>e.style.getPropertyValue('--progress')"); assert progress not in ('','0%')
    page.close(); checks.append('video scroll progress')

    page=browser.new_page(viewport={'width':834,'height':900}); faults=attach_guards(page,'story'); all_faults+=faults
    page.goto(origin+'/effects/scroll-story/',wait_until='networkidle'); no_overflow(page)
    page.locator('[data-story-step="1"]').scroll_into_view_if_needed(); page.wait_for_timeout(250)
    assert page.locator('[data-story-step="1"]').get_attribute('class').find('is-active')>=0
    page.close(); checks.append('scroll storytelling state')

    page=browser.new_page(viewport={'width':1440,'height':900}); faults=attach_guards(page,'type'); all_faults+=faults
    page.goto(origin+'/effects/type-reveal/',wait_until='networkidle'); no_overflow(page)
    word=page.locator('[data-type-word]').first; initial=word.evaluate("e=>e.style.getPropertyValue('--type-strength')")
    page.locator('[data-type-field]').hover(position={'x':160,'y':300}); page.wait_for_timeout(100)
    changed=word.evaluate("e=>e.style.getPropertyValue('--type-strength')"); assert changed!=initial
    page.close(); checks.append('interactive typography pointer reveal')

    ctx=browser.new_context(viewport={'width':390,'height':844},reduced_motion='reduce'); page=ctx.new_page(); faults=attach_guards(page,'reduced'); all_faults+=faults
    page.goto(origin+'/effects/digital-material/',wait_until='networkidle'); no_overflow(page)
    before=page.locator('[data-material-object]').get_attribute('style'); page.locator('[data-material-stage]').hover(); page.wait_for_timeout(100); after=page.locator('[data-material-object]').get_attribute('style'); assert before==after
    page.close(); ctx.close(); checks.append('prefers-reduced-motion behavior')

    page=browser.new_page(viewport={'width':1440,'height':900}); faults=attach_guards(page,'404'); all_faults+=faults
    page.goto(origin+'/this-route-does-not-exist/',wait_until='networkidle'); expect(page.locator('h1')).to_contain_text('Страница'); page.close(); checks.append('404 deep-route fallback')

    browser.close()
    if all_faults:
      print('BROWSER QA FAIL')
      for f in all_faults: print('-',f)
      return 1
  print('BROWSER QA PASS')
  for c in checks: print(' -',c)
  return 0

if __name__=='__main__': sys.exit(main())
