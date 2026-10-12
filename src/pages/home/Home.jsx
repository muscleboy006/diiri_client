import { useState, useEffect, useRef, useCallback } from "react";
import { Search, SlidersHorizontal, X, RefreshCw } from "lucide-react";
import { api } from "../../utils/api";
import OmonatCard from "../../components/OmonatCard";
import CityInput from "../../components/CityInput";
import { useFavorites } from "../../hooks/useFavorites";
import { usePagedOmonat } from "../../hooks/usePagedOmonat";
import "./Home.css";

const EMPTY = { from: "", to: "", priceMin: "", priceMax: "", sort: "new" };
const THRESHOLD = 64; // сколько нужно потянуть (px), чтобы запустить обновление

// Значение с задержкой: чтобы не слать запрос на каждую букву
function useDebounced(value, ms) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

// Потянуть вниз в самом верху страницы → обновить
function usePullToRefresh(onRefresh, enabled) {
  const [pull, setPull] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const startY = useRef(null);
  const pullRef = useRef(0);
  const busy = useRef(false);
  const cb = useRef(onRefresh);
  cb.current = onRefresh;

  useEffect(() => {
    if (!enabled) return;

    const onStart = (e) => {
      startY.current =
        window.scrollY <= 0 && !busy.current ? e.touches[0].clientY : null;
    };

    const onMove = (e) => {
      if (startY.current == null) return;
      const dy = e.touches[0].clientY - startY.current;

      if (dy <= 0 || window.scrollY > 0) {
        if (pullRef.current) {
          pullRef.current = 0;
          setPull(0);
          setDragging(false);
        }
        return;
      }
      if (e.cancelable) e.preventDefault(); // не даём странице «резинить»
      const v = Math.min(dy * 0.5, 96);
      pullRef.current = v;
      setDragging(true);
      setPull(v);
    };

    const onEnd = async () => {
      if (startY.current == null) return;
      startY.current = null;
      setDragging(false);

      const v = pullRef.current;
      pullRef.current = 0;

      if (v >= THRESHOLD && !busy.current) {
        busy.current = true;
        setRefreshing(true);
        setPull(56); // удерживаем индикатор, пока идёт загрузка
        try {
          await Promise.all([
            cb.current(),
            new Promise((r) => setTimeout(r, 600)), // чтобы индикатор не мигал
          ]);
        } finally {
          busy.current = false;
          setRefreshing(false);
          setPull(0);
        }
      } else {
        setPull(0);
      }
    };

    document.addEventListener("touchstart", onStart, { passive: true });
    document.addEventListener("touchmove", onMove, { passive: false });
    document.addEventListener("touchend", onEnd);
    document.addEventListener("touchcancel", onEnd);
    return () => {
      document.removeEventListener("touchstart", onStart);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onEnd);
      document.removeEventListener("touchcancel", onEnd);
    };
  }, [enabled]);

  return { pull, dragging, refreshing };
}

