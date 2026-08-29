export type ContactConfig = {
  label: string;
  href: string;
  kind: 'telegram' | 'email' | 'whatsapp' | 'github';
  primary: boolean;
};

export const site = {
  owner: 'Сергей Авдеев',
  title: 'Сергей Авдеев — сайты и веб-приложения под ключ',
  description: 'Разработка сайтов и веб-приложений под ключ: структура, визуальная концепция, frontend, интерактив и запуск.',
  positioning: 'Сайты и веб-приложения под ключ',
  github: 'https://github.com/avdeevgreyfog-cmd',
  contacts: [
    { label: 'GitHub — технический профиль', href: 'https://github.com/avdeevgreyfog-cmd', kind: 'github', primary: false }
  ] satisfies ContactConfig[]
};

export const capabilities = [
  { title: 'Лендинги', text: 'Промо-страницы для продукта, услуги, запуска или события.' },
  { title: 'Корпоративные сайты', text: 'Структурные сайты для бизнеса, услуг, проектов и контента.' },
  { title: 'Интернет-магазины', text: 'Каталог, карточки, корзина, checkout и необходимая интеграционная логика.' },
  { title: 'Веб-приложения', text: 'Личные кабинеты, CRM, dashboards и внутренние сервисы.' },
  { title: 'Интерактивные сайты', text: 'Motion, video-scroll, storytelling и нестандартная web-подача.' }
];

export const effects = [
  { slug: 'video-scroll', title: 'Video Scroll', publicTitle: 'Видео при прокрутке', text: 'Прокрутка управляет монтажом видеосцены и помогает вести пользователя по истории.' },
  { slug: 'scroll-story', title: 'Scroll Story', publicTitle: 'Scroll-повествование', text: 'Одна визуальная сцена меняется вместе с содержанием и связывает несколько смысловых этапов.' },
  { slug: 'kinetic-type', title: 'Kinetic Typography', publicTitle: 'Кинетическая типографика', text: 'Крупная типографика реагирует на движение и становится частью визуального сценария.' }
];
