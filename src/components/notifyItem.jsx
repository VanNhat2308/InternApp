const NotificationItem = ({ avatar, title, message, time }) => {
  return (
    <div className="flex items-start gap-3 p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-200 last:border-none">
      <img src={avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
      <div className="flex-1">
        <p className="font-bold text-lg text-gray-900">{title}</p>
        <p className="text-base text-gray-600">{message}</p>
      </div>
      <div className="text-base text-gray-400 whitespace-nowrap">{time}</div>
    </div>
  );
};

export default NotificationItem;
