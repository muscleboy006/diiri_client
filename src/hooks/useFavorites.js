import { useState, useCallback } from "react";

const KEY = "omonat_favorites";

function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

export function useFavorites() {
  const [ids, setIds] = useState(read);

  const toggle = useCallback((id) => {
    setIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const isFav = useCallback((id) => ids.includes(id), [ids]);

  return { ids, toggle, isFav };
}