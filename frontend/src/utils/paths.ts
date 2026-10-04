/**
 * Resolves static asset paths correctly whether hosted at root or on GitHub Pages sub-path (/agentic-dating)
 */
export function getDataUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (typeof window !== 'undefined') {
    const isGhPages = window.location.pathname.startsWith('/agentic-dating');
    return isGhPages ? `/agentic-dating${cleanPath}` : cleanPath;
  }
  const base = process.env.NODE_ENV === 'production' ? '/agentic-dating' : '';
  return `${base}${cleanPath}`;
}
