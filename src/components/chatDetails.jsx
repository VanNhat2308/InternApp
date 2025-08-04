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
import dayjs from "dayjs";
import Swal from 'sweetalert2';
export default function ChatDetails() {
  const { idSlug } = useParams();
  const [messagesRecent, setMessagesRecent] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedConversationId, setSelectedConversationId] = useState(idSlug);
  const [conversations, setConversations] = useState({});
  const [newMsg, setNewMsg] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [nameUser, setNameUser] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [loadingRecent, setLoadingRecent] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [notFound, setNotFound] = useState(false);
  useEffect(() => {
    axiosClient
      .get(`/messages/conversationV2/${idSlug}`)
      .then((res) => {
        if (localStorage.getItem("role") === "Admin") {
          setNameUser(res.data.student_name);
        } else {
          setNameUser(res.data.admin_name);
        }
        setNotFound(false); // reset nếu thành công
      })
      .catch((err) => {
        if (err.response && err.response.status === 404) {
          setNotFound(true);
        } else {
          console.error(err);
        }
      });
  }, [idSlug]);

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


const handleFocusMarkAsRead = () => {
 const role = localStorage.getItem("role") === "Admin" ? 'sinhvien':'admin'
  if (hasMarkedAsRead.current || !selectedConversationId) return;

  axiosClient.post("/messages/mark-as-read", {
    conversation_id: selectedConversationId,
    user_id: selectedUserId,
    user_role: role,
  });

  hasMarkedAsRead.current = true;
};

useEffect(() => {
  hasMarkedAsRead.current = false;
}, [selectedConversationId]);


  const currentUser = { id: Number(id), name: "Tôi", from_role: swapUser(role) };

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
const fetchMessagesRecent = async () => {
  setLoadingRecent(true); // Bắt đầu loading

  try {
    const res = await axiosClient.get(path, {
      params: {
        id: id,
        search: debouncedSearchTerm,
      },
    });
    setMessagesRecent(res.data);
  } catch (err) {
    console.error("Lỗi khi lấy tin nhắn gần đây:", err);
  } finally {
    setLoadingRecent(false); // Kết thúc loading dù thành công hay thất bại
  }
};

// Gọi hàm trong useEffect
useEffect(() => {
  fetchMessagesRecent();
}, [debouncedSearchTerm]);


  // Lấy tin nhắn của 1 conversation
const fetchMessagesByConversationId = async () => {
  if (!selectedConversationId || !selectedUserId) return;

  setLoadingMessages(true);

  try {
    const res = await axiosClient.get(`/messages/conversation/${selectedConversationId}`);
    setConversations((prev) => ({
      ...prev,
      [selectedUserId]: res.data,
    }));
  } catch (err) {
    console.error("Lỗi khi lấy tin nhắn:", err);
  } finally {
    setLoadingMessages(false);
  }
};

