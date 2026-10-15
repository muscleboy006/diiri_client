export const API_URL = "https://diiri-cargo.duckdns.org/api";
export const UPLOADS_URL = "https://diiri-cargo.duckdns.org/uploads";
// export const API_URL = "/api";
// export const UPLOADS_URL = "";

export function imgUrl(src) {
  if (!src) return null;
  if (/^https?:\/\//.test(src)) return src;
  const path = src.startsWith("/") ? src : `/uploads/${src}`;
  return `${UPLOADS_URL}${path}`;
}