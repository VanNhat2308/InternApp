import { useNavigate } from "react-router-dom";
import { FiMessageSquare, FiSearch } from "react-icons/fi";
import { useEffect, useState } from "react";
import axiosClient from "../service/axiosClient";
import Avatar from "react-avatar";
import Pagination from "./pagination";
import { LuMessageCircleMore } from "react-icons/lu"
function FeedbackPanel() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const id = role === "Student" ? localStorage.getItem("maSV") : localStorage.getItem("maAdmin");

  const [activeTab, setActiveTab] = useState("recent");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);


  const pathRecent = role === "Student" ? "/messages/feedback-panel-student" : "/messages/feedback-panel";
  const pathUsers = role === "Student" ? "/admins" : "/sinhviens/lay-danh-sach-sinh-vien"; // giả định bạn có các route này

  useEffect(() => {
  const handler = setTimeout(() => {
    setDebouncedSearchTerm(searchTerm);
  }, 500); // 500ms delay

  return () => {
    clearTimeout(handler);
  };
}, [searchTerm]);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        if (activeTab === "recent") {
          const res = await axiosClient.get(pathRecent, {
            params: {
              id,
              search:  debouncedSearchTerm,
            },
          });
          setMessages(res.data || []);
        } else {
          const res = await axiosClient.get(pathUsers, {
            params: { search: searchTerm,
               page: currentPage,
          per_page: perPage
             },
          });

          setUsers(res.data.data.data || []);
          setTotalPages(res.data.data.last_page)
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, debouncedSearchTerm ,currentPage]);

  const handleNavigate = (conversation_id, receiverId, receiverRole) => {
    if (conversation_id) {
      navigate(`/${role.toLowerCase()}/feedback/conversation/${conversation_id}`);
    } else {
      // Nếu chưa có cuộc trò chuyện thì bắt đầu mới
      navigate(`/${role.toLowerCase()}/feedback/start/${receiverId}?receiverType=${receiverRole}`);
    }
  };
  const handleStartConversation = async (targetId, targetRole) => {
  const fromId = localStorage.getItem(role === "Student" ? "maSV" : "maAdmin");
  const fromRole = role === "Student" ? "sinhvien" : "admin";

  try {
    const res = await axiosClient.post("/messages/conversation/find-or-create", {
      from_id: fromId,
      from_role: fromRole,
      to_id: targetId,
      to_role: targetRole.toLowerCase(), // nhớ là `sinhvien` hoặc `admin`
    });

    const conversationId = res.data.conversation_id;

    // Điều hướng đến trang chat
    if (role === "Student") {
      navigate(`/student/feedback/conversation/${conversationId}`);
    } else {
      navigate(`/admin/feedback/conversation/${conversationId}`);
    }
  } catch (err) {
    console.error("Không thể tạo hội thoại", err);
  }
};


  return (
    <>
 
    <div className="border border-gray-100 rounded-md mt-5 p-4 bg-white">
      {/* Tabs */}
      <div className="flex mb-4">
        <button
          onClick={() => setActiveTab("recent")}
          className={`px-4 py-2 font-medium text-sm rounded-t-md ${
            activeTab === "recent"
              ? "bg-green-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Tin nhắn gần đây
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`ml-2 px-4 py-2 font-medium text-sm rounded-t-md ${
            activeTab === "users"
              ? "bg-green-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Danh sách {role === "Student" ? "Admin" : "Sinh viên"}
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <input
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
          type="text"
          placeholder="Tìm kiếm..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 focus:shadow-md transition"
        />
        <FiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
      </div>

      {/* Loading */}
      <>
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
              )  : (
        <div className="space-y-3 overflow-y-auto">
          {activeTab === "recent"
            ? messages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => handleNavigate(msg.conversation_id)}
                  className="flex items-center justify-between cursor-pointer hover:bg-gray-100 px-3 py-2 rounded-lg transition"
                >
                  <div className="flex items-center gap-3">
                    <Avatar name={msg.name} round size="32" />
                    <div className="flex flex-col">
                      <span className="font-medium text-sm md:text-base">{msg.name}</span>
                      <span className="text-sm text-gray-500 truncate max-w-[180px]">
                             {msg.preview || "Tin nhắn gần đây..."}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end text-xs text-gray-500 min-w-[60px]">
                    {msg.unread && <div className="w-2 h-2 bg-red-500 rounded-full mb-1" />}
                    <span>{msg.time}</span>
                  </div>
                </div>
              ))
            : (
              <>

           {users.map((user) => (
  <div
    key={user.id}
    className="flex items-center justify-between gap-3 hover:bg-gray-100 px-3 py-2 rounded-lg transition"
  >
    {/* Bên trái: thông tin người dùng */}
    <div
      className="flex items-center gap-3 flex-1 cursor-pointer"
    >
      <Avatar name={user.hoTen} round size="32" />
      <div className="flex flex-col">
        <span className="font-medium text-sm md:text-base">{user.hoTen}</span>
        <span className="text-sm text-gray-400">{user.email}</span>
      </div>
    </div>

    {/* Bên phải: nút chat */}
    <button
     onClick={() => handleStartConversation(user.maSV, role === "Student" ? "Admin" : "SinhVien")}

      className="cursor-pointer text-blue-500 hover:text-blue-700 transition p-2"
      title="Trò chuyện"
    >
     <LuMessageCircleMore size={18}/>
    </button>
  </div>
))}
  <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />

              </>
            )
              }
              
        </div>
      )}
      </>
    </div>
    </>
  );
}

export default FeedbackPanel;
