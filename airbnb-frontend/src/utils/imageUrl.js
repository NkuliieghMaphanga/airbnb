/**
 * Resolve accommodation image paths for display.
 * - Absolute http(s) URLs are returned as-is
 * - Relative paths like /uploads/foo.jpg work via the Vite proxy in dev
 * - Empty / missing values fall back to a placeholder
 */
export function resolveImageUrl(src) {
  if (!src || typeof src !== 'string') {
    return 'https://picsum.photos/seed/airbnb-placeholder/800/600';
  }
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
    return src;
  }
  // Relative path served by the backend (and proxied by Vite)
  return src.startsWith('/') ? src : `/${src}`;
}

export function resolveImageList(images = []) {
  if (!Array.isArray(images) || images.length === 0) {
    return [resolveImageUrl(null)];
  }
  return images.map(resolveImageUrl);
}
