import { tg } from "./telegram";
import { API_URL } from "./config";

export async function api(path, { method = "GET", body } = {}) {
  const isForm = body instanceof FormData;
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      Authorization: `tma ${tg?.initData ?? ""}`,
      ...(body && !isForm ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}