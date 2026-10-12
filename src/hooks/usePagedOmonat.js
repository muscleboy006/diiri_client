import { useState, useEffect, useRef, useCallback } from "react";
import { api } from "../utils/api";

export function usePagedOmonat({ query, filters }) {
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const pageRef = useRef(0);
  const loadingRef = useRef(false);
  const reqId = useRef(0);

  // поиск с задержкой, чтобы не слать запрос на каждый символ
  const [debouncedQ, setDebouncedQ] = useState(query);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(query.trim()), 400);
    return () => clearTimeout(t);
  }, [query]);

  const key = JSON.stringify({ q: debouncedQ, ...filters });

  const load = useCallback(
    async (reset) => {
      if (loadingRef.current && !reset) return;
      const id = ++reqId.current;
      const nextPage = reset ? 1 : pageRef.current + 1;

      loadingRef.current = true;
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          page: nextPage,
          q: debouncedQ,
          from: filters.from,
          to: filters.to,
          min: filters.priceMin,
          max: filters.priceMax,
          sort: filters.sort,
        });
        const data = await api(`/omonat?${params}`);

        if (id !== reqId.current) return; // устаревший ответ
        pageRef.current = nextPage;
        setItems((prev) => (reset ? data.items : [...prev, ...data.items]));
        setHasMore(data.hasMore);
      } catch (e) {
        if (id === reqId.current) setError(e.message || "Ошибка загрузки");
      } finally {
        if (id === reqId.current) {
          loadingRef.current = false;
          setLoading(false);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key]
  );

  // при смене поиска или фильтров начинаем с первой страницы
  useEffect(() => {
    setItems([]);
    setHasMore(true);
    pageRef.current = 0;
    load(true);
  }, [load]);

  const loadMore = useCallback(() => {
    if (hasMore && !loadingRef.current) load(false);
  }, [hasMore, load]);

  return { items, loading, error, hasMore, loadMore, reload: () => load(true) };
}