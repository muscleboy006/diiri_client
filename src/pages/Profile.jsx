import { tgUser } from "../utils/telegram";
import OmonatCard from "../components/OmonatCard";
import "../pages/omonat/Add.css";
import "./Profile.css";
import { useState, useMemo } from "react";

export default function Profile({ user, error, omonat, onOpen }) {
  const name = [tgUser?.first_name, tgUser?.last_name].filter(Boolean).join(" ");
  const initial = (name || user?.first_name || "?").charAt(0).toUpperCase();

  const rows = user
    ? [
        ["ID", user.telegram_id],
        ["Ism", user.first_name],
        ["Familiya", user.last_name],
        ["Username", user.username && `@${user.username}`],
      ].filter(([, value]) => value)
    : [];

  const [tab, setTab] = useState("active");

  const { active, archived } = useMemo(
    () => ({
      active: omonat.items.filter((i) => i.status !== "closed"),
      archived: omonat.items.filter((i) => i.status === "closed"),
    }),
    [omonat.items]
  );

  const visible = tab === "active" ? active : archived;

  return (
    <div className="profile">
      {/* Sarlavha */}
      <section className="profile-head">
        <div className="profile-info">
          <h1>{name || "Yuklanmoqda…"}</h1>
        </div>

        {tgUser?.photo_url ? (
          <img className="avatar" src={tgUser.photo_url} alt="" />
        ) : (
          <div className="avatar avatar-fallback">{initial}</div>
        )}
      </section>

      {/* Ma'lumotlar */}
      <section className="panel">
        <dl>
          {rows.map(([label, value]) => (
            <div className="row" key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>

        {!user && !error && <div className="muted">Ma'lumotlar yuklanmoqda…</div>}
        {error && <div className="error">Ma'lumotlarni yuklab bo'lmadi: {error}</div>}
      </section>

      <section className="ads">
        <h2>Mening Omonatlarim</h2>

        <div className="segments" role="tablist">
          <button
            role="tab"
            aria-selected={tab === "active"}
            className={`segment ${tab === "active" ? "active" : ""}`}
            onClick={() => setTab("active")}
          >
            Faol ({active.length})
          </button>
          <button
            role="tab"
            aria-selected={tab === "archived"}
            className={`segment ${tab === "archived" ? "active" : ""}`}
            onClick={() => setTab("archived")}
          >
            Arxiv ({archived.length})
          </button>
        </div>

        {omonat.loading && <div className="muted">Yuklanmoqda…</div>}

        {!omonat.loading && visible.length === 0 && (
          <div className="muted">
            {tab === "active" ? "Faol e'lonlar yo'q" : "Arxiv bo'sh"}
          </div>
        )}

        <div className="ads-list">
          {visible.map((item) => (
            <OmonatCard
              key={item.id}
              item={item}
              onOpen={onOpen}
              onToggle={omonat.toggle}
              onRemove={omonat.remove}
            />
          ))}
        </div>
      </section>
    </div>
  );
}