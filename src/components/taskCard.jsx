import { LuShoppingBag } from "react-icons/lu";
import { AiOutlineMessage } from "react-icons/ai";
import { TfiTimer } from "react-icons/tfi";
import { FaFlag, FaRegCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import defaulAvatar from '../assets/images/avatar.png'
import axiosClient from "../service/axiosClient";

function TaskCard({ task }) {
  const userRole = localStorage.getItem('role')
  const navigate = useNavigate();

  const handleClick = () => {
    if(userRole === 'Student')
       navigate(`/student/task/task-details/${task.id}`)
      else
      navigate(`/admin/task/task-details/${task.id}`)
  };
  const priorityColors = {
  Cao: "bg-red-500",
  TrungBinh: "bg-yellow-400",
  Thap: "bg-green-500",
};
const getStatusColor = (trangThai) => {
  switch (trangThai) {
    case "Chưa nộp":
      return "#FCD34D"; // vàng pastel
    case "Đã nộp":
      return "#6EE7B7"; // xanh bạc hà
    case "Nộp trễ":
      return "#FCA5A5"; // đỏ nhạt
    default:
      return "#E5E7EB"; // xám
  }
};

const getPriorityColor = (p) => {
  switch (p) {
    case "Cao":
      return "#EF4444"; // đỏ tươi (danger)
    case "Trung bình":
      return "#F59E0B"; // vàng tươi (warning)
    case "Thấp":
      return "#10B981"; // xanh ngọc (success)
    default:
      return "#9CA3AF"; // xám trung tính
  }
};


  return (
 <div
  className="p-3 rounded-xl border border-gray-200 bg-white cursor-pointer hover:shadow-lg transition-all duration-300"
  onClick={handleClick}
>
  {/* Trạng thái */}
  <div className="flex items-center gap-2 mb-2">
    <div
      className="w-3 h-3 rounded-full"
      style={{ backgroundColor: getStatusColor(task.trangThai) }}
    ></div>
    <span className="text-sm font-medium text-gray-700">{task.trangThai}</span>
  </div>

  {/* Nội dung task */}
  <div className="bg-gray-50 p-3 rounded-lg">
    <div className="flex items-start gap-3">
      <div className="bg-green-100 p-2 rounded-md text-green-600">
        <LuShoppingBag className="text-xl" />
      </div>
      <div className="flex flex-col flex-1">
        <h2 className="text-base font-semibold text-gray-800 truncate">{task.tieuDe}</h2>
        <span className="flex items-center text-sm text-gray-500 gap-1 mt-1">
          <AiOutlineMessage className="text-base" />
          2 bình luận
        </span>
      </div>
    </div>

    {/* Tag trạng thái + độ ưu tiên */}
    <div className="flex gap-2 mt-4 flex-wrap">
      <div
        className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium"
        style={{
          backgroundColor: getStatusColor(task.trangThai),
          color: "#fff",
        }}
      >
        <TfiTimer />
        {task.trangThai}
      </div>

      <div
        className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium text-white"
        style={{
          backgroundColor: getPriorityColor(task.doUuTien),
        }}
      >
        <FaFlag />
        {task.doUuTien}
      </div>
    </div>

    {/* Progress bar */}
    <div className="h-1 bg-green-400/50 rounded-full mt-4">
      <div className="h-full w-[70%] bg-green-500 rounded-full"></div>
    </div>

    {/* Footer: hạn + avatar */}
    <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
      <div className="flex items-center gap-1">
        <FaRegCalendarAlt className="text-base" />
        {new Date(task.hanHoanThanh).toLocaleDateString("vi-VN")}
      </div>
      <img
        src={defaulAvatar}
        alt="task avatar"
        className="w-6 h-6 rounded-full object-cover"
      />
    </div>
  </div>
</div>

  );
}

export default TaskCard;
