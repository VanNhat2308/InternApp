import { useState } from "react";
import {
  FiSearch,
  FiSend
} from "react-icons/fi";
import {
  FaMicrophoneAlt
} from "react-icons/fa";
import { GrAttachment } from "react-icons/gr";
import { FaRegTrashCan } from "react-icons/fa6";
import { BiDotsVertical } from "react-icons/bi";


const currentUser = { id: 1, name: "Tôi" };

const users = [
  {
    id: 2,
    name: "Phạm Văn A",
    avatar: "https://randomuser.me/api/portraits/men/11.jpg",
  },
  {
    id: 3,
    name: "Trần Thị B",
    avatar: "https://randomuser.me/api/portraits/women/21.jpg",
  },
];

const dummyConversations = {
  2: [
    { from_user_id: 2, to_user_id: 1, type: "text", content: "Chào anh ạ" },
    { from_user_id: 1, to_user_id: 2, type: "text", content: "Chào em" },
  ],
  3: [
    { from_user_id: 3, to_user_id: 1, type: "text", content: "Báo cáo đến đâu rồi anh?" },
    { from_user_id: 1, to_user_id: 3, type: "text", content: "Tôi đang kiểm tra" },
  ],
};

export default function ChatDetails() {
  const [selectedUserId, setSelectedUserId] = useState(users[0].id);
  const [conversations, setConversations] = useState(dummyConversations);
  const [newMsg, setNewMsg] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);

  const selectedUser = users.find((u) => u.id === selectedUserId);
  const messages = conversations[selectedUserId] || [];

  const sendMessage = () => {
    if (!newMsg.trim()) return;
    const newMessage = {
      from_user_id: currentUser.id,
      to_user_id: selectedUserId,
      type: "text",
      content: newMsg,
    };
    setConversations((prev) => ({
      ...prev,
      [selectedUserId]: [...(prev[selectedUserId] || []), newMessage],
    }));
    setNewMsg("");
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-80px)] border border-gray-300 rounded-md overflow-hidden lg:shadow mt-8">
      
      {/* Sidebar */}
      <div className={`md:w-1/3 w-full md:block ${showSidebar ? "block" : "hidden"} md:border-r border-gray-300 p-4 overflow-y-auto`}>
        <div className="relative mb-3">
          <FiSearch className="absolute top-1/2 left-2 transform -translate-y-1/2 text-gray-400" />
          <input
            className="pl-8 w-full py-2 border border-gray-300 rounded-md"
            type="text"
            placeholder="Tìm kiếm"
          />
        </div>

        {users.map((user) => (
          <div
            key={user.id}
            onClick={() => {
              setSelectedUserId(user.id);
              setShowSidebar(false); // ẩn khi chọn trong mobile
            }}
            className={`flex items-center gap-3 p-2 rounded-md cursor-pointer mb-2 ${
              selectedUserId === user.id
                ? "bg-green-100"
                : "hover:bg-gray-100"
            }`}
          >
            <img
              src={user.avatar}
              className="w-10 h-10 rounded-full object-cover"
              alt={user.name}
            />
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-gray-500 truncate">
                Tin nhắn gần đây...
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Chat content */}
      <div className="flex-1 flex flex-col w-full">
        {/* Header */}
       <div className="p-4 border-b border-gray-300 flex flex-wrap gap-2 items-center justify-between bg-white">
  <div className="flex items-center gap-1">
    <button
      className="md:hidden px-2 py-1 rounded text-sm mr-2"
      onClick={() => setShowSidebar(!showSidebar)}
    >
      <BiDotsVertical />
    </button>
    <img
      src={selectedUser.avatar}
      className="w-10 h-10 rounded-full object-cover"
      alt={selectedUser.name}
    />
    <h3 className="font-semibold text-lg">{selectedUser.name}</h3>
  </div>

  {/* Button Delete - responsive */}
  <button
    // onClick={() => handleDelete()}
    className="group relative px-2 lg:px-4 py-2 flex items-center gap-2 border border-gray-300 rounded-md cursor-pointer hover:text-red-500"
  >
    <FaRegTrashCan className="text-lg" />
    <span className="hidden lg:inline">Xóa</span>

    {/* Tooltip khi chỉ là icon */}
    <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-gray-700 text-white rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-all lg:hidden">
      Xóa đoạn chat
    </span>
  </button>
</div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3">
          {messages.map((msg, i) => {
            const isMe = msg.from_user_id === currentUser.id;
            return (
              <div
                key={i}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-4 py-2 max-w-xs break-words ${
                    isMe
                      ? "bg-green-500 text-white rounded-tl-2xl rounded-bl-2xl rounded-br-2xl"
                      : "bg-gray-300 text-black rounded-tr-2xl rounded-bl-2xl rounded-br-2xl"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            );
          })}
        </div>

        {/* Input */}
        <div className="p-4 flex items-center gap-2 border-t border-gray-200 bg-white">
          <div className="flex-1 h-[40px] relative">
            <textarea
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              rows="1"
              className="w-full h-full border border-gray-300 p-2 pr-10 rounded-2xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-300"
              placeholder="Nhập tin nhắn..."
            />
            <GrAttachment className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 cursor-pointer" />
          </div>
          <button className="text-2xl text-green-500 hover:text-green-600">
            <FaMicrophoneAlt />
          </button>
          <button
            onClick={sendMessage}
            className="text-2xl text-green-500 hover:text-green-600"
          >
            <FiSend />
          </button>
        </div>
      </div>
    </div>
  );
}
