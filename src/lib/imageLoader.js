/**
 * Custom Next.js image loader
 * - 절대 URL은 그대로 사용
 * - 루트(/)로 시작하는 로컬 경로는 그대로 사용
 * - 그 외(codecamp-file-storage/...)는 GCS 버킷 URL로 변환
 */
module.exports = function imageLoader({ src, quality }) {
  const q = quality || 75;

  // 이미 절대 URL인 경우 그대로
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }

  // 로컬 public/ 경로는 그대로 사용
  if (src.startsWith('/')) {
    return src;
  }

  // codecamp-file-storage 키를 GCS 절대 URL로 변환
  const normalized = src.replace(/^\/+/, '');
  const base = 'https://storage.googleapis.com/';
  const url = `${base}${normalized}`;

  // width/quality 파라미터를 붙일 필요는 없지만, 호환을 위해 quality만 유지
  return url + (url.includes('?') ? `&q=${q}` : `?q=${q}`);
};
