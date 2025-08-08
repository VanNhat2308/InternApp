import { IoNotificationsOutline } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";

export default function NotificationIcon({ unreadCount, isNotifyActive, handleNotify }) {
  return (
    <div
      onClick={handleNotify}
      className={`relative cursor-pointer aspect-square flex items-center justify-center rounded-md h-full text-2xl ${
        isNotifyActive ? "bg-green-100" : "bg-gray-200"
      }`}
    >
      <IoNotificationsOutline className={`${isNotifyActive ? "text-green-500" : ""}`} />

      {/* Hiển thị badge nếu có thông báo */}
      <AnimatePresence mode="wait">
        {unreadCount > 0 && (
          <motion.span
            key={unreadCount} // đổi key mỗi khi số thay đổi => pop animation
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 20 }}
            className="absolute -top-1 -right-1 flex h-5 w-5"
          >
            {/* Sóng lan animate-ping */}
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            
            {/* Badge chứa số */}
            <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 text-white text-xs items-center justify-center font-bold">
              {unreadCount}
            </span>
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
