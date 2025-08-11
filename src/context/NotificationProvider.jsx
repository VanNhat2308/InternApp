import { createContext, useState, useEffect } from "react";
import echo from "../service/echo";
import axiosClient from "../service/axiosClient";


export const NotificationContext = createContext();

export default function NotificationProvider({ children }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const adminId = localStorage.getItem("maAdmin");
  const maSV = localStorage.getItem('maSV')
  const role = localStorage.getItem('role')
  
  
  const SwapType = (t)=>{
    switch (t) {
      case "Admin":
        return "admin"
        case "Student"
        :return "sinhvien"
    
      default:
        break;
    }
  }

  useEffect(() => {
  
    axiosClient
      .get(`/notifications/unread-count`, {
        params: { user_id: adminId || maSV, type: SwapType(role) },
      })
      .then((res) => {
        setUnreadCount(res.data.unread_count);
  
        
      })
      .catch((err) => {
        console.error("Error fetching unread notifications:", err);
      });
        }, [adminId, maSV]);

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
