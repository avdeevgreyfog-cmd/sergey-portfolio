export function getBasePath() {
  const value = document.querySelector<HTMLMetaElement>('meta[name="app-base"]')?.content || '';
  return value.replace(/\/$/,'');
}
export function routePath() {
  const base = getBasePath();
  const path = location.pathname;
  return base && path.startsWith(base) ? (path.slice(base.length) || '/') : path;
}
