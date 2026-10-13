import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./App.css";
import { tg } from "./utils/telegram";
import { useUser } from "./hooks/useUser";
import { useMyOmonat } from "./hooks/useOmonat";
import BottomBar from "./components/BottomBar";
import Home from "./pages/home/Home";
import Profile from "./pages/Profile";
import AddOmonat from "./pages/omonat/AddOmonat";
import Saved from "./pages/saved/Saved";
import Chats from "./pages/chats/Chats";
import ChatRoom from "./pages/chats/ChatRoom";
import OmonatDetail from "./pages/omonat/OmonatDetail";

// Вкладка остаётся в DOM, просто скрывается.
// Данные не перезапрашиваются, список не мигает.
function Tab({ active, children }) {
  return (
    <div className="tab" hidden={!active}>
      {children} 
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("home");
  const [selected, setSelected] = useState(null);
  const [chatId, setChatId] = useState(null);
  const [homeVersion, setHomeVersion] = useState(0); // растёт при новом объявлении
  const { user, error } = useUser();
  const omonat = useMyOmonat();

  const overlay = Boolean(selected || chatId);

  // позиция скролла для каждой вкладки
  const scrolls = useRef({});

  const saveScroll = () => {
    if (!overlay) scrolls.current[page] = window.scrollY;
  };

  const changePage = (next) => {
    saveScroll();
    setPage(next);
  };

  const openItem = (item) => {
    saveScroll();
    setSelected(item);
  };
  const closeItem = () => setSelected(null);

  const openChatFromList = (id) => {
    saveScroll();
    setChatId(id);
  };

  const openChat = (id) => {
    setSelected(null); // закрываем объявление
    setChatId(id);
    setPage("chats"); // после выхода из чата попадём в список чатов
  };
  const closeChat = () => setChatId(null);

  // Восстанавливаем скролл до отрисовки кадра — без прыжков
  useLayoutEffect(() => {
    if (overlay) {
      window.scrollTo(0, 0);
    } else {
      window.scrollTo(0, scrolls.current[page] || 0);
    }
  }, [page, overlay]);

  // Кнопка «Назад» в Telegram: сначала закрывает чат, потом объявление
  useEffect(() => {
    const bb = tg?.BackButton;
    if (!bb) return;
    if (chatId || selected) {
      const handler = chatId ? closeChat : closeItem;
      bb.show();
      bb.onClick(handler);
      return () => bb.offClick(handler);
    }
    bb.hide();
  }, [selected, chatId]);

  useEffect(() => {
    tg?.ready();
    tg?.expand();
    // иначе свайп вниз сворачивает мини-апп вместо обновления ленты
    tg?.disableVerticalSwipes?.();
    tg?.setHeaderColor?.("#f4f7ff");
    tg?.setBackgroundColor?.("#f4f7ff");
    tg?.setBottomBarColor?.("#ffffff");
  }, []);

  const handleCreated = () => {
    omonat.reload();
    scrolls.current.home = 0; // лента откроется сверху, где новое объявление
    setHomeVersion((v) => v + 1);
    changePage("profile");
  };

  const showTabs = !overlay;

  return (
    <>
      <main className="page">
        {/* Вкладки: всегда смонтированы, видна только активная */}
        <div hidden={!showTabs}>
          <Tab active={page === "home"}>
            <Home
              onOpen={openItem}
              active={page === "home" && showTabs}
              version={homeVersion}
            />
          </Tab>
          <Tab active={page === "chats"}>
            <Chats onOpenChat={openChatFromList} />
          </Tab>
          <Tab active={page === "saved"}>
            <Saved onOpen={openItem} />
          </Tab>
          <Tab active={page === "profile"}>
            <Profile
              user={user}
              error={error}
              omonat={omonat}
              onOpen={openItem}
            />
          </Tab>
          {/* форма монтируется заново, чтобы сбрасываться */}
          {page === "add" && (
            <div className="tab">
              <AddOmonat onCreated={handleCreated} />
            </div>
          )}
        </div>

        {/* Экраны поверх вкладок: key заставляет анимацию играть при смене */}
        {chatId ? (
          <div key={`chat-${chatId}`} className="view">
            <ChatRoom id={chatId} onBack={closeChat} />
          </div>
        ) : selected ? (
          <div key={`item-${selected.id ?? "x"}`} className="view">
            <OmonatDetail
              item={selected}
              onBack={closeItem}
              onOpenChat={openChat}
            />
          </div>
        ) : null}
      </main>

      {showTabs && <BottomBar page={page} onChange={changePage} />}
    </>
  );
}