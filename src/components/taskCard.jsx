import { LuShoppingBag } from "react-icons/lu";
import { AiOutlineMessage } from "react-icons/ai";
import { TfiTimer } from "react-icons/tfi";
import { FaFlag, FaRegCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import defaulAvatar from '../assets/images/avatar.png'
import axiosClient from "../service/axiosClient";

function TaskCard({ task }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/admin/task/task-details/${task.id}`); // ví dụ: task.id = 123 → /task/123
  };
  const priorityColors = {
  Cao: "bg-red-500",
  TrungBinh: "bg-yellow-400",
  Thap: "bg-green-500",
};
const getStatusColor = (trangThai) => {
  switch (trangThai) {
    case "Chưa nộp":
      return "#FCBE12"; // vàng nhạt
    case "Đã nộp":
      return "#3FC28A"; // xanh nhạt
    case "Nộp trễ":
      return "#F45B69"; // đỏ nhạt
    default:
      return "#E5E7EB"; // xám nhạt
  }
};
const getPriorityColor = (p) => {
  switch (p) {
    case "Trung bình":
      return "#FCBE12"; // vàng nhạt
    case "Thấp":
      return "#3FC28A"; // xanh nhạt
    case "Cao":
      return "#F45B69"; // đỏ nhạt
    default:
      return "#E5E7EB"; // xám nhạt
  }
};


  return (
    <div
      className="p-2 rounded-md border border-gray-200 cursor-pointer hover:shadow-md transition"
      onClick={handleClick}
    >
      <div className="flex items-center gap-2">
        <div
          className={`w-4 h-4 rounded-full`}
           style={{ backgroundColor: getStatusColor(task.trangThai) }}
  
        ></div>
        <span className="text-lg font-semibold">{task.trangThai}</span>
      </div>
      <div className="bg-gray-50 p-2">
        <div className="flex gap-2">
          <div className="bg-gray-100 p-3 rounded-md">
            <LuShoppingBag className="text-xl" />
          </div>
          <div className="flex flex-col w-full">
            <h2 className="text-lg truncate w-full lg:w-[80%]">{task.tieuDe}</h2>
            <span className="flex gap-1 items-center text-base">
              <AiOutlineMessage />
              {/* {task.commentCount}
               */}
               2
            </span>
          </div>
        </div>

        <div className="flex gap-2 mt-3">
          <div
            className={`flex gap-1 items-center px-3 py-2 rounded-3xl ${
              task.tagTextColor || "text-white"
            }`}
            style={{ backgroundColor: getStatusColor(task.trangThai) }}
          >
            <TfiTimer />
            {task.trangThai}
          </div>
         <div 
         style={{background:`${getPriorityColor(task.doUuTien)}`}}
         className={`flex gap-1 items-center px-4 py-2 rounded-4xl text-white`}>
  <FaFlag />
  {task.doUuTien}
</div>

        </div>

        <div className="h-1 bg-green-500 rounded-3xl mt-3"></div>

        <div className="mt-5 flex justify-between">
          <div className="flex items-center gap-1 text-base text-gray-700">
            <FaRegCalendarAlt />
            {new Date(task.hanHoanThanh).toLocaleDateString("vi-VN")}
          </div>
          <div className="flex">
              <img
                src={defaulAvatar}
                alt="task avatar"
                className={`w-5 h-5 rounded-full object-cover`}
              />
           
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
