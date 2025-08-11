import { FaBell } from "react-icons/fa";

const NotificationItem = ({ avatar, title, message, time }) => {
  return (
    <div className="flex items-start gap-3 p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-200 last:border-none">
        {/* Icon thông báo */}
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
        <FaBell size={20} />
      </div>
      <div className="flex-1">
        <p className="font-bold text-lg text-gray-900">{title}</p>
        <p className="text-base text-gray-600">{message}</p>
      </div>
      <div className="text-base text-gray-400 whitespace-nowrap">{time}</div>
    </div>
  );
};

export default NotificationItem;
