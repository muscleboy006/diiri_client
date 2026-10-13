import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { api } from "../../utils/api";
import "./ChatRoom.css";

const time = (d) =>
  new Date(d).toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" });

const dayLabel = (d) => {
  const date = new Date(d);
  const today = new Date();
  const yesterday = new Date(Date.now() - 86400000);
  if (date.toDateString() === today.toDateString()) return "Bugun";
  if (date.toDateString() === yesterday.toDateString()) return "Kecha";
  return date.toLocaleDateString("uz-UZ", { day: "numeric", month: "long" });
};

export default function ChatRoom({ id, onBack }) {
  const [messages, setMessages] = useState([]);
  const [info, setInfo] = useState(null);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [loadingOld, setLoadingOld] = useState(false);

  const lastId = useRef(0);
  const bodyRef = useRef(null);
  const inputRef = useRef(null);
  const firstScroll = useRef(true);
  const loadingOldRef = useRef(false);
  const anchor = useRef(null); // позиция скролла до подгрузки старых
  const skipBottom = useRef(false); // не скроллить вниз после подгрузки вверх

  useEffect(() => {
    let alive = true;
    lastId.current = 0;
    firstScroll.current = true;
    setMessages([]);
    setHasMore(false);
    setLoaded(false);

    const load = async () => {
      if (document.hidden) return;
      const isFirst = lastId.current === 0;
      try {
        const r = await api(`/chats/${id}/messages?after=${lastId.current}`);
        if (!alive) return;
        setInfo(r.conversation);
        setLoaded(true);
        // has_more имеет смысл только для первой загрузки (последние 50)
        if (isFirst) setHasMore(Boolean(r.has_more));
        if (r.items.length) {
          lastId.current = r.items[r.items.length - 1].id;
          setMessages((prev) => {
            const have = new Set(prev.map((m) => m.id));
            return [...prev, ...r.items.filter((m) => !have.has(m.id))];
          });
        }
      } catch (e) {
        if (alive) setError(e.message);
      }
    };

    load();
    const t = setInterval(load, 4000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [id]);

  // Подгрузка старых сообщений (50 штук) при прокрутке вверх
  const loadOlder = async () => {
    const el = bodyRef.current;
    if (!el || loadingOldRef.current || !hasMore || messages.length === 0) return;

    loadingOldRef.current = true;
    setLoadingOld(true);
    try {
      const r = await api(`/chats/${id}/messages?before=${messages[0].id}`);
      // запоминаем позицию прямо перед добавлением
      anchor.current = { h: el.scrollHeight, top: el.scrollTop };
      setMessages((prev) => {
        const have = new Set(prev.map((m) => m.id));
        return [...r.items.filter((m) => !have.has(m.id)), ...prev];
      });
      setHasMore(Boolean(r.has_more));
    } catch (e) {
      setError(e.message);
    } finally {
      loadingOldRef.current = false;
      setLoadingOld(false);
    }
  };

  const onScroll = (e) => {
    if (e.currentTarget.scrollTop < 120) loadOlder();
  };

  // Держим экран на месте после добавления старых сообщений сверху
  useLayoutEffect(() => {
    const a = anchor.current;
    const el = bodyRef.current;
    if (!a || !el) return;
    el.scrollTop = a.top + (el.scrollHeight - a.h);
    anchor.current = null;
    skipBottom.current = true;
  }, [messages]);

  // pastga aylantirish: ochilganda darhol, yangi xabarlarda silliq
  useEffect(() => {
    if (skipBottom.current) {
      skipBottom.current = false;
      return;
    }
    const el = bodyRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 150;
    if (firstScroll.current || nearBottom) {
      el.scrollTo({ top: el.scrollHeight, behavior: firstScroll.current ? "auto" : "smooth" });
      if (messages.length) firstScroll.current = false;
    }
  }, [messages.length]);

  const grow = () => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  };

  const send = async () => {
    const t = text.trim();
    if (!t || sending) return;
    setSending(true);
    setError(null);
    try {
      const r = await api(`/chats/${id}/messages`, { method: "POST", body: { text: t } });
      lastId.current = Math.max(lastId.current, r.item.id);
      setMessages((prev) => (prev.some((m) => m.id === r.item.id) ? prev : [...prev, r.item]));
      setText("");
      requestAnimationFrame(() => {
        grow();
        inputRef.current?.focus();
      });
    } catch (e) {
      setError(e.message);
    } finally {
      setSending(false);
    }
  };

  const onKeyDown = (e) => {
    // Enter faqat kompyuterda yuboradi; telefonda Enter = yangi qator
    const desktop = window.matchMedia("(pointer: fine)").matches;
    if (desktop && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const name = info ? `${info.first_name || ""} ${info.last_name || ""}`.trim() : "";
  const initial = (name[0] || "?").toUpperCase();

  return (
    <div className="room">
      <header className="room-head">
        <button className="room-back" onClick={onBack} aria-label="Orqaga">
          <ArrowLeft size={22} />
        </button>
        <div className="room-avatar">{initial}</div>
        <div className="room-info">
          <div className="room-name">{name || "…"}</div>
        </div>
      </header>

      {/* Закреплённое объявление: вне прокручиваемого .room-body */}
      {info?.title && (
        <div className="room-ad">
          <div className="room-ad-photo">
            {info.title[0].toUpperCase()}
            {info.photo && (
              <img
                src={info.photo}
                alt=""
                decoding="async"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            )}
          </div>
          <div className="room-ad-title">{info.title}</div>
        </div>
      )}

      <div className="room-body" ref={bodyRef} onScroll={onScroll}>
        {/* слот фиксированной высоты: индикатор не двигает сообщения */}
        {messages.length > 0 && (
          <div className="room-older">{loadingOld ? "Yuklanmoqda…" : ""}</div>
        )}

        {loaded && messages.length === 0 && (
          <div className="room-empty">Birinchi xabarni yozing 👋</div>
        )}

        {messages.map((m, i) => {
          const prev = messages[i - 1];
          const newDay =
            !prev || new Date(prev.created_at).toDateString() !== new Date(m.created_at).toDateString();
          const sameAuthor = prev && prev.mine === m.mine && !newDay;

          return (
            <div key={m.id} className="msg-wrap">
              {newDay && <div className="day-sep"><span>{dayLabel(m.created_at)}</span></div>}
              <div className={`msg ${m.mine ? "mine" : "theirs"} ${sameAuthor ? "grouped" : ""}`}>
                <span className="msg-text">{m.text}</span>
                <span className="msg-time">{time(m.created_at)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {error && <div className="room-error">{error}</div>}

      <div className="room-input">
        <textarea
          ref={inputRef}
          rows={1}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            grow();
          }}
          onKeyDown={onKeyDown}
          placeholder="Xabar"
          maxLength={1000}
        />
        <button
          className="room-send"
          onClick={send}
          disabled={sending || !text.trim()}
          aria-label="Yuborish"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}