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
      return "#ff6600"; // vàng dịu, nổi bật hơn (#FCD34D -> #FACC15)
    case "Đã nộp":
      return "#22C55E"; // xanh lá nhẹ, rõ hơn (#6EE7B7 -> #22C55E)
    case "Nộp trễ":
      return "#F87171"; // đỏ hồng nhẹ nhưng rõ (#FCA5A5 -> #F87171)
    default:
      return "#D1D5DB"; // xám nhạt (giữ nguyên tone sáng hơn)
  }
};

const getPriorityColor = (p) => {
  switch (p) {
    case "Cao":
      return "#DC2626"; // đỏ cảnh báo rõ hơn (#EF4444 -> #DC2626)
    case "Trung bình":
      return "#F59E0B"; // giữ nguyên vì đã phù hợp
    case "Thấp":
      return "#10B981"; // giữ nguyên xanh ngọc
    default:
      return "#9CA3AF"; // xám trung tính
  }
};

task.thanhVien = [
  { avatar: defaulAvatar },
  { avatar: defaulAvatar },
  { avatar: defaulAvatar },
  { avatar: defaulAvatar },
 
]

return (
    <div
      onClick={handleClick}
      className="p-4 rounded-2xl border border-gray-200 bg-white hover:shadow-md transition cursor-pointer"
    >
      {/* Tiêu đề + Trạng thái */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-gray-800 truncate">{task.tieuDe}</h2>
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0"
          style={{
            backgroundColor: getStatusColor(task.trangThai),
            color: "#fff",
          }}
        >
          {task.trangThai}
        </span>
      </div>

      {/* Ưu tiên & Hạn nộp */}
      <div className="flex items-center justify-between text-sm text-gray-600 mt-2">
        <div className="flex items-center gap-2">
          <FaFlag className="text-sm" />
          <span style={{ color: getPriorityColor(task.doUuTien) }}>
            {task.doUuTien}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <FaRegCalendarAlt className="text-sm" />
          {new Date(task.hanHoanThanh).toLocaleDateString("vi-VN")}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-2 bg-gray-200 rounded-full">
        <div
          className={`h-full rounded-full`}
          style={{
            width: task.trangThai === "Đã nộp" ? "100%" : "70%",
            backgroundColor: "#10B981",
          }}
        ></div>
      </div>

      {/* Bình luận + Avatar */}
    <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
  <span className="flex items-center gap-1">
    <AiOutlineMessage className="text-base" />
    {task.soBinhLuan || 0} bình luận
  </span>

  {/* Nhóm avatar */}
  <div className="flex -space-x-2">
    {task?.sinh_viens?.slice(0, 3).map((tv, index) => (
      <img
        key={index}
        // src={tv.duLieuKhuonMat || defaulAvatar}
        src={defaulAvatar}
        alt="avatar"
        className="w-6 h-6 rounded-full border-2 border-white object-cover"
      />
    ))}
    {task.thanhVien?.length > 3 && (
      <span className="w-6 h-6 rounded-full bg-gray-300 text-xs flex items-center justify-center text-white border-2 border-white">
        +{task.thanhVien.length - 3}
      </span>
    )}
  </div>
</div>

    </div>
  );
}

export default TaskCard;
