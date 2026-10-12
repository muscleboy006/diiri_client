import { useEffect, useRef, useState } from "react";
import { MessageCircle } from "lucide-react";
import { api } from "../../utils/api";
import "./Chats.css";

const stamp = (d) => {
  const date = new Date(d);
  const now = new Date();
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" });
  }
  const yesterday = new Date(Date.now() - 86400000);
  if (date.toDateString() === yesterday.toDateString()) return "Kecha";
  return date.toLocaleDateString("uz-UZ", { day: "numeric", month: "short" });
};

// Невидимый маркер в конце списка: когда он близко к экрану — грузим ещё
function Sentinel({ onVisible }) {
  const ref = useRef(null);
  const cb = useRef(onVisible);
  cb.current = onVisible;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && cb.current(),
      { rootMargin: "300px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return <div ref={ref} style={{ height: 1 }} />;
}

export default function Chats({ onOpenChat }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState(null);

  const cursor = useRef(null); // курсор следующей порции
  const busy = useRef(false);
  const isFirst = useRef(true);

  // Первая порция + обновление раз в 8 секунд.
  // Опрос обновляет только верх списка (первые 50), остальное не трогает.
  useEffect(() => {
    let alive = true;

    const load = async () => {
      if (!isFirst.current && document.hidden) return;
      try {
        const r = await api("/chats");
        if (!alive) return;
        const page = r.items ?? [];

        setItems((prev) => {
          if (isFirst.current) return page;
          const ids = new Set(page.map((i) => i.id));
          return [...page, ...prev.filter((i) => !ids.has(i.id))];
        });

        // курсор берём только из самой первой загрузки
        if (isFirst.current) {
          cursor.current = r.next_cursor ?? null;
          setHasMore(Boolean(r.next_cursor));
          isFirst.current = false;
        }
        setError(null);
      } catch (e) {
        if (alive) setError(e.message);
      } finally {
        if (alive) setLoading(false);
      }
    };

    load();
    const t = setInterval(load, 8000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  // Подгрузка следующих 50 при прокрутке вниз
  const loadMore = async () => {
    if (busy.current || !cursor.current) return;
    busy.current = true;
    setLoadingMore(true);
    try {
      const r = await api(`/chats?cursor=${encodeURIComponent(cursor.current)}`);
      setItems((prev) => {
        const ids = new Set(prev.map((i) => i.id));
        return [...prev, ...(r.items ?? []).filter((i) => !ids.has(i.id))];
      });
      cursor.current = r.next_cursor ?? null;
      setHasMore(Boolean(cursor.current));
    } catch (e) {
      setError(e.message);
    } finally {
      busy.current = false;
      setLoadingMore(false);
    }
  };

  return (
    <div className="chats">
      <h1 className="chats-title">Chatlar</h1>

      {loading && <div className="chats-hint">Yuklanmoqda…</div>}
      {error && <div className="chats-error">{error}</div>}

      {!loading && !error && items.length === 0 && (
        <div className="chats-empty">
          <MessageCircle size={44} strokeWidth={1.5} />
          <p>Hozircha yozishmalar yo'q</p>
          <span>Chatni boshlash uchun e'londagi «Yozish» tugmasini bosing</span>
        </div>
      )}

      {items.length > 0 && (
        <div className="chat-list">
          {items.map((c) => {
            const name = `${c.first_name || ""} ${c.last_name || ""}`.trim() || "Foydalanuvchi";
            return (
              <button
                key={c.id}
                className={`chat-row ${c.unread > 0 ? "unread" : ""}`}
                onClick={() => onOpenChat(c.id)}
              >
                <div className="chat-avatar">
                  {(c.title?.[0] || name[0]).toUpperCase()}
                  {c.photo && (
                    <img
                      className="chat-photo"
                      src={c.photo}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  )}
                </div>

                <div className="chat-main">
                  <div className="chat-top">
                    <span className="chat-name">{name}</span>
                    <span className="chat-time">{stamp(c.last_message_at)}</span>
                  </div>
                  <div className="chat-ad">{c.title}</div>
                  <div className="chat-bottom">
                    <span className="chat-last">{c.last_text}</span>
                    {c.unread > 0 && <span className="chat-badge">{c.unread}</span>}
                  </div>
                </div>
              </button>
            );
          })}

          {/* key перезапускает наблюдение, если после загрузки маркер всё ещё виден */}
          {hasMore && <Sentinel key={items.length} onVisible={loadMore} />}
          {loadingMore && <div className="chats-hint">Yuklanmoqda…</div>}
        </div>
      )}
    </div>
  );
}