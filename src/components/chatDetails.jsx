import { useEffect, useRef, useState } from "react";
import avatar from "../assets/images/avatar.png";
import { FiSearch, FiSend } from "react-icons/fi";
import { FaMicrophoneAlt } from "react-icons/fa";
import { GrAttachment } from "react-icons/gr";
import { FaRegTrashCan } from "react-icons/fa6";
import { BiDotsVertical } from "react-icons/bi";
import axiosClient from "../service/axiosClient";
import { useNavigate, useParams } from "react-router-dom";
import echo from "../service/echo";

export default function ChatDetails() {
  const { idSlug } = useParams();
  const [messagesRecent, setMessagesRecent] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedConversationId, setSelectedConversationId] = useState(idSlug);
  const [conversations, setConversations] = useState({});
  const [newMsg, setNewMsg] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
    useEffect(() => {
  const handler = setTimeout(() => {
    setDebouncedSearchTerm(searchTerm);
  }, 500); // 500ms delay

  return () => {
    clearTimeout(handler);
  };
}, [searchTerm]);

  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const path =
    role === "Student"
      ? `/messages/feedback-panel-student`
      : `messages/feedback-panel`;
  const id =
    role === "Student"
      ? localStorage.getItem("maSV")
      : localStorage.getItem("maAdmin");
  const hasMarkedAsRead = useRef(false);
  const swapUser = (r) => {
    switch (r) {
      case "Student":
        return "sinhvien";
      case "Admin":
        return "admin";
      default:
        return "";
    }
  };
  const messagesEndRef = useRef(null);
  //
  const checkIfMessagesViewed = () => {
    const container = messageContainerRef.current;
    if (!container || hasMarkedAsRead.current) return;

    const scrollable = container.scrollHeight > container.clientHeight;

    const isBottom =
      container.scrollHeight - container.scrollTop <=
      container.clientHeight + 10;

    if (!scrollable || isBottom) {
      // Nếu không cần scroll hoặc đã chạm đáy => đánh dấu đã đọc
      axiosClient.post("/messages/mark-as-read", {
        conversation_id: selectedConversationId,
        user_id: currentUser.id,
        user_role: currentUser.from_role,
      });
      hasMarkedAsRead.current = true;
    }
  };

  // Mỗi khi tin nhắn thay đổi
  const messageContainerRef = useRef(null);

  const handleScroll = () => {
    checkIfMessagesViewed();
    const container = messageContainerRef.current;
    if (!container) return;

    const isBottom =
      container.scrollHeight - container.scrollTop <=
      container.clientHeight + 10;

    if (isBottom && !hasMarkedAsRead.current) {
      axiosClient.post("/messages/mark-as-read", {
        conversation_id: selectedConversationId,
        user_id: currentUser.id,
        user_role: currentUser.from_role,
      });

      hasMarkedAsRead.current = true; // ✅ Đánh dấu đã gọi
    }
  };

  const currentUser = { id: id, name: "Tôi", from_role: swapUser(role) };

  useEffect(() => {
    setSelectedConversationId(idSlug);
  }, [idSlug]);

  useEffect(() => {
    if (!idSlug || !messagesRecent.length) return;

    const foundUser = messagesRecent.find((u) => u.conversation_id == idSlug);
    if (foundUser) {
      setSelectedUserId(foundUser.id);
    }
  }, [idSlug, messagesRecent]);

  // Lấy danh sách sinh viên nhắn tin gần nhất
useEffect(() => {
  setLoading(true); // Bắt đầu loading

  axiosClient
    .get(path, {
      params: {
        id: id,
        search: debouncedSearchTerm,
      },
    })
    .then((res) => {
      setMessagesRecent(res.data);
    })
    .catch((err) => {
      console.error("Lỗi khi lấy tin nhắn gần đây:", err);
    })
    .finally(() => {
      setLoading(false); // Kết thúc loading dù thành công hay thất bại
    });
}, [debouncedSearchTerm]);


  // Lấy tin nhắn của 1 conversation
  useEffect(() => {
    if (!selectedConversationId) return;

    axiosClient
      .get(`/messages/conversation/${selectedConversationId}`)
      .then((res) => {
        setConversations((prev) => ({
          ...prev,
          [selectedUserId]: res.data,
        }));
      });
  }, [selectedConversationId, selectedUserId]);

  const selectedUser = messagesRecent.find((u) => u.id === selectedUserId);
  const messages = conversations[selectedUserId] || [];
  
  useEffect(() => {
    checkIfMessagesViewed();
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  const sendMessage = () => {
    if (!newMsg.trim()) return;

    const newMessage = {
      from_id: currentUser.id,
      from_role: currentUser.from_role,
      to_id: selectedUserId,
      to_role: currentUser.from_role === "admin" ? "sinhvien" : "admin", // đảo ngược lại
      type: "text",
      content: newMsg,
      conversation_id: selectedConversationId,
    };

    setConversations((prev) => ({
      ...prev,
      [selectedUserId]: [...(prev[selectedUserId] || []), newMessage],
    }));

    setNewMsg("");
    axiosClient.post("/messages", newMessage);
  };
  // const userRole = localStorage.getItem('role')

  // realtime pusher
  useEffect(() => {
    const channel = echo.channel(`chat.${currentUser.id}`);
    channel.listen("NewMessage", (e) => {
      const msg = e.message;
      if (msg.conversation_id === Number(selectedConversationId)) {
        setConversations((prev) => ({
          ...prev,
          [selectedUserId]: [...(prev[selectedUserId] || []), msg],
        }));

        hasMarkedAsRead.current = false;
      }
    });

    return () => {
      echo.leave(`chat.${currentUser.id}`);
    };
  }, [selectedConversationId, selectedUserId]);

  return (
    <div className="flex flex-col md:flex-row border border-gray-100 rounded-md overflow-hidden mt-8">
      {/* Sidebar */}
      <div
        className={`md:w-1/3 w-full ${
          showSidebar ? "block" : "hidden"
        } md:block md:border-r border-gray-100 p-4 overflow-y-auto`}
      >
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
         {loading? (
                <div className="flex justify-center items-center py-10">
            <div role="status">
        <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-green-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
        <span className="sr-only">Loading...</span>
    </div>
            </div>
              ) : (<>
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
                {user.preview || "Tin nhắn gần đây..."}
              </p>
            </div>
          </div>
        ))}</>)}
      </div>

      {/* Chat content */}
      <div className="flex-1 flex flex-col w-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex flex-wrap gap-2 items-center justify-between bg-white">
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

          {role === "Student" ? (
            ""
          ) : (
            <button
              type="button"
              className="cursor-pointer group relative py-2.5 px-5 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-full hover:bg-gray-100 hover:text-red-600 transition-all focus:outline-none focus:ring-4 focus:ring-gray-100 flex items-center gap-2"
            >
              <FaRegTrashCan className="text-base" />
              <span className="hidden lg:inline">Xóa</span>

              {/* Tooltip cho mobile */}
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs bg-black text-white rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-10 shadow-md lg:hidden">
                Xóa đoạn chat
              </span>
            </button>
          )}
        </div>

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3"
          ref={messageContainerRef}
          onScroll={handleScroll}
        >
          {messages.map((msg, i) => {
            const isMe =
              msg.from_id == currentUser.id &&
              msg.from_role == currentUser.from_role;

            if (msg.content===""){
              return;
            }

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
          <div ref={messagesEndRef}></div>
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
