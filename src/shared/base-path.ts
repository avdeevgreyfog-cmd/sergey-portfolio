export function getBasePath(): string {
  const value = document.querySelector<HTMLMetaElement>('meta[name="app-base"]')?.content ?? '';
  return value.replace(/\/$/, '');
}

export function stripBase(pathname = window.location.pathname): string {
  const base = getBasePath();
  if (base && pathname.startsWith(base)) {
    return pathname.slice(base.length) || '/';
  }
  return pathname || '/';
}

export function withBase(path: string): string {
  const base = getBasePath();
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalized}` || '/';
}
