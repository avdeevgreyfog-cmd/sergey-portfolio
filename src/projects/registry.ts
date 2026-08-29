export type ProjectOrigin = 'CLIENT' | 'PERSONAL' | 'CONCEPT' | 'EXPERIMENT';
export type ProjectStatus = 'DRAFT' | 'BETA' | 'SHOWCASE' | 'ARCHIVED';

export type ProjectMedia = {
  kind: 'image' | 'video';
  src: string;
  alt: string;
  role: 'cover' | 'desktop' | 'mobile' | 'detail' | 'motion';
};

export type Project = {
  slug: string;
  title: string;
  type: string;
  category: string;
  origin: ProjectOrigin;
  year: number;
  shortDescription: string;
  cover: string;
  caseMedia: ProjectMedia[];
  services: string[];
  demoRoute: string;
  featured: boolean;
  order: number;
  status: ProjectStatus;
};

const raznyeBase = 'projects/raznye-ludi/assets';

export const projects: Project[] = [
  {
    slug: 'raznye-ludi',
    title: 'Разные люди',
    type: 'Лендинг / интерактивный сайт',
    category: 'Landing / Interactive Website',
    origin: 'PERSONAL',
    year: 2026,
    shortDescription: 'Атмосферный сайт страйкбольной команды: видео, фотографии, последовательный сценарий знакомства и интерактивные детали.',
    cover: `${raznyeBase}/scene_01.webp`,
    caseMedia: [
      { kind: 'video', src: `${raznyeBase}/final_hero.mp4`, alt: 'Видео первого экрана сайта «Разные люди»', role: 'motion' },
      { kind: 'image', src: `${raznyeBase}/scene_01.webp`, alt: 'Команда «Разные люди» в лесу', role: 'desktop' },
      { kind: 'image', src: `${raznyeBase}/scene_04.webp`, alt: 'Фрагмент раздела об играх и выездах', role: 'detail' },
      { kind: 'image', src: `${raznyeBase}/scene_05.webp`, alt: 'Тактический брифинг команды', role: 'detail' },
      { kind: 'image', src: `${raznyeBase}/scene_09.webp`, alt: 'Командный брифинг в лесу', role: 'desktop' },
      { kind: 'image', src: `${raznyeBase}/scene_10.webp`, alt: 'Команда на привале', role: 'desktop' }
    ],
    services: ['Структура сайта', 'Визуальная концепция', 'Адаптивная разработка', 'Motion и интерактив', 'Фото и видео', 'Форма / первый контакт'],
    demoRoute: '/demo/raznye-ludi/',
    featured: true,
    order: 1,
    status: 'SHOWCASE'
  }
];

export const publicProjects = projects
  .filter((project) => project.status === 'SHOWCASE')
  .sort((a, b) => a.order - b.order);

export const featuredProjects = publicProjects.filter((project) => project.featured);
