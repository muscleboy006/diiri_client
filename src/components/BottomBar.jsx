import { useEffect, useState } from "react";
import { Home, User, Plus, MessagesSquare, Heart } from "lucide-react";
import { api } from "../utils/api";
import "./BottomBar.css";

const TABS_LEFT = [
  { key: "home", label: "Bosh sahifa", Icon: Home },
  { key: "chats", label: "Chatlar", Icon: MessagesSquare },
];

const TABS_RIGHT = [
  { key: "saved", label: "Saqlanganlar", Icon: Heart },
  { key: "profile", label: "Profil", Icon: User },
];

export default function BottomBar({ page, onChange }) {
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    let alive = true;
    const load = () => {
      if (document.hidden) return;
      api("/chats/unread")
        .then((r) => alive && setUnread(r.unread || 0))
        .catch(() => {});
    };
    load();
    const t = setInterval(load, 10000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [page]); // при смене вкладки обновляем сразу

  const renderTab = ({ key, label, Icon }) => (
    <button
      key={key}
      className={`tab ${page === key ? "active" : ""}`}
      onClick={() => onChange(key)}
      aria-label={label}
      aria-current={page === key ? "page" : undefined}
    >
      <Icon size={22} strokeWidth={2} />
      {key === "chats" && unread > 0 && (
        <span className="tab-badge">{unread > 99 ? "99+" : unread}</span>
      )}
    </button>
  );

  return (
    <nav className="bottom-bar">
      {TABS_LEFT.map(renderTab)}

      <button
        className={`tab tab-add ${page === "add" ? "active" : ""}`}
        onClick={() => onChange("add")}
        aria-label="Omonat qo'shish"
      >
        <Plus size={20} strokeWidth={2.5} />
      </button>

      {TABS_RIGHT.map(renderTab)}
    </nav>
  );
}