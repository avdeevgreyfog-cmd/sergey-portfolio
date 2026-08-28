from pathlib import Path
import base64, re, sys
from playwright.sync_api import sync_playwright, expect

ROOT = Path(__file__).resolve().parents[1]
CSS = (ROOT / 'dist/styles.css').read_text(encoding='utf-8')
DATA = (ROOT / '.build/data.js').read_text(encoding='utf-8').replace('export const ', 'const ')
APP = (ROOT / '.build/app.js').read_text(encoding='utf-8')
APP = re.sub(r"^import \{[^\n]+\n", '', APP, count=1)
BUNDLE = DATA + '\n' + APP
# Chromium in this environment blocks external navigation/resources. Replace only media URLs
# during QA rendering; application code and DOM behavior stay unchanged.
svg = '<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000"><rect width="1600" height="1000" fill="#d3cec4"/></svg>'
placeholder = 'data:image/svg+xml;base64,' + base64.b64encode(svg.encode()).decode()
BUNDLE = re.sub(r"https://[^'\"]+\.(?:webp|jpg)(?:\?[^'\"]*)?", placeholder, BUNDLE)
BUNDLE = re.sub(r"https://[^'\"]+\.mp4", 'data:video/mp4;base64,', BUNDLE)


def set_route(page, route: str):
    html = f'''<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>{CSS}</style></head><body><div id="app"></div><script>window.__PORTFOLIO_TEST_PATH__={route!r}; Element.prototype.scrollIntoView=function(){{}};</script><script>{BUNDLE}</script></body></html>'''
    page.set_content(html, wait_until='domcontentloaded')


def assert_no_overflow(page):
    assert page.evaluate('document.documentElement.scrollWidth') == page.evaluate('document.documentElement.clientWidth')


