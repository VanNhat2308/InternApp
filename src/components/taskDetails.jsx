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
 const handleScore = () =>{ 
  axiosClient.put(`/tasks/diem-so/${idSlug}`, {
  diemSo: newScore.current.value
})
.then(
  alert("Cập nhật điểm số thành công")
)
.catch(err => console.error(err));

  SetScore(prev => !prev)
}
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
      return "#FCBE12"; // vàng nhạt
    case "Đã nộp":
      return "#3FC28A"; // xanh nhạt
    case "Nộp trễ" :
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
const handleDel = (idSlug)=>{
  axiosClient.delete(`/tasks/${idSlug}`)
  .then(res => {
    alert("Xóa task thành công")
    navigate('/admin/task')
    // có thể setToast hoặc gọi lại danh sách
  })
  .catch(err => console.error(err));

}

  return (
    <div className="mt-8 p-4 border border-gray-300 bg-white rounded-xl shadow">
      {/* Tiêu đề & ngày & nút xóa */}
      <div className="flex justify-between items-center mb-4 pb-5 border-b border-b-gray-300">
        <div className="flex gap-3">
          <div className="bg-gray-100 p-6 rounded-md">
            <LuShoppingBag className="text-3xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{task.tieuDe}</h2>
            <div className="flex flex-col gap-2 text-sm text-gray-500 mt-1">
              <div className="flex items-center gap-1">
                  <FaRegCalendarAlt />
                  <span>{new Date(task.hanHoanThanh).toLocaleDateString("vi-VN")}</span>
              </div>
              <div>
                  <span 
                   style={{ backgroundColor: getStatusColor(task.trangThai) }}
                  className="px-3 py-1 text-white rounded-full text-xs mr-2">{task.trangThai}</span>
                  <span 
                   style={{background:`${getPriorityColor(task.doUuTien)}`}}
                  className="inline-block px-3 py-1 text-white rounded-full text-xs"><div className="flex items-center gap-1"><FaFlag/>{task.doUuTien}</div></span>
              </div>
            </div>
          </div>
        </div>
        <button onClick={()=>handleDel(idSlug)} className="py-2 px-4 border border-gray-300 rounded-md text-lg cursor-pointer flex items-center gap-2 hover:text-red-700">
          <FaRegTrashCan /> Xóa
        </button>
      </div>

      {/* Mô tả */}
      <div className="mb-4 pb-5 border-b border-gray-300">
        <h3 className="font-bold text-lg">Mô tả</h3>
        <p className="text-gray-600 text-base">{task.noiDung}</p>
      </div>

      {/* Thực hiện */}
      <div className="mb-6">
        <h3 className="font-bold text-lg">Thực Hiện</h3>
        <div className="flex items-center gap-3">
          <img src={avatar} alt="avatar" className="w-10 h-10 border rounded-full object-cover" />
          <div>
            <div className="font-semibold text-lg">{task?.sinh_vien?.hoTen}</div>
            <div className="text-green-500 text-sm font-semibold">{task?.sinh_vien?.viTri}</div>
          </div>
        </div>
      </div>

      {/* Chấm điểm */}
      <div className="mb-6">
        <h3 className="font-bold text-xl mb-1">Chấm Điểm</h3>
       {isScore ?( <h1>Đã chấm điểm</h1> ): (<><input
          type="text"
          ref={newScore}
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
