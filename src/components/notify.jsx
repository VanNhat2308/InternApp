import { useContext, useEffect, useState } from "react";
import ResponNav from "./responsiveNav";
import Header from "./header";
import avatar from "../assets/images/avatar.png"
import NotificationItem from "./notifyItem";
import Pusher from "pusher-js";
import echo from "../service/echo";
import axiosClient from "../service/axiosClient";
import { NotificationContext } from "../context/NotificationProvider";
function Notify() {
  const { unreadCount,setUnreadCount } = useContext(NotificationContext);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1025);
    const [notifications, setNotifications] = useState([]); 
    const userRole = localStorage.getItem('role')
const adminId = localStorage.getItem('maAdmin')
const maSV = localStorage.getItem('maSV')
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
          const handleResize = () => {
            setIsMobile(window.innerWidth < 1025);
          };
      
          window.addEventListener('resize', handleResize);
          return () => window.removeEventListener('resize', handleResize);
        }, []);
    
      useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axiosClient.get(`/notifications?user_id=${adminId||maSV}&type=${SwapType(userRole)}`);
        setNotifications(res.data);
      } catch (err) {
        console.error("Lỗi khi tải thông báo:", err);
      }
    };
    fetchNotifications();
  }, [adminId,maSV]);

   useEffect(() => {
    // Nếu URL là /admin/notify thì gọi API mark-as-read
    if (location.pathname === "/admin/notify" || location.pathname === "/student/notify" ) {
      axiosClient.post("/notifications/mark-as-read", {
        user_id: adminId || maSV,
        type: SwapType(userRole)
      }).then((res)=>{
        setUnreadCount(0)
      })
      .catch(err => {
        console.error("Lỗi:", err);
      });
    }
  }, [location.pathname]);

const handleDeleteAll = async () => {
  if (!window.confirm("Bạn có chắc muốn xóa tất cả thông báo?")) return;

  try {
      setNotifications([]);
    await axiosClient.delete("/notifications/delete-all", {
      data: { user_id: adminId } 
    });
  
  } catch (error) {
    console.error(error);
  }
};

 


    
    return ( 
   <div className="flex-1">
  {isMobile ? (
    <ResponNav />
  ) : (
    <Header>
      <div className="flex justify-between items-center w-full">
        <div>
          <h2 className="text-xl font-semibold">Thông Báo</h2>
          <p className="flex gap-2 items-center">Tất Cả Thông Báo</p>
        </div>
      </div>
    </Header>
  )}
  <div className="mt-2 flex justify-end">   {notifications.length > 0 && (
          <button
            onClick={handleDeleteAll}
            className="cursor-pointer px-2 pt-3 text-gray-600 rounded hover:text-red-600"
          >
            Xóa tất cả
          </button>
        )}</div>

  {notifications.length === 0 ? (
    <div className="text-center text-2xl font-medium mt-10">
      Chưa có thông báo nào !!!
    </div>
  ) : (
    <div className="border border-gray-100 rounded-md p-3 mt-2 max-h-screen overflow-y-auto">
      {notifications.map((n, index) => (
        <NotificationItem
          key={index}
          avatar={n.avatar}
          title={n.title}
          message={n.message}
          time={n.time}
        />
      ))}
    </div>
  )}
</div>
 );
}

export default Notify;