// Gọi trong useEffect
useEffect(() => {
  if (!selectedConversationId || conversations[selectedUserId]?.length) return;
  fetchMessagesByConversationId();
}, [selectedConversationId, selectedUserId, conversations]);


  const selectedUser = messagesRecent.find((u) => u.id === selectedUserId);
  const messages = conversations[selectedUserId] || [];

 const sendMessage = () => {
  if (!newMsg.trim()) return;

  const tempId = Date.now(); // ID tạm để dễ cập nhật sau
  const newMessage = {
    id: tempId,
    from_id: currentUser.id,
    from_role: currentUser.from_role,
    to_id: selectedUserId,
    to_role: currentUser.from_role === "admin" ? "sinhvien" : "admin",
    type: "text",
    content: newMsg,
    conversation_id: selectedConversationId,
    created_at: new Date().toISOString(),
    sending: true, // trạng thái tạm
  };

  setConversations((prev) => ({
    ...prev,
    [selectedUserId]: [...(prev[selectedUserId] || []), newMessage],
  }));

  setNewMsg("");

axiosClient.post("/messages", newMessage).then((res) => {
  const savedMessage = res.data;
  console.log(savedMessage);
  
  setConversations((prev) => {
    const updatedMessages = (prev[selectedUserId] || []).map((msg) =>
      msg.id == tempId ? { ...savedMessage, sending: false } : msg
    );

    return {
      ...prev,
      [selectedUserId]: updatedMessages,
    };
  });
});

};
  // const userRole = localStorage.getItem('role')

  // realtime pusher
  useEffect(() => {
    const channel = echo.channel(`chat.${currentUser.id}`);
    channel.listen("NewMessage", (e) => {
      const msg = e.message;
      if (msg.conversation_id === Number(selectedConversationId) &&
  msg.from_id !== currentUser.id) {
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

const handleDelete = () => {
  Swal.fire({
    title: 'Bạn có chắc muốn xoá?',
    text: 'Hành động này sẽ xoá toàn bộ tin nhắn và không thể khôi phục!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Xoá',
    cancelButtonText: 'Huỷ',
  }).then((result) => {
    if (result.isConfirmed) {
      axiosClient.delete(`/conversations/${selectedUserId}`)
        .then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Xoá thành công',
            text: 'Cuộc trò chuyện và toàn bộ tin nhắn đã được xoá.',
            timer: 2000,
            showConfirmButton: false,
          }).then(() => {
           navigate('/admin/feedback/feedback-list')
          });
        })
        .catch((err) => {
          console.error("Xoá thất bại", err);
          Swal.fire({
            icon: 'error',
            title: 'Xoá thất bại',
            text: 'Đã xảy ra lỗi khi xoá cuộc trò chuyện.',
          });
        });
    }
  });
};




  return (
    <>
      {notFound ? (
        <div className="flex flex-col items-center justify-center py-10 text-gray-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-20 w-20 text-red-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01M12 3c4.97 0 9 4.03 9 9s-4.03 9-9 9-9-4.03-9-9 4.03-9 9-9z"
            />
          </svg>
          <h2 className="text-xl font-semibold text-red-500">
            Không tìm thấy cuộc trò chuyện
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Cuộc trò chuyện này có thể đã bị xoá hoặc không tồn tại.
          </p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row border border-gray-100 rounded-md overflow-hidden mt-5">
          {/* Sidebar */}
          <div
            className={`md:w-1/3 w-full ${
              showSidebar ? "block" : "hidden"
            } md:block md:border-r border-gray-100 p-4 overflow-y-auto`}
          >
            <h2 className="text-2xl font-bold mb-3">Tin nhắn gần đây</h2>
            <div className="relative mb-3">
              <FiSearch className="absolute top-1/2 left-2 transform -translate-y-1/2 text-gray-400" />
              <input
                className="pl-8 w-full py-2 border border-gray-300 rounded-md focus:outline-2 focus:outline-green-200"
                type="text"
                placeholder="Tìm kiếm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {loadingRecent ? (
              <div className="flex justify-center items-center py-10">
                <div role="status">
                  <svg
                    aria-hidden="true"
                    className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-green-500"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : (
              <>
                {messagesRecent.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => {
                      setSelectedUserId(user.id);
                      setSelectedConversationId(user.conversation_id);
                      navigate(
                        `/admin/feedback/conversation/${user.conversation_id}`
                      ); // ✅ cập nhật URL param
                      setShowSidebar(false);
                    }}
                    className={`flex items-center gap-3 p-2 rounded-md cursor-pointer mb-2 ${
                      selectedUserId === user.id
                        ? "bg-green-100"
                        : "hover:bg-gray-100"
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
                ))}
              </>
            )}
          </div>

          {/* Chat content */}
          <div className="flex-1 flex flex-col w-full h-full">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex flex-wrap gap-2 items-center justify-between bg-white">
              <div className="flex items-center gap-1">
                <button
                  className="md:hidden px-2 py-1 rounded text-sm mr-2"
                  onClick={() => setShowSidebar(!showSidebar)}
                >
                  <BiDotsVertical />
                </button>
                {(selectedUser || nameUser) && (
                  <>
                    <img
                      src={avatar}
                      className="w-10 h-10 rounded-full object-cover"
                      alt={nameUser}
                    />
                    <h3 className="font-semibold text-lg">{nameUser}</h3>
                  </>
                )}
              </div>

              {role === "Student" ? (
                ""
              ) : (
                <button
                  type="button"
                  onClick={handleDelete}
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
              style={{ minHeight: "calc(100vh - 280px)" }}
              className="flex-1 overflow-y-auto bg-gray-50"
            >
              {loadingMessages ? (
                <div className="flex justify-center items-center py-10">
                  <div role="status">
                    <svg
                      aria-hidden="true"
                      className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-green-500"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              ) : (
                
<div
  className="flex-1 overflow-y-auto max-h-[700px] p-4" 
>
  {messages.map((msg, i) => {
 
    const isMe =
      msg.from_id == currentUser.id && msg.from_role == currentUser.from_role;

    
    if (!msg.content) return;

    const time = dayjs(msg.created_at).format("HH:mm");
    const date = dayjs(msg.created_at).format("DD/MM/YYYY");

    // Hiển thị ngày nếu ngày này khác với tin nhắn trước đó
    const showDate =
      i === 0 ||
      dayjs(msg.created_at).format("DD/MM/YYYY") !==
        dayjs(messages[i - 1]?.created_at).format("DD/MM/YYYY");

      // Kiểm tra điều kiện để hiển thị time (là tin nhắn cuối cùng trong cụm ≤ 5 phút)
  const isLastInGroup = (() => {
    const next = messages[i + 1];
    if (!next) return true; // Tin cuối cùng

    const sameSender =
      next.from_id === msg.from_id && next.from_role === msg.from_role;

    const timeDiff =
      dayjs(next.created_at).diff(dayjs(msg.created_at), "minute");

    return !(sameSender && timeDiff <= 5);
  })();

    return (
      <div key={i} className="space-y-1">
        {showDate && (
          <div className={`text-center text-sm text-gray-400 my-2`}>{date}</div>
        )}

        <div className={`flex ${isMe ? "justify-end" : "justify-start"} `}>
          <div className={`flex flex-col max-w-xs ${isLastInGroup?'mb-10':'mb-1'}`}>
            <div
              className={`px-4 py-2 break-words  ${
                isMe
                  ? "bg-green-500 text-white rounded-tl-2xl rounded-bl-2xl rounded-br-2xl"
                  : "bg-gray-300 text-black rounded-tr-2xl rounded-bl-2xl rounded-br-2xl"
              }`}
            >
              {msg.content}
                 {isLastInGroup && (
            <div
              className={`text-xs mt-1 text-left ${
                isMe ? "text-white" : "text-gray-500"
              }`}
            >
              {time}
            </div>
          )}
            </div>
             {msg.from_id === currentUser.id && msg.sending === true && (
    <div className="text-xs text-right">
      Đang gửi...
    </div>
  )}
           
          </div>
        </div>
      </div>
    );
  })}
 
</div>

              )}
            </div>

            {/* Input */}
            <div className="p-4 flex items-center gap-2 border-t border-gray-200 bg-white">
              <div className="flex-1 h-[40px] relative">
                <textarea
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                   onFocus={handleFocusMarkAsRead}
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
      )}
    </>
  );
}
