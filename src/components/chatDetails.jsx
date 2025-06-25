import { useEffect, useState } from "react";
import avatar from "../assets/images/avatar.png";
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
import axiosClient from "../service/axiosClient";
import { useNavigate, useParams } from "react-router-dom";

const currentUser = { id: 1, name: "Tôi" };

export default function ChatDetails() {
  const {idSlug} = useParams()
  const [messagesRecent, setMessagesRecent] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedConversationId, setSelectedConversationId] = useState(idSlug);
  const [conversations, setConversations] = useState({});
  const [newMsg, setNewMsg] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  
 

  useEffect(() => {
  setSelectedConversationId(idSlug);
}, [idSlug]);

useEffect(() => {
  if (!idSlug || !messagesRecent.length) return;

  const foundUser = messagesRecent.find(u => u.conversation_id == idSlug);
  if (foundUser) {
    setSelectedUserId(foundUser.id);
  }
}, [idSlug, messagesRecent]);

  // Lấy danh sách sinh viên nhắn tin gần nhất
  useEffect(() => {
    axiosClient.get(`messages/feedback-panel`, {
      params: { search: searchTerm }
    }).then(res => {
      setMessagesRecent(res.data);
    });
  }, [searchTerm]);

  // Lấy tin nhắn của 1 conversation
  useEffect(() => {
    if (!selectedConversationId) return;

    axiosClient.get(`/messages/conversation/${selectedConversationId}`)
      .then(res => {
        setConversations(prev => ({
          ...prev,
          [selectedUserId]: res.data
        }));
      });
  }, [selectedConversationId, selectedUserId]);

  const selectedUser = messagesRecent.find(u => u.id === selectedUserId);
  const messages = conversations[selectedUserId] || [];

  const sendMessage = () => {
    if (!newMsg.trim()) return;

    const newMessage = {
      from_id: currentUser.id,
      from_role: 'admin',
      to_id: selectedUserId,
      to_role:'sinhvien',
      type: "text",
      content: newMsg,
      conversation_id: selectedConversationId
    };

    setConversations(prev => ({
      ...prev,
      [selectedUserId]: [...(prev[selectedUserId] || []), newMessage],
    }));

    setNewMsg("");
    axiosClient.post('/messages', newMessage);
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-80px)] border border-gray-300 rounded-md overflow-hidden lg:shadow mt-8">
      
      {/* Sidebar */}
      <div className={`md:w-1/3 w-full ${showSidebar ? "block" : "hidden"} md:block md:border-r border-gray-300 p-4 overflow-y-auto`}>
        <div className="relative mb-3">
          <FiSearch className="absolute top-1/2 left-2 transform -translate-y-1/2 text-gray-400" />
          <input
            className="pl-8 w-full py-2 border border-gray-300 rounded-md"
            type="text"
            placeholder="Tìm kiếm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {messagesRecent.map((user) => (
          <div
            key={user.id}
          onClick={() => {
  setSelectedUserId(user.id);
  setSelectedConversationId(user.conversation_id);
  navigate(`/admin/feedback/conversation/${user.conversation_id}`); // ✅ cập nhật URL param
  setShowSidebar(false);
}}

            className={`flex items-center gap-3 p-2 rounded-md cursor-pointer mb-2 ${
              selectedUserId === user.id ? "bg-green-100" : "hover:bg-gray-100"
            }`}
          >
            <img
              src={avatar}
              className="w-10 h-10 rounded-full object-cover"
              alt={user.name}
            />
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-gray-500 truncate max-w-[180px]">
                {user.preview || 'Tin nhắn gần đây...'}
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
            {selectedUser && (
              <>
                <img
                  src={avatar}
                  className="w-10 h-10 rounded-full object-cover"
                  alt={selectedUser.name}
                />
                <h3 className="font-semibold text-lg">{selectedUser.name}</h3>
              </>
            )}
          </div>

          <button
            className="group relative px-2 lg:px-4 py-2 flex items-center gap-2 border border-gray-300 rounded-md cursor-pointer hover:text-red-500"
          >
            <FaRegTrashCan className="text-lg" />
            <span className="hidden lg:inline">Xóa</span>
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-gray-700 text-white rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-all lg:hidden">
              Xóa đoạn chat
            </span>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3">
          {messages.map((msg, i) => {
            const isMe = msg.from_id === currentUser.id;
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
