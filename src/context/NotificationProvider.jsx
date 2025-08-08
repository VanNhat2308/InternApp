import { createContext, useState, useEffect } from "react";
import echo from "../service/echo";


export const NotificationContext = createContext();

export default function NotificationProvider({ children }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const adminId = localStorage.getItem("adminId");

  useEffect(() => {
    if (!adminId) return;

    const channel = echo.private(`admin.${adminId}`);

    channel.listen("notification.received", (data) => {
      // Cập nhật danh sách + số lượng chưa đọc
      setNotifications((prev) => [data.notification, ...prev]);
      setUnreadCount(data.unreadCount);
    });

    return () => {
      echo.leave(`private-admin.${adminId}`);
    };
  }, [adminId]);

  return (
    <NotificationContext.Provider
      value={{
        unreadCount,
        setUnreadCount,
        notifications,
        setNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
