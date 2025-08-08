import { useEffect, useState } from "react";
import ResponNav from "./responsiveNav";
import Header from "./header";
import avatar from "../assets/images/avatar.png"
import NotificationItem from "./notifyItem";
import Pusher from "pusher-js";
import echo from "../service/echo";
import axiosClient from "../service/axiosClient";
function Notify() {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1025);
    const [notifications, setNotifications] = useState([]); 
    const adminId = localStorage.getItem('maAdmin')  
    
    useEffect(() => {
          const handleResize = () => {
            setIsMobile(window.innerWidth < 1025);
          };
      
          window.addEventListener('resize', handleResize);
          return () => window.removeEventListener('resize', handleResize);
        }, []);
    
      useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axiosClient.get(`/notifications?user_id=${adminId}&type=admin`);
        setNotifications(res.data);
      } catch (err) {
        console.error("Lỗi khi tải thông báo:", err);
      }
    };
    fetchNotifications();
  }, [adminId]);

 


    
    return ( 
    <div className="flex-1">
    {isMobile ? <ResponNav /> : <Header>
       <h2 className="text-xl font-semibold">Thông Báo</h2>
          <p className="flex gap-2 items-center">Tất Cả Thông Báo</p>
      </Header>}

       
       {notifications.length===0?(
        <div className="text-center text-2xl font-medium mt-10">
          Chưa có thông báo nào !!!
        </div>
       ):(<div className="border border-gray-300 rounded-md p-3 shadow mt-10">
      {notifications.map((n, index) => (
        <NotificationItem
          key={index}
          avatar={n.avatar}
          title={n.title}
          message={n.message}
          time={n.time}
        />
      ))}
    </div>)}

    
    </div> );
}

export default Notify;