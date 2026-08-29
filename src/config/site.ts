export type ContactConfig = {
  label: string;
  href: string;
  kind: 'telegram' | 'email' | 'whatsapp' | 'github';
  primary: boolean;
};

export const site = {
  owner: 'Сергей Авдеев',
  title: 'Сергей Авдеев — сайты и веб-приложения под ключ',
  description: 'Разработка сайтов и веб-интерфейсов: от структуры и визуальной концепции до рабочего адаптивного продукта.',
  positioning: 'Сайты и веб-приложения под ключ',
  github: 'https://github.com/avdeevgreyfog-cmd',
  contacts: [
    { label: 'GitHub', href: 'https://github.com/avdeevgreyfog-cmd', kind: 'github', primary: false }
  ] satisfies ContactConfig[]
};

export const capabilities = [
  { title: 'Лендинги', text: 'Промо-страницы, продукты, услуги и мероприятия.' },
  { title: 'Корпоративные сайты', text: 'Услуги, проекты, структура бизнеса, формы и контент.' },
  { title: 'Интернет-магазины', text: 'Каталог, карточки товаров, корзина и checkout.' },
  { title: 'Веб-приложения', text: 'Личные кабинеты, CRM, dashboards и внутренние сервисы.' },
  { title: 'Интерактивные сайты', text: 'Видео, scroll-сценарии, motion, 3D и нестандартная презентация.' }
];

export const effects = [
  { slug: 'video-scroll', title: 'Видео при прокрутке', text: 'Пользователь управляет развитием видеосцены движением страницы.' },
  { slug: 'scroll-story', title: 'Scroll-повествование', text: 'Контент раскрывается как последовательность сцен, а не набор одинаковых блоков.' },
  { slug: 'digital-material', title: 'Цифровой материал', text: 'Интерфейс реагирует на движение и глубину, сохраняя понятную структуру.' },
  { slug: 'type-reveal', title: 'Интерактивная типографика', text: 'Текст становится частью взаимодействия и помогает управлять вниманием.' }
];
