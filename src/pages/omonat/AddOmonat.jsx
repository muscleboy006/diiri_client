import { useRef, useState } from "react";
import { api } from "../../utils/api";
import { compressImage } from "../../utils/image";
import { normalize } from "../../constants/cities";
import CityInput from "../../components/CityInput";
import { CameraIcon } from "lucide-react";
import "./Add.css";

const MAX_PHOTOS = 5;
const empty = { title: "", from_city: "", to_city: "", price: "", description: "" };

export default function AddOmonat({ onCreated }) {
  const [form, setForm] = useState(empty);
  const [photos, setPhotos] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const fileRef = useRef(null);

  // для обычных input/textarea (получают event)
  const set = (k) => (e) => {
    const value = e.target.value;
    setForm((f) => ({ ...f, [k]: value }));
  };

  // для CityInput (получает готовую строку)
  const setValue = (k) => (value) => setForm((f) => ({ ...f, [k]: value }));

const pickPhotos = async (e) => {
  const picked = Array.from(e.target.files).slice(0, MAX_PHOTOS - photos.length);
  e.target.value = "";
  if (!picked.length) return;

  const results = await Promise.allSettled(picked.map((f) => compressImage(f)));

  const ok = results
    .filter((r) => r.status === "fulfilled")
    .map((r) => ({ file: r.value, preview: URL.createObjectURL(r.value) }));

  const failed = results.length - ok.length;
  if (failed) {
    const reason = results.find((r) => r.status === "rejected")?.reason?.message;
    setError(
      `Qayta ishlab bolmadi ${failed} rasm${reason ? `: ${reason}` : ""}`
    );
  } else {
    setError(null);
  }

  setPhotos((prev) => [...prev, ...ok]);
};

  const removePhoto = (i) => {
    URL.revokeObjectURL(photos[i].preview);
    setPhotos(photos.filter((_, idx) => idx !== i));
  };

  const submit = async () => {
    const from = form.from_city.trim();
    const to = form.to_city.trim();

    if (!from || !to) return setError("Shaharlarni kiriting");
    if (normalize(from) === normalize(to)) {
      return setError("«Qayerdan» va «Qayerga» bir xil bo'lmasligi kerak");
    }

    setSaving(true);
    setError(null);
    try {
      const fd = new FormData();
      Object.entries({ ...form, from_city: from, to_city: to }).forEach(([k, v]) =>
        fd.append(k, v)
      );
      photos.forEach((p) => fd.append("images", p.file));

      await api("/omonat", { method: "POST", body: fd });
      photos.forEach((p) => URL.revokeObjectURL(p.preview));
      setForm(empty);
      setPhotos([]);
      onCreated?.();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="add">
      <div className="add-head">
        <h1>Yangi Omonat</h1>
        <p>Nimani yuborish kerakligini yozing</p>
      </div>

      <section className="block">
        <div className="block-title">
          Rasm <span>{photos.length}/{MAX_PHOTOS}</span>
        </div>
        <div className="photos">
          {photos.map((p, i) => (
            <div className="photo" key={p.preview}>
              <img src={p.preview} alt="" />
              {i === 0 && <span className="cover">Asosiy</span>}
              <button className="photo-x" onClick={() => removePhoto(i)} aria-label="Olib tashlash">×</button>
            </div>
          ))}
          {photos.length < MAX_PHOTOS && (
            <button className="photo photo-add" onClick={() => fileRef.current.click()}>
              <CameraIcon />
              <span>Qo'shish</span>
            </button>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={pickPhotos} />
      </section>

      <section className="block">
        <label>Sarlavha
          <input value={form.title} maxLength={100} onChange={set("title")}
                 placeholder="Masalan: hujjatlar solingan quti" />
        </label>

        <div className="route-row">
          <label>Qayerdan
            <CityInput value={form.from_city} onChange={setValue("from_city")}
                       placeholder="Shaharni yozing" />
          </label>
          <span className="arrow">→</span>
          <label>Qayerga
            <CityInput value={form.to_city} onChange={setValue("to_city")}
                       placeholder="Shaharni yozing" />
          </label>
        </div>
      </section>

      <section className="block">
        <label>Narxi
          <div className="suffix">
            <input type="number" inputMode="numeric" value={form.price}
                   onChange={set("price")} placeholder="Kelishilgan narx" />
            <i>so'm</i>
          </div>
        </label>
      </section>

      <section className="block">
        <label>Tavsif
          <textarea rows="4" maxLength={1000} value={form.description}
                    onChange={set("description")}
                    placeholder="Hajmi, mo'rtligi, qachon yuborish kerakligi…" />
          <small>{form.description.length}/1000</small>
        </label>
      </section>

      {error && <div className="error">{error}</div>}

      <button className="submit" onClick={submit} disabled={saving}>
        {saving ? "Joylanmoqda…" : "E'lon qilish"}
      </button>
    </div>
  );
}