export const projects = [
    {
        title: 'Разные люди',
        slug: 'raznye-ludi',
        type: 'Landing / Brand / Motion / Interactive',
        origin: 'PERSONAL',
        status: 'SHOWCASE',
        summary: 'Атмосферный сайт страйкбольной команды с видео-hero, фотографией, насыщенной типографикой и интерактивным повествованием.',
        cover: 'https://raw.githubusercontent.com/avdeevgreyfog-cmd/raznye-ludi-site/main/assets/scene_01.webp',
        media: [
            'https://raw.githubusercontent.com/avdeevgreyfog-cmd/raznye-ludi-site/main/assets/scene_01.webp',
            'https://raw.githubusercontent.com/avdeevgreyfog-cmd/raznye-ludi-site/main/assets/scene_04.webp',
            'https://raw.githubusercontent.com/avdeevgreyfog-cmd/raznye-ludi-site/main/assets/scene_06.webp'
        ],
        features: ['Video hero', 'Scroll storytelling', 'Responsive composition', 'Lead flow', 'Photo-driven art direction'],
        technologies: ['Semantic HTML', 'CSS architecture', 'Vanilla JavaScript', 'Responsive media'],
        demo: { kind: 'internal', route: '/demo/raznye-ludi/' },
        featured: true,
        year: 2026,
        order: 1,
        challenge: 'Показать характер команды и её атмосферу без перегруза декоративными эффектами, сохранив понятный путь для нового участника.',
        implementation: 'В showcase-версии сохранён визуальный DNA реального проекта: тёмная кинематографичная подача, крупная типографика, фото и видео, но демонстрационный сценарий сокращён до ключевых блоков.',
        accent: '#c9a55d'
    },
    {
        title: 'VECTOR Engineering',
        slug: 'b2b-engineering',
        type: 'Corporate / B2B / Conversion',
        origin: 'CONCEPT',
        status: 'SHOWCASE',
        summary: 'Демонстрационный корпоративный сайт инженерной компании: услуги, объекты, компетенции, этапы работы и интерактивный бриф.',
        cover: 'https://images.unsplash.com/photo-1776279876113-514976038186?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=72&w=2200',
        media: [],
        features: ['Information architecture', 'Service pages', 'Project cases', 'Interactive brief', 'SEO-ready content structure'],
        technologies: ['TypeScript', 'Data-driven sections', 'Form state machine', 'Responsive layout'],
        demo: { kind: 'internal', route: '/demo/b2b-engineering/' },
        featured: true,
        year: 2026,
        order: 2,
        challenge: 'Показать не лендинг, а цельный коммерческий B2B-сайт, где визуальная строгость не мешает конверсии и сложная услуга объясняется простыми блоками.',
        implementation: 'Собран демонстрационный сайт вымышленной инженерной компании. Все цифры и объекты в демо прямо маркированы как демонстрационные; форма имеет validation/loading/success/error состояния.',
        accent: '#ea5a2a'
    },
    {
        title: 'LUMA Objects',
        slug: 'design-light-store',
        type: 'E-commerce / Editorial / Product',
        origin: 'CONCEPT',
        status: 'SHOWCASE',
        summary: 'Концепт интернет-магазина дизайнерского света с каталогом, поиском, фильтрами, вариантами товара, избранным, корзиной и checkout.',
        cover: 'https://images.unsplash.com/photo-1756474215990-a18a9a0521d5?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=72&w=2200',
        media: [
            'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=72&w=1800',
            'https://images.unsplash.com/photo-1578678809569-1a8ead9cb802?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=72&w=1800',
            'https://images.unsplash.com/photo-1735838997528-ede45869233a?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=72&w=1800'
        ],
        features: ['Catalog filters', 'Search and sorting', 'Product variants', 'Favorites and cart', 'Demo checkout', 'Interactive light scene'],
        technologies: ['TypeScript state store', 'Lazy media', 'CSS transforms', 'Accessible dialogs'],
        demo: { kind: 'internal', route: '/demo/design-light-store/' },
        featured: true,
        year: 2026,
        order: 3,
        challenge: 'Показать настоящий commerce flow, а не витрину карточек: от поиска товара до варианта, корзины и успешного демонстрационного заказа.',
        implementation: 'Каталог работает на seeded demo-data. Корзина и избранное сохраняются в рамках сессии, checkout ничего не оплачивает и завершает сценарий demo-success state.',
        accent: '#1d1d1a'
    },
    {
        title: 'Р-Кадры Demo',
        slug: 'r-kadry-demo',
        type: 'CRM / Web App / Operations',
        origin: 'PERSONAL',
        status: 'SHOWCASE',
        summary: 'Showcase-версия рабочей CRM: dashboard, клиенты, заявки, статусы и экономический расчёт на безопасном demo dataset.',
        cover: 'generated://crm',
        media: [],
        features: ['Dashboard', 'Clients', 'Requests', 'Status workflow', 'Cost calculator', 'Filtering and state updates'],
        technologies: ['TypeScript', 'Stateful UI', 'Tables and forms', 'Responsive application shell'],
        demo: { kind: 'internal', route: '/demo/r-kadry-demo/' },
        featured: true,
        year: 2026,
        order: 4,
        challenge: 'Сжать крупную операционную систему до короткого, но честного showcase-сценария, где видна логика бизнес-приложения и реальные изменения состояния интерфейса.',
        implementation: 'Визуальная система и плотность интерфейса основаны на существующем Р-Кадры OS. Демо использует обезличенный набор данных и интерактивные действия: фильтры, статусы, карточка заявки и расчёт.',
        accent: '#246bfe'
    }
];
export const publicProjects = projects
    .filter((project) => project.status !== 'DRAFT')
    .sort((a, b) => a.order - b.order);
export const capabilities = [
    'Лендинги', 'Корпоративные сайты', 'Каталоги', 'Интернет-магазины', 'CRM', 'Личные кабинеты', 'Веб-приложения', 'Калькуляторы', 'Интерактивные интерфейсы', 'Интеграции и автоматизация'
];
