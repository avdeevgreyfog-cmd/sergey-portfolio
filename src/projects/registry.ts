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
  caseStudy?: {
    task: string;
    solution: string;
    done: string[];
  };
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
    shortDescription: 'Атмосферный интерактивный сайт страйкбольной команды: фото, видео, storytelling и понятный путь до первого контакта.',
    cover: 'projects/raznye-ludi/assets/scene_01.webp',
    previewMedia: [
      { kind: 'image', src: 'projects/raznye-ludi/assets/scene_01.webp', alt: 'Главная визуальная сцена сайта «Разные люди»' },
      { kind: 'video', src: 'projects/raznye-ludi/assets/final_hero.mp4', alt: 'Видео главного экрана проекта «Разные люди»' }
    ],
    caseMedia: [
      { kind: 'video', src: 'projects/raznye-ludi/assets/final_hero.mp4', alt: 'Видео главной сцены сайта «Разные люди»' },
      { kind: 'image', src: 'projects/raznye-ludi/assets/scene_01.webp', alt: 'Главная визуальная сцена проекта' },
      { kind: 'image', src: 'projects/raznye-ludi/assets/scene_04.webp', alt: 'Раздел сайта о команде' },
      { kind: 'image', src: 'projects/raznye-ludi/assets/scene_05.webp', alt: 'Фото и контент проекта' },
      { kind: 'image', src: 'projects/raznye-ludi/assets/scene_09.webp', alt: 'Информационный раздел проекта' },
      { kind: 'image', src: 'projects/raznye-ludi/assets/scene_10.webp', alt: 'Финальный фрагмент сайта' }
    ],
    services: ['Структура и UX','Визуальная концепция','Адаптив','Фото и видео','Анимации','Интерактив','Форма заявки'],
    featured: true,
    order: 1,
    demoRoute: '/demo/raznye-ludi/',
    caseStudy: {
      task: 'Создать атмосферный сайт страйкбольной команды, который передаёт характер команды, знакомит пользователя с форматом и приводит к первому контакту.',
      solution: 'Сценарий строится вокруг реальных фото и видео, крупной типографики и последовательного раскрытия информации. Контент ведёт от первого впечатления к формату команды, тренировкам, критериям участия и заявке.',
      done: ['Структура и пользовательский маршрут','Фото- и video-led визуальное направление','Адаптивная версия','Motion и scroll-взаимодействия','Форма заявки и навигация']
    }
  }
];

export const publicProjects = projects
  .filter((project) => project.status === 'SHOWCASE')
  .sort((a,b) => a.order - b.order);

export function projectCategories(source: Project[] = publicProjects) {
  return [...new Set(source.map((project) => project.category))];
}

export function featuredProject(source: Project[] = publicProjects) {
  return [...source].sort((a,b) => a.order-b.order).find((project)=>project.featured) ?? source[0];
}
