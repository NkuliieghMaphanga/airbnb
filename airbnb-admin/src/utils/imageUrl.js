/**
 * Resolve accommodation image paths for display in the admin portal.
 */
export function resolveImageUrl(src) {
  if (!src || typeof src !== 'string') {
    return '';
  }
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
    return src;
  }
  return src.startsWith('/') ? src : `/${src}`;
}
