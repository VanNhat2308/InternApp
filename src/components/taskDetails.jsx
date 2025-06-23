import { FaRegCalendarAlt, FaFlag, FaTrashAlt } from "react-icons/fa";
import { LuShoppingBag } from "react-icons/lu";
import { FiSend } from "react-icons/fi";
import avatar from "../assets/images/avatar.png"; // ảnh đại diện

import { FaRegTrashCan } from "react-icons/fa6";
import { useEffect, useRef, useState } from "react";
import axiosClient from "../service/axiosClient";
import { useNavigate, useParams } from "react-router-dom";

function TaskDetails() {
 const [isScore,SetScore] = useState(false)
 const newScore = useRef(null)
 const navigate = useNavigate()
 const handleScore = () => {
  const value = newScore.current?.value?.trim();

  if (!value) {
    alert("Vui lòng nhập điểm số!");
    return;
  }

  const parsed = parseFloat(value);
  if (isNaN(parsed) || parsed < 0 || parsed > 10) {
    alert("Điểm số phải là số từ 0 đến 10!");
    return;
  }

  axiosClient
    .put(`/tasks/diem-so/${idSlug}`, {
      diemSo: parsed
    })
    .then(() => {
      alert("Cập nhật điểm số thành công");
      SetScore(true);
    })
    .catch((err) => console.error(err));
};

 const {idSlug} = useParams()
 const [task,setTask] = useState({})
 useEffect(()=>{
  axiosClient.get(`tasks/${idSlug}`)
  .then((res)=>{
    setTask(res.data.data)
    if(res.data.data.diemSo!==null){
      SetScore(true)
    }
  })
  .catch((err)=>{
    console.log(err);
  })
 },[])
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

const handleDel = (idSlug) => {
  const confirmDelete = window.confirm("Bạn có chắc chắn muốn xoá task này không?");
  
  if (!confirmDelete) return;

  axiosClient
    .delete(`/tasks/${idSlug}`)
    .then((res) => {
      alert("Xoá task thành công!");
      navigate("/admin/task");
    })
    .catch((err) => {
      console.error(err);
      alert("Xoá thất bại!");
    });
};

  return (
  <div className="mt-8 p-4 border border-gray-300 bg-white rounded-xl shadow w-full">
  {/* Header */}
  <div className="flex flex-col md:flex-row justify-between gap-4 mb-6 pb-4 border-b border-gray-200">
    {/* Left */}
    <div className="flex gap-3">
      <div className="bg-gray-100 p-4 rounded-md h-fit">
        <LuShoppingBag className="text-3xl" />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-bold break-words">{task.tieuDe}</h2>
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <FaRegCalendarAlt />
            <span>{new Date(task.hanHoanThanh).toLocaleDateString("vi-VN")}</span>
          </div>
          <span
            style={{ backgroundColor: getStatusColor(task.trangThai) }}
            className="px-3 py-1 text-white rounded-full text-xs"
          >
            {task.trangThai}
          </span>
          <span
            style={{ backgroundColor: getPriorityColor(task.doUuTien) }}
            className="px-3 py-1 text-white rounded-full text-xs flex items-center gap-1"
          >
            <FaFlag /> {task.doUuTien}
          </span>
        </div>
      </div>
    </div>

    {/* Delete button */}
    <button
      onClick={() => handleDel(idSlug)}
      className="py-2 px-4 border border-gray-300 rounded-md text-sm hover:text-red-600 flex items-center gap-2 self-start"
    >
      <FaRegTrashCan /> Xóa
    </button>
  </div>

  {/* Description */}
  <div className="mb-6 border-b pb-5 border-gray-200">
    <h3 className="font-bold text-lg mb-2">Mô tả</h3>
    <p className="text-gray-600 text-base whitespace-pre-wrap">{task.noiDung}</p>
  </div>

  {/* Người thực hiện */}
  <div className="mb-6 border-b pb-5 border-gray-200">
    <h3 className="font-bold text-lg mb-2">Thực Hiện</h3>
    <div className="flex items-center gap-3">
      <img src={avatar} alt="avatar" className="w-10 h-10 border rounded-full object-cover" />
      <div>
        <p className="font-semibold text-base">{task?.sinh_vien?.hoTen}</p>
        <p className="text-green-500 text-sm">{task?.sinh_vien?.viTri}</p>
      </div>
    </div>
  </div>

  {/* Chấm điểm */}
  <div className="mb-6 border-b pb-5 border-gray-200">
    <h3 className="font-bold text-lg mb-2">Chấm Điểm</h3>
    {isScore ? (
      <p className="text-green-600 font-semibold">Đã chấm điểm</p>
    ) : (
      <>
        <input
          type="text"
          ref={newScore}
          placeholder="Nhập điểm số"
          className="w-full border rounded-md p-2 text-sm mb-1"
        />
        <p className="text-sm text-gray-400 mb-2">
          Nhập điểm từ 0 đến 10, có thể là số thập phân
        </p>
        <div className="flex justify-end">
          <button
            onClick={handleScore}
            className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700"
          >
            Chấm điểm
          </button>
        </div>
      </>
    )}
  </div>

  {/* Nhận xét */}
  <div>
    <h3 className="font-bold text-lg mb-2">Nhận Xét</h3>

    {/* Nhận xét đã có */}
    <div className="flex items-start gap-3 mb-4">
      <img src={avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
      <div>
        <p className="font-semibold">
          Nguyễn Văn A <span className="text-green-500 text-sm ml-2">Admin</span>
        </p>
        <p className="text-gray-700">Nhật ký tốt, tiến độ OK.</p>
      </div>
    </div>

    {/* Ghi nhận xét mới */}
    <div className="flex items-start gap-3">
      <img src={avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
      <div className="flex-1 relative">
        <textarea
          rows="4"
          className="w-full border-2 border-gray-300 rounded-md p-2 pr-10 text-sm resize-none"
          placeholder="Ghi phản hồi..."
        ></textarea>
        <button className="absolute top-2 right-2 bg-gray-400 text-white p-2 rounded-md hover:bg-gray-500">
          <FiSend />
        </button>
      </div>
    </div>
  </div>
</div>

  );
}

export default TaskDetails;