export default function Home({ onOpen, active = true, version = 0 }) {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState(EMPTY);
  const [open, setOpen] = useState(false);
  const [cities, setCities] = useState({ from: [], to: [] });
  const { toggle, isFav } = useFavorites();

  // запросы уходят с небольшой задержкой после ввода
  const dQuery = useDebounced(query, 350);
  const dFilters = useDebounced(filters, 400);

  const { items, loading, error, hasMore, loadMore, reload } = usePagedOmonat({
    query: dQuery,
    filters: dFilters,
  });

  const loadCities = useCallback(
    () => api("/omonat/cities").then(setCities).catch(() => {}),
    []
  );

  useEffect(() => {
    loadCities();
  }, [loadCities]);

  // После публикации нового объявления: перезагружаем ленту и список городов
  useEffect(() => {
    if (!version) return;
    reload();
    loadCities();
  }, [version]); // eslint-disable-line react-hooks/exhaustive-deps

  const refresh = () => Promise.all([Promise.resolve(reload()), loadCities()]);
  const { pull, dragging, refreshing } = usePullToRefresh(refresh, active);

  const sentinel = useRef(null);
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && loadMore(),
      { rootMargin: "300px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [loadMore, items.length]);

  const set = (key) => (e) => {
    const value = e.target.value;
    setFilters((f) => ({ ...f, [key]: value }));
  };
  const setValue = (key) => (value) => setFilters((f) => ({ ...f, [key]: value }));

  const activeCount = Object.entries(filters).filter(
    ([k, v]) => v !== "" && v !== EMPTY[k]
  ).length;

  return (
    <div className="home">
      <div className="home-search">
        <div className="search-field">
          <Search size={18} />
          <input
            type="search"
            placeholder="E'lonlarni qidirish"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button className="search-clear" onClick={() => setQuery("")} aria-label="Tozalash">
              <X size={16} />
            </button>
          )}
        </div>

        <button
          className={`filter-btn ${open || activeCount ? "on" : ""}`}
          onClick={() => setOpen(!open)}
          aria-label="Filtrlar"
        >
          <SlidersHorizontal size={20} />
          {activeCount > 0 && <span className="filter-badge">{activeCount}</span>}
        </button>
      </div>

      {/* Строка поиска остаётся на месте, вниз тянется только лента */}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          transform: pull ? `translateY(${pull}px)` : undefined,
          transition: dragging ? "none" : "transform 0.2s ease",
        }}
      >
        {/* индикатор обновления: вынесен из потока, ничего не сдвигает */}
        <div
          className="ptr"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: -34,
            display: "flex",
            justifyContent: "center",
            pointerEvents: "none",
            color: "var(--accent)",
            opacity: Math.min(pull / THRESHOLD, 1),
          }}
        >
          <RefreshCw
            size={22}
            className={refreshing ? "spin" : ""}
            style={refreshing ? undefined : { transform: `rotate(${pull * 4}deg)` }}
          />
        </div>

      {open && (
        <div className="filters">
          <div className="filters-row">
            <label>
              Qayerdan
              <CityInput
                value={filters.from}
                onChange={setValue("from")}
                extra={cities.from}
                placeholder="Barchasi"
              />
            </label>
            <label>
              Qayerga
              <CityInput
                value={filters.to}
                onChange={setValue("to")}
                extra={cities.to}
                placeholder="Barchasi"
              />
            </label>
          </div>

          <div className="filters-row">
            <label>
              Narxi: dan
              <input type="number" min="0" inputMode="numeric" placeholder="0"
                     value={filters.priceMin} onChange={set("priceMin")} />
            </label>
            <label>
              Narxi: gacha
              <input type="number" min="0" inputMode="numeric" placeholder="∞"
                     value={filters.priceMax} onChange={set("priceMax")} />
            </label>
          </div>

          <label>
            Saralash
            <select value={filters.sort} onChange={set("sort")}>
              <option value="new">Avval yangilari</option>
              <option value="cheap">Avval arzonlari</option>
              <option value="expensive">Avval qimmatlari</option>
            </select>
          </label>

          <button
            className="filters-reset"
            onClick={() => { setFilters(EMPTY); setQuery(""); }}
          >
            Filtrlarni tozalash
          </button>
        </div>
      )}

      {error && (
        <div className="error">
          {error} <button className="link-btn" onClick={reload}>Qayta urinish</button>
        </div>
      )}

      {items.length === 0 && !loading && !error ? (
        <div className="muted">Hech narsa topilmadi</div>
      ) : (
        <div className="ads-list">
          {items.map((item) => (
            <OmonatCard
              key={item.id}
              item={item}
              onOpen={onOpen}
              isFav={isFav(item.id)}
              onToggleFav={() => toggle(item.id)}
            />
          ))}
        </div>
      )}

      {loading && <div className="muted">Yuklanmoqda…</div>}
      {hasMore && !error && <div ref={sentinel} style={{ height: 1 }} />}
      </div>
    </div>
  );
}