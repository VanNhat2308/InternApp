import { useNavigate } from "react-router-dom";
import avatar from '../assets/images/avatar.png'
function FeedbackPanel() {
    const messages = [
  {
    id: 1,
    name: "Phạm Văn A",
    avatar: avatar,
    preview: "Anh ơi cho em xin hỏi là báo cáo dead line đến ...",
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
    avatar:  avatar,
    preview: "Anh ơi cho em xin hỏi là báo cáo dead line đến ...",
    time: "Hôm qua",
  },
];
   const navigate = useNavigate();

  return (
    <div className="border border-gray-300 rounded-xl shadow mt-10 p-4">
      <input
        type="text"
        placeholder="Tìm kiếm"
        className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg"
      />
      <div className="space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="flex items-center justify-between cursor-pointer hover:bg-gray-100 p-2 rounded-lg"
            onClick={() => navigate(`/admin/feedback/conversation/${msg.id}`)}
          >
            <div className="flex items-center gap-3">
              <img
                src={msg.avatar}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex flex-col">
                <span className="font-medium">{msg.name}</span>
                <span className="text-sm text-gray-500 truncate max-w-[180px]">{msg.preview}</span>
              </div>
            </div>
            <div className="text-right text-xs text-gray-400">
              {msg.unread && <div className="w-2 h-2 bg-red-500 rounded-full mb-1 ml-auto" />}
              <span>{msg.time||'1'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FeedbackPanel;