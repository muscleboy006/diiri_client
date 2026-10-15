export const API_URL =
  import.meta.env.VITE_API_URL ?? "https://diiri-cargo.duckdns.org/api";

export const UPLOADS_URL = API_URL.replace(/\/api$/, "");