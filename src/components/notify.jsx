import { useEffect, useState } from "react";
import ResponNav from "./responsiveNav";
import Header from "./header";
import avatar from "../assets/images/avatar.png"
import NotificationItem from "./notifyItem";

function Notify() {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1025);
        useEffect(() => {
          const handleResize = () => {
            setIsMobile(window.innerWidth < 1025);
          };
      
          window.addEventListener('resize', handleResize);
          return () => window.removeEventListener('resize', handleResize);
        }, []);
        // data
        const notifications = [
  {
    avatar: avatar,
    title: 'Phản Hồi Từ Phạm Văn A',
    message: 'Phạm Văn A đã gửi cho bạn một phản hồi',
    time: 'Mới gửi',
  },
  {
    avatar: avatar,
    title: 'Phản Hồi Từ Lê Thị B',
    message: 'Lê Thị B đã gửi cho bạn một phản hồi',
    time: '11:16 AM',
  },
  {
    avatar: avatar,
    title: 'Task Mới Đã Được Thêm Vào',
    message: 'Task mới đã được thêm vào và sinh viên đã có thể thấy',
    time: '09:00 AM',
  },
  {
    avatar: avatar,
    title: 'Trần Văn D Đã Gửi Báo Cáo',
    message: 'Trần Văn D đã gửi cho bạn báo cáo thực tập',
    time: 'Hôm qua',
  },
  {
    avatar: avatar,
    title: 'Phạm Văn A Đề Xuất Dời Lịch',
    message: 'Phạm Văn A có đề xuất muốn dời lịch bấm vào để kiểm tra',
    time: 'Hôm qua',
  },
];
    
    return ( 
    <div className="flex-1">
    {isMobile ? <ResponNav /> : <Header>
       <h2 className="text-xl font-semibold">Thông Báo</h2>
          <p className="flex gap-2 items-center">Tất Cả Thông Báo</p>
      </Header>}

       <div className="border border-gray-300 rounded-md p-3 shadow mt-10">
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

    
    </div> );
}

export default Notify;