def main():
    checks = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox', '--disable-gpu'])

        # Shell: menu and link integrity.
        page = browser.new_page(viewport={'width': 390, 'height': 844})
        set_route(page, '/')
        assert_no_overflow(page)
        page.locator('[data-menu-toggle]').click()
        expect(page.locator('[data-shell-nav]')).to_have_class(re.compile('is-open'))
        assert page.locator('a[href="/works/"]').count() >= 1
        checks.append('shell/mobile navigation'); print('PASS shell', flush=True)
        page.close()

        # Raznye Ludi: interaction + validation + success + viewport control.
        page = browser.new_page(viewport={'width': 1440, 'height': 900})
        set_route(page, '/demo/raznye-ludi/')
        page.locator('[data-loadout-step="2"]').click()
        expect(page.locator('[data-rz-hud]')).to_contain_text('Рация')
        page.locator('[data-demo-form]').evaluate('(f)=>f.requestSubmit()')
        expect(page.locator('[data-form-message]')).to_contain_text('Заполните')
        page.locator('input[name="name"]').fill('Тест')
        page.locator('input[name="contact"]').fill('@demo')
        page.locator('[data-demo-form]').evaluate('(f)=>f.requestSubmit()')
        expect(page.locator('[data-form-message]')).to_contain_text('обработана локально', timeout=2000)
        page.locator('[data-viewport="mobile"]').click()
        expect(page.locator('[data-demo-stage]')).to_have_class(re.compile('viewport-mobile'))
        assert page.locator('.demo-exit').get_attribute('href') == '/work/raznye-ludi/'
        checks.append('raznye/form + interaction + demo toolbar'); print('PASS raznye', flush=True)
        page.close()

        # B2B: estimator, invalid, error and success states.
        page = browser.new_page(viewport={'width': 834, 'height': 1112})
        set_route(page, '/demo/b2b-engineering/')
        initial = page.locator('[data-b2b-estimate]').inner_text()
        page.locator('input[name="area"]').fill('2000')
        page.locator('select[name="object"]').select_option('plant')
        page.locator('select[name="scope"]').select_option('design')
        changed = page.locator('[data-b2b-estimate]').inner_text()
        assert changed != initial and '400' in changed and '000' in changed
        page.locator('[data-b2b-form]').evaluate('(f)=>f.requestSubmit()')
        expect(page.locator('[data-form-message]')).to_contain_text('обязательные')
        page.locator('input[name="name"]').fill('Тест')
        page.locator('input[name="email"]').fill('error@test.ru')
        page.locator('[data-b2b-form]').evaluate('(f)=>f.requestSubmit()')
        expect(page.locator('[data-form-message]')).to_contain_text('Demo error-state', timeout=2000)
        page.locator('input[name="email"]').fill('demo@test.ru')
        page.locator('[data-b2b-form]').evaluate('(f)=>f.requestSubmit()')
        expect(page.locator('[data-form-message]')).to_contain_text('Заявка не отправлялась', timeout=2000)
        assert_no_overflow(page)
        checks.append('b2b/estimate + validation + loading/error/success'); print('PASS b2b', flush=True)
        page.close()

        # E-commerce: search, favorite, PDP, cart quantity, checkout validation/success.
        page = browser.new_page(viewport={'width': 1440, 'height': 900})
        set_route(page, '/demo/design-light-store/')
        page.locator('[data-catalog-search]').fill('Mira')
        assert page.locator('[data-product-card]').count() == 1
        page.locator('[data-favorite]').click()
        expect(page.locator('[data-fav-count]')).to_have_text('1')
        page.locator('[data-product-open]').first.click()
        expect(page.locator('[data-product-modal]')).to_be_visible()
        page.locator('[data-add-cart]').click()
        expect(page.locator('[data-cart-count]')).to_have_text('1')
        page.locator('.product-close').click()
        page.locator('[data-shop-cart]').click()
        page.locator('[data-qty="plus"]').click()
        expect(page.locator('[data-cart-count]')).to_have_text('2')
        page.locator('[data-checkout]').click()
        page.locator('[data-checkout-form]').evaluate('(f)=>f.requestSubmit()')
        expect(page.locator('[data-form-message]')).to_contain_text('Заполните поля')
        for name, value in [('name','Тест'),('email','demo@test.ru'),('city','Москва'),('address','Demo street')]:
            page.locator(f'[data-checkout-form] [name="{name}"]').fill(value)
        page.locator('[data-checkout-form]').evaluate('(f)=>f.requestSubmit()')
        expect(page.locator('.checkout-success')).to_contain_text('Заказ создан локально', timeout=2500)
        expect(page.locator('[data-cart-count]')).to_have_text('0')
        checks.append('ecommerce/search + favorite + PDP + cart + checkout'); print('PASS shop', flush=True)
        page.close()

        # CRM: views, filters, request status state, calculator, mobile menu.
        page = browser.new_page(viewport={'width': 390, 'height': 844})
        set_route(page, '/demo/r-kadry-demo/')
        assert_no_overflow(page)
        page.locator('[data-crm-menu]').click()
        expect(page.locator('.crm-sidebar')).to_have_class(re.compile('is-open'))
        page.locator('[data-crm-nav="requests"]').first.click()
        page.locator('[data-crm-filter]').fill('Пром')
        assert page.locator('[data-request-open]').count() == 1
        page.locator('[data-request-open]').click()
        page.locator('[data-request-status]').select_option(label='Отказ')
        page.locator('.crm-back').click()
        page.locator('[data-status-filter]').select_option(label='Отказ')
        expect(page.locator('[data-crm-table-host]')).to_contain_text('Пром Лайн')
        page.locator('[data-crm-menu]').click()
        page.locator('.crm-sidebar [data-crm-nav="calculator"]').click()
        before = page.locator('[data-calc-result] > strong').inner_text()
        page.locator('[data-crm-calc] input[name="wage"]').fill('500')
        after = page.locator('[data-calc-result] > strong').inner_text()
        assert before != after
        assert_no_overflow(page)
        checks.append('crm/navigation + filters + persisted status + calculator'); print('PASS crm', flush=True)
        page.close()

        # Lab: every mechanism has a real state change.
        page = browser.new_page(viewport={'width': 834, 'height': 1112})
        set_route(page, '/lab/')
        page.locator('[data-video-range]').fill('75')
        assert page.locator('[data-video-scroll]').evaluate("el=>el.style.getPropertyValue('--progress')") == '75'
        active_before = page.locator('[data-story-stack] > div.active').inner_text()
        page.locator('[data-story-next]').click()
        active_after = page.locator('[data-story-stack] > div.active').inner_text()
        assert active_before != active_after
        page.locator('[data-3d-range]').fill('35')
        assert '35deg' in page.locator('[data-3d-object]').get_attribute('style')
        page.locator('[data-transition-toggle]').click()
        assert page.locator('[data-transition-panels] section.active').count() == 1
        assert_no_overflow(page)
        checks.append('interactive lab/all six stateful mechanisms'); print('PASS lab', flush=True)
        page.close()

        browser.close()

    print('BROWSER QA PASS')
    for check in checks:
        print(' -', check)
    return 0

if __name__ == '__main__':
    sys.exit(main())
