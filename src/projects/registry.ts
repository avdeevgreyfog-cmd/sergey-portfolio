export type ProjectOrigin = 'CLIENT' | 'PERSONAL' | 'CONCEPT' | 'EXPERIMENT';
export type ProjectStatus = 'DRAFT' | 'BETA' | 'SHOWCASE' | 'ARCHIVED';
export type MediaKind = 'image' | 'video';

export type ProjectMedia = { kind: MediaKind; src: string; alt: string };
export type Project = {
  slug: string;
  title: string;
  category: string;
  type: string;
  year: number;
  origin: ProjectOrigin;
  status: ProjectStatus;
  shortDescription: string;
  cover: string;
  previewMedia: ProjectMedia[];
  caseMedia: ProjectMedia[];
  services: string[];
  featured: boolean;
  order: number;
  demoRoute: string;
  caseStudy?: { task: string; solution: string; done: string[] };
};

export const projects: Project[] = [
  {
    slug: 'raznye-ludi',
    title: 'Разные люди',
    category: 'Лендинги',
    type: 'Landing / Interactive Website',
    year: 2026,
    origin: 'PERSONAL',
    status: 'SHOWCASE',
    shortDescription: 'Интерактивный сайт страйкбольной команды: структура, визуальная система, frontend, motion и понятный путь до заявки.',
    cover: 'assets/img/raznye-ludi-ui.webp',
    previewMedia: [
      { kind: 'image', src: 'assets/img/raznye-ludi-ui.webp', alt: 'Интерфейс сайта «Разные люди»' },
      { kind: 'video', src: 'projects/raznye-ludi/assets/final_hero.mp4', alt: 'Видео главного экрана проекта «Разные люди»' }
    ],
    caseMedia: [
      { kind: 'video', src: 'projects/raznye-ludi/assets/final_hero.mp4', alt: 'Видео главной сцены сайта «Разные люди»' },
      { kind: 'image', src: 'projects/raznye-ludi/assets/scene_01.webp', alt: 'Главная визуальная сцена проекта' },
      { kind: 'image', src: 'projects/raznye-ludi/assets/scene_04.webp', alt: 'Раздел сайта о команде' },
      { kind: 'image', src: 'projects/raznye-ludi/assets/scene_05.webp', alt: 'Контент проекта' },
      { kind: 'image', src: 'projects/raznye-ludi/assets/scene_09.webp', alt: 'Информационный раздел проекта' },
      { kind: 'image', src: 'projects/raznye-ludi/assets/scene_10.webp', alt: 'Финальный фрагмент сайта' }
    ],
    services: ['Структура и UX','Визуальная система','Frontend','Адаптив','Motion','Форма заявки'],
    featured: true,
    order: 1,
    demoRoute: '/demo/raznye-ludi/',
    caseStudy: {
      task: 'Передать характер команды, быстро объяснить формат участия и привести потенциального участника к понятному следующему шагу.',
      solution: 'Сайт строится вокруг ясной иерархии, сильного фото- и видеоконтента и последовательного пользовательского маршрута от первого впечатления до заявки.',
      done: ['Структура и пользовательский маршрут','Визуальная система','Адаптивный frontend','Motion и scroll-взаимодействия','Форма заявки','Проверка и публикация']
    }
  }
];

export const publicProjects = projects.filter((project) => project.status === 'SHOWCASE').sort((a,b) => a.order - b.order);
export function projectCategories(source: Project[] = publicProjects) { return [...new Set(source.map((project) => project.category))]; }
export function featuredProject(source: Project[] = publicProjects) { return [...source].sort((a,b) => a.order-b.order).find((project)=>project.featured) ?? source[0]; }
