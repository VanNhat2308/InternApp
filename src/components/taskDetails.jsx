import { FaRegCalendarAlt, FaFlag, FaTrashAlt } from "react-icons/fa";
import { LuShoppingBag } from "react-icons/lu";
import { FiSend } from "react-icons/fi";
import avatar from "../assets/images/avatar.png"; // ảnh đại diện

import { FaRegTrashCan } from "react-icons/fa6";
import { useState } from "react";

function TaskDetails() {
 const [isScore,SetScore] = useState(false)
const handleScore = () => SetScore(prev => !prev);

  return (
    <div className="mt-8 p-4 border border-gray-300 bg-white rounded-xl shadow">
      {/* Tiêu đề & ngày & nút xóa */}
      <div className="flex justify-between items-center mb-4 pb-5 border-b border-b-gray-300">
        <div className="flex gap-3">
          <div className="bg-gray-100 p-6 rounded-md">
            <LuShoppingBag className="text-3xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Thiết kế giao diện app</h2>
            <div className="flex flex-col gap-2 text-sm text-gray-500 mt-1">
              <div className="flex items-center gap-1">
                  <FaRegCalendarAlt />
                  <span>26 April</span>
              </div>
              <div>
                  <span className="px-3 py-1 bg-yellow-400 text-white rounded-full text-xs mr-2">Chưa nộp</span>
                  <span className="inline-block px-3 py-1 bg-red-500 text-white rounded-full text-xs"><div className="flex items-center gap-1"><FaFlag/>Cao</div></span>
              </div>
            </div>
          </div>
        </div>
        <button className="py-2 px-4 border border-gray-300 rounded-md text-lg cursor-pointer flex items-center gap-2 hover:text-red-700">
          <FaRegTrashCan /> Xóa
        </button>
      </div>

      {/* Mô tả */}
      <div className="mb-4 pb-5 border-b border-gray-300">
        <h3 className="font-bold text-lg">Mô tả</h3>
        <p className="text-gray-600 text-base">Tạo và thiết kế giao diện cho ứng dụng quản lý thực tập sinh</p>
      </div>

      {/* Thực hiện */}
      <div className="mb-6">
        <h3 className="font-bold text-lg">Thực Hiện</h3>
        <div className="flex items-center gap-3">
          <img src={avatar} alt="avatar" className="w-10 h-10 border rounded-full object-cover" />
          <div>
            <div className="font-semibold text-lg">Phạm Văn A</div>
            <div className="text-green-500 text-sm font-semibold">Graphic Designer Intern</div>
          </div>
        </div>
      </div>

      {/* Chấm điểm */}
      <div className="mb-6">
        <h3 className="font-bold text-xl mb-1">Chấm Điểm</h3>
       {isScore ?( <h1>Đã chấm điểm</h1> ): (<><input
          type="text"
          placeholder="Nhập điểm số"
          className="w-full lg:w-lg border rounded-md p-2 text-sm mb-1"
        />
        <p className="text-sm text-gray-400 mb-2">Nhập điểm từ 0 đến 10, cho phép số thập phân</p>
        <div className="flex justify-end">
            <button onClick={handleScore} className="bg-green-600 cursor-pointer text-white px-4 py-2 rounded-md text-sm hover:bg-green-600">
              Chấm Điểm
            </button>
        </div> </>)}
      </div>

      {/* Nhận xét */}
      <div>
        <h3 className="font-bold text-xl mb-2">Nhận Xét</h3>
        {/* Cmt đã có */}
        <div className="flex items-start gap-3 mb-4">
          <img src={avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
          <div>
            <div className="font-semibold flex flex-col"><span>Nguyễn Văn A </span><span className="text-green-400 text-sm ml-1">Admin</span></div>
            <p className="text-gray-700">Nhật ký tốt tiến độ OK.</p>
            {/* <div className="text-xs text-gray-400 mt-1">20 April 2025 5:53 AM</div> */}
          </div>
        </div>

        {/* Input comment mới */}
        <div className="flex items-start gap-3 lg:w-lg">
          <img src={avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
          <div className="flex-1 relative">
            <textarea
              rows="4"
              className="w-full relative  border-2 border-gray-500 rounded-md p-2 pr-10  text-sm resize-none"
              placeholder="Ghi phản hồi..."
            ></textarea>
            <button className="cursor-pointer absolute p-2 rounded-md top-2 right-2 bg-gray-400 text-white hover:text-black">
              <FiSend />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskDetails;
