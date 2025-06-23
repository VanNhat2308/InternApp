import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import avatar from "../assets/images/avatar.png";

function FeedbackPanel() {
  const messages = [
    {
      id: 1,
      name: "Phạm Văn A",
      avatar: avatar,
      preview: "Anh ơi cho em xin hỏi là báo cáo deadline đến ...",
      time: "Mới gửi",
      unread: true,
    },
    {
      id: 2,
      name: "Lê Thị B",
      avatar: avatar,
      preview: "Cho em hỏi là chức năng này làm sao vậy ạ ...",
      time: "11:16 AM",
    },
    {
      id: 3,
      name: "Lê Văn D",
      avatar: avatar,
      preview: "Cho em hỏi là hệ thống của mình đang bị lỗi ạ ...",
      time: "09:00 AM",
    },
    {
      id: 4,
      name: "Trần Văn D",
      avatar: avatar,
      preview: "Anh ơi cho em xin hỏi là báo cáo deadline đến ...",
      time: "Hôm qua",
    },
  ];

  const navigate = useNavigate();

  return (
    <div className="border border-gray-300 lg:rounded-xl shadow-md mt-10 p-4 bg-white max-w-full w-full lg:w-full mx-auto">
      {/* Search */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
        />
        <FiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
      </div>

      {/* Message list */}
      <div className="space-y-3 max-h-[65vh] overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            onClick={() => navigate(`/admin/feedback/conversation/${msg.id}`)}
            className={`flex items-center justify-between cursor-pointer hover:bg-gray-100 px-3 py-2 rounded-lg transition`}
          >
            <div className="flex items-center gap-3">
              <img
                src={msg.avatar}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex flex-col">
                <span className="font-medium text-sm md:text-base">{msg.name}</span>
                <span className="text-sm text-gray-500 truncate max-w-[180px]">
                  {msg.preview}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end text-xs text-gray-500 min-w-[60px]">
              {msg.unread && (
                <div className="w-2 h-2 bg-red-500 rounded-full mb-1" />
              )}
              <span>{msg.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FeedbackPanel;
