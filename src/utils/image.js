const DEFAULT_MAX = 1280;
const DEFAULT_QUALITY = 0.82;

// Декодирование с уменьшением сразу при загрузке (меньше памяти на телефоне)
async function decodeScaled(file, max) {
  if (typeof createImageBitmap === "function") {
    try {
      // Сначала узнаем размеры без полного декодирования
      const probe = await createImageBitmap(file);
      const scale = Math.min(1, max / Math.max(probe.width, probe.height));
      const w = Math.round(probe.width * scale);
      const h = Math.round(probe.height * scale);
      probe.close?.();

      const bitmap = await createImageBitmap(file, {
        resizeWidth: w,
        resizeHeight: h,
        resizeQuality: "high",
      });
      return { source: bitmap, width: w, height: h, close: () => bitmap.close?.() };
    } catch {
      // Формат не поддержан этим методом, пробуем через <img> ниже
    }
  }
  return decodeWithImage(file, max);
}

function decodeWithImage(file, max) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
      resolve({
        source: img,
        width: Math.round(img.naturalWidth * scale),
        height: Math.round(img.naturalHeight * scale),
        close: () => {},
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Файл не является поддерживаемым изображением"));
    };

    img.src = url;
  });
}

export async function compressImage(file, max = DEFAULT_MAX, quality = DEFAULT_QUALITY) {
  if (!file || !file.type?.startsWith("image/")) {
    throw new Error("Выбранный файл не является изображением");
  }

  const { source, width, height, close } = await decodeScaled(file, max);

  try {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    // Белый фон, иначе прозрачные PNG станут чёрными в JPEG
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(source, 0, 0, width, height);

    const blob = await new Promise((resolve, reject) =>
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("Не удалось сохранить изображение"))),
        "image/jpeg",
        quality
      )
    );

    // Освобождаем canvas
    canvas.width = 0;
    canvas.height = 0;

    const baseName = (file.name || "photo").replace(/\.[^.]+$/, "");
    return new File([blob], `${baseName}.jpg`, { type: "image/jpeg" });
  } finally {
    close();
  }
}