import { useState } from "react";
import { FiSearch, FiSend } from "react-icons/fi";
import { AiOutlinePaperClip } from "react-icons/ai";
import anh1 from "../assets/images/maSelf.jpg"
import anh2 from "../assets/images/taskAvatar.jpg"
import { FaRegTrashCan } from "react-icons/fa6";
import { FaMicrophoneAlt, FaSearch } from "react-icons/fa";
import { GrAttachment } from "react-icons/gr";

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
    <div className="flex h-screen  mt-10 border border-gray-300 rounded-lg overflow-hidden">
      {/* Sidebar users */}
      <div className="w-1/3 border-r border-gray-300 p-4 overflow-y-auto">
        <div className="relative mb-3">
            <FiSearch className="absolute top-[50%] left-2 transform- translate-y-[-50%]"/>
            <input className="pl-8 w-full py-3 border border-gray-300 rounded-md" type="text" placeholder="Tìm kiếm"/>
        </div>
        {users.map((user) => (
          <div
            key={user.id}
            onClick={() => setSelectedUserId(user.id)}
            className={`flex items-center gap-3 p-2 rounded-md cursor-pointer mb-2
              ${selectedUserId === user.id ? "bg-green-100" : "hover:bg-gray-100"}`}
          >
            <img src={user.avatar} className="w-10 h-10 rounded-full object-cover" />
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-gray-500 truncate">Tin nhắn gần đây...</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chat content */}
      <div className="w-2/3 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-300 flex items-center justify-between">
          <div className="flex items-center gap-3">
              <img src={selectedUser.avatar} className="w-10 h-10 rounded-full object-cover" />
              <h3 className="font-semibold text-lg">{selectedUser.name}</h3>
          </div>
          <button className="px-4 py-2 flex items-center gap-2 border border-gray-300 rounded-md cursor-pointer hover:text-red-400">
            <FaRegTrashCan/>
            Xóa
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
          {messages.map((msg, i) => {
            const isMe = msg.from_user_id === currentUser.id;
            return (
              <div key={i} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div
                  className={`px-4 py-2  max-w-xs ${
                    isMe ? "bg-green-500 text-white rounded-tl-2xl rounded-bl-2xl rounded-br-2xl" : "bg-gray-300 rounded-tr-2xl rounded-br-2xl rounded-bl-2xl"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            );
          })}
        </div>

        {/* Input */}
        <div className="p-4 flex items-center gap-2">
          <div className="flex-1 h-[40px] relative ">
            <textarea
  value={newMsg}
  onChange={(e) => setNewMsg(e.target.value)}
  rows="1"
  name="messages"
  className="w-full h-[100%] border border-gray-300 p-2 pr-10 rounded-2xl text-sm resize-none
             focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-100
             transition-all duration-200"
  placeholder="Nhập tin nhắn..."
/>

              <GrAttachment className="absolute text-green-500 right-3 top-[50%] transform- translate-y-[-50%] cursor-pointer"/>
          </div>
          <button
           
            className=" cursor-pointer text-2xl text-green-500 rounded-md hover:text-green-600"
          >
            <FaMicrophoneAlt />
          </button>
          <button
            onClick={sendMessage}
            className=" cursor-pointer text-2xl text-green-500 rounded-md hover:text-green-600"
          >
            <FiSend />
          </button>
        </div>
      </div>
    </div>
  );
}
