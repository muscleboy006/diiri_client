import { useEffect, useState } from "react";
import { tg } from "../utils/telegram";

export function useUser() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/me", { headers: { Authorization: `tma ${tg?.initData ?? ""}` } })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(({ user }) => {
        if (!user) throw new Error("Foydalanuvchi topilmadi. Botga /start yuboring.");
        setUser(user);
      })
      .catch((e) => setError(e.message));
  }, []);

  return { user, error };
}