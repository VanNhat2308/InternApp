import { LuShoppingBag } from "react-icons/lu";
import { AiOutlineMessage } from "react-icons/ai";
import { TfiTimer } from "react-icons/tfi";
import { FaFlag, FaRegCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function TaskCard({ task }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/admin/task/task-details/${task.id}`); // ví dụ: task.id = 123 → /task/123
  };

  return (
    <div
      className="flex-1 p-2 rounded-md border border-gray-200 cursor-pointer hover:shadow-md transition"
      onClick={handleClick}
    >
      <div className="flex items-center gap-2">
        <div
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: task.statusColor }}
        ></div>
        <span className="text-lg font-semibold">{task.status}</span>
      </div>
      <div className="bg-gray-50 p-2">
        <div className="flex gap-2">
          <div className="bg-gray-100 p-3 rounded-md">
            <LuShoppingBag className="text-xl" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-lg">{task.title}</h2>
            <span className="flex gap-1 items-center text-base">
              <AiOutlineMessage />
              {task.commentCount}
            </span>
          </div>
        </div>

        <div className="flex gap-2 mt-3">
          <div
            className={`flex gap-1 items-center px-3 py-2 rounded-3xl ${
              task.tagTextColor || "text-white"
            }`}
            style={{ backgroundColor: task.tagBg }}
          >
            <TfiTimer />
            {task.tagText}
          </div>
          <div className="flex gap-1 items-center px-3 py-2 rounded-3xl bg-red-500 text-white">
            <FaFlag />
            {task.priority}
          </div>
        </div>

        <div className="h-1 bg-green-500 rounded-3xl mt-3"></div>

        <div className="mt-5 flex justify-between">
          <div className="flex items-center gap-1 text-base text-gray-700">
            <FaRegCalendarAlt />
            {task.date}
          </div>
          <div className="flex">
            {task.avatars.map((src, i) => (
              <img
                key={i}
                src={src}
                alt="task avatar"
                className={`w-5 h-5 rounded-full object-cover ${
                  i > 0 ? "ml-[-5px]" : ""
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
