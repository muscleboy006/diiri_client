import { useCallback, useEffect, useState } from "react";
import { api } from "../utils/api";

export function useMyOmonat() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(() => {
    setLoading(true);
    api("/omonat/my")
      .then(({ items }) => setItems(items))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(reload, [reload]);

  const remove = async (id) => {
    await api(`/omonat/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const toggle = async (item) => {
    const status = item.status === "active" ? "closed" : "active";
    const { item: updated } = await api(`/omonat/${item.id}`, { method: "PATCH", body: { status } });
    setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
  };

  return { items, loading, reload, remove, toggle };
}