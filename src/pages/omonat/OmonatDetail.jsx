import { useState } from "react";
import { ArrowLeft, MapPin, Calendar, MessageCircle } from "lucide-react";
import { formatDate } from "../../utils/format";
import { tg } from "../../utils/telegram";
import { api } from "../../utils/api";
import "./OmonatDetail.css";

export default function OmonatDetail({ item, onBack, onOpenChat }) {
  const [index, setIndex] = useState(0);
  const images = item.images ?? [];
  const closed = item.status === "closed";
  const isMine = Number(item.owner_id) === tg?.initDataUnsafe?.user?.id;

  const contact = async () => {
    try {
      const r = await api("/chats", { method: "POST", body: { omonat_id: item.id } });
      onOpenChat(r.conversation.id);
    } catch (e) {
      tg?.showAlert ? tg.showAlert(e.message) : alert(e.message);
    }
  };

  return (
    <div className="detail">
      <button className="detail-back" onClick={onBack} aria-label="Orqaga">
        <ArrowLeft size={20} />
      </button>

      <div className="gallery">
        {images.length > 0 ? (
          <img src={images[index]} alt="" />
        ) : (
          <div className="gallery-empty">📦</div>
        )}
        {closed && <span className="tag">Yopilgan</span>}
        {images.length > 1 && (
          <span className="count">{index + 1} / {images.length}</span>
        )}
      </div>

      {images.length > 1 && (
        <div className="thumbs">
          {images.map((src, i) => (
            <button
              key={i}
              className={`thumb-btn ${i === index ? "active" : ""}`}
              onClick={() => setIndex(i)}
            >
              <img src={src} alt="" />
            </button>
          ))}
        </div>
      )}

      <div className="detail-body">
        <div className="detail-price">
          {item.price > 0 ? `${item.price.toLocaleString("uz-UZ")} so'm` : "Kelishilgan narx"}
        </div>

        <h1 className="detail-title">{item.title}</h1>

        <div className="detail-meta">
          <span><MapPin size={16} /> {item.from_city} → {item.to_city}</span>
          <span><Calendar size={16} /> {formatDate(item.created_at)}</span>
        </div>

        {item.description && (
          <>
            <h2 className="detail-h">Tavsif</h2>
            <p className="detail-text">{item.description}</p>
          </>
        )}
      </div>

      {!closed && !isMine && (
        <div className="detail-footer">
          <button className="detail-contact" onClick={contact}>
            <MessageCircle size={18} /> Yozish
          </button>
        </div>
      )}
    </div>
  );
}