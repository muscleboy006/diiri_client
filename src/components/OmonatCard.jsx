import { Heart } from "lucide-react";
import { formatDate } from "../utils/format";
import { imgUrl } from "../utils/config";
import "./OmonatCard.css";

export default function OmonatCard({ item, onToggle, onRemove, onOpen, isFav, onToggleFav }) {
  const cover = item.images?.[0];
  const closed = item.status === "closed";

  return (
    <div className={`omonat ${closed ? "closed" : ""}`} onClick={() => onOpen?.(item)}>
      <div className="thumb">
        {cover ? (
          // <img src={cover} alt="" loading="lazy" />
          <img src={imgUrl(cover)} alt="" loading="lazy" />
        ) : (
          <div className="thumb-empty">📦</div>
        )}
        {item.images?.length > 1 && <span className="count">{item.images.length} ta rasm</span>}
        {closed && <span className="tag">Yopilgan</span>}

        {onToggleFav && (
          <button
            className="fav-btn"
            aria-label="Saralanganlarga"
            onClick={(e) => {
              e.stopPropagation(); // karta ochilib ketmasligi uchun
              onToggleFav();
            }}
          >
            <Heart
              size={18}
              fill={isFav ? "red" : "none"}
              color={isFav ? "red" : "currentColor"}
            />
          </button>
        )}
      </div>

      <div className="omonat-body">
        <h3>{item.title}</h3>

        <div className="price">
          {item.price > 0 ? `${item.price.toLocaleString("uz-UZ")} so'm` : "Kelishilgan narx"}
        </div>

        <div className="route">{item.from_city} → {item.to_city}</div>
        <div className="date">{formatDate(item.created_at)}</div>

        {(onToggle || onRemove) && (
          <div className="actions" onClick={(e) => e.stopPropagation()}>
            {onToggle && (
              <button onClick={() => onToggle(item)}>
                {closed ? "Ochish" : "Yopish"}
              </button>
            )}
            {onRemove && (
              <button
                className="danger"
                onClick={() => confirm("O'chirilsinmi?") && onRemove(item.id)}
                aria-label="O'chirish"
              >
                ✕
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}