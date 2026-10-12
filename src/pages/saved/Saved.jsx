import { useEffect, useState } from "react";
import { api } from "../../utils/api";
import { useFavorites } from "../../hooks/useFavorites";
import OmonatCard from "../../components/OmonatCard";
import "../home/Home.css";

export default function Saved({ onOpen }) {
  const { ids, toggle, isFav } = useFavorites();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => {
    if (ids.length === 0) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    api(`/omonat/by-ids?ids=${ids.join(",")}`)
      .then((r) => setItems(r.items ?? []))
      .catch((e) => setError(e.message || "Yuklashda xatolik"))
      .finally(() => setLoading(false));
  };

  // грузим один раз при открытии страницы, а не при каждом снятии сердечка
  useEffect(load, []); // eslint-disable-line react-hooks/exhaustive-deps

  const visible = items.filter((i) => isFav(i.id));

  return (
    <div className="home">
      <h1>Saqlanganlar</h1>

      {loading && <div className="muted">Yuklanmoqda…</div>}
      {error && (
        <div className="error">
          {error} <button className="link-btn" onClick={load}>Qayta urinish</button>
        </div>
      )}

      {!loading && !error && (
        visible.length === 0 ? (
          <div className="muted">Hozircha hech narsa yo'q. E'londagi ♡ tugmasini bosing.</div>
        ) : (
          <div className="ads-list">
            {visible.map((item) => (
              <OmonatCard
                key={item.id}
                item={item}
                onOpen={onOpen}
                isFav={isFav(item.id)}
                onToggleFav={() => toggle(item.id)}
              />
            ))}
          </div>
        )
      )}
    </div>
  );
}