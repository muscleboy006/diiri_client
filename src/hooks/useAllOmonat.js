import { useEffect, useState, useCallback } from "react";
import { api } from "../utils/api"; // поправьте путь/имя под свой проект

export function useAllOmonat() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await api("/omonat");
      setItems(r.items ?? []);
    } catch (e) {
      setError(e.message || "Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { reload(); }, [reload]);

  return { items, loading, error, reload };
}