import { FaRegCalendarAlt, FaFlag, FaFileAlt } from "react-icons/fa";
import { MdUploadFile } from "react-icons/md";
import { FiSend } from "react-icons/fi";
import { FaRegTrashCan } from "react-icons/fa6";
import avatar from "../assets/images/avatar.png";
import { useEffect, useRef, useState } from "react";
import axiosClient from "../service/axiosClient";
import { useNavigate, useParams } from "react-router-dom";

function TaskDetails() {
  const [task, setTask] = useState({});
  const [isScore, setScore] = useState(false);
  const newScore = useRef(null);
  const navigate = useNavigate();
  const { idSlug } = useParams();

  useEffect(() => {
    axiosClient.get(`tasks/${idSlug}`)
      .then((res) => {
        setTask(res.data.data);
        if (res.data.data.diemSo !== null) {
          setScore(true);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleScore = () => {
    const value = newScore.current?.value?.trim();
    const parsed = parseFloat(value);

    if (!value || isNaN(parsed) || parsed < 0 || parsed > 10) {
      alert("Điểm số phải là số từ 0 đến 10!");
      return;
    }

    axiosClient.put(`/tasks/diem-so/${idSlug}`, { diemSo: parsed })
      .then(() => {
        alert("Cập nhật điểm số thành công");
        setScore(true);
      })
      .catch((err) => console.error(err));
  };

  const handleDel = () => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá task này không?")) return;

    axiosClient.delete(`/tasks/${idSlug}`)
      .then(() => {
        alert("Xoá task thành công!");
        navigate("/admin/task");
      })
      .catch((err) => {
        console.error(err);
        alert("Xoá thất bại!");
      });
  };

  const getStatusColor = (trangThai) => {
    switch (trangThai) {
      case "Chưa nộp": return "#ff6600";
      case "Đã nộp": return "#6EE7B7";
      case "Nộp trễ": return "#FCA5A5";
      default: return "#E5E7EB";
    }
  };

  const getPriorityColor = (p) => {
    switch (p) {
      case "Cao": return "#EF4444";
      case "Trung bình": return "#F59E0B";
      case "Thấp": return "#10B981";
      default: return "#9CA3AF";
    }
  };

  return (
  <div className="mt-8 w-full rounded-md bg-white border border-gray-100  p-6 space-y-6">
  {/* Header */}
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
    <div className="flex items-start gap-4">
      <div className="bg-gray-100 p-3 rounded-lg">
        <MdUploadFile className="text-2xl text-gray-600" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-800">{task.tieuDe}</h2>
        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <FaRegCalendarAlt />
            <span>{new Date(task.hanHoanThanh).toLocaleDateString("vi-VN")}</span>
          </div>
          <span
            style={{ backgroundColor: getStatusColor(task.trangThai) }}
            className="px-3 py-1 rounded-full text-white text-xs"
          >
            {task.trangThai}
          </span>
          <span
            style={{ backgroundColor: getPriorityColor(task.doUuTien) }}
            className="px-3 py-1 rounded-full text-white text-xs flex items-center gap-1"
          >
            <FaFlag /> {task.doUuTien}
          </span>
        </div>
      </div>
    </div>
    <button
      onClick={handleDel}
      className="inline-flex items-center gap-2 border px-4 py-2 rounded-md text-sm text-gray-600 hover:text-red-600 transition"
    >
      <FaRegTrashCan /> Xóa
    </button>
  </div>

  {/* Grid Content */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {/* Left Section */}
    <div className="md:col-span-2 space-y-6">
      {/* Mô tả */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Mô tả</h3>
        <p className="text-gray-700 whitespace-pre-wrap">{task.noiDung || "Không có nội dung"}</p>
      </div>

      {/* Nộp bài */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Nộp bài</h3>
        {!task.tepDinhKem ? (
          <label
            htmlFor="cv-upload"
            className="block w-full border-2 border-dashed border-green-400 rounded-lg text-center p-6 hover:bg-green-50 cursor-pointer transition"
          >
            <div className="flex justify-center mb-2">
              <div className="bg-green-600 text-white p-2 rounded-md">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h5v-2H4V5h12v10h-5v2h5a2 2 0 002-2V5a2 2 0 00-2-2H4z" />
                  <path d="M9 12h2V8h3l-4-4-4 4h3v4z" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-500">supported formats: .jpeg, .pdf</p>
          </label>
        ) : (
          <div className="bg-green-50 border border-green-400 rounded-lg p-4 flex items-center gap-4">
            <FaFileAlt className="text-orange-400 text-xl" />
            <p className="text-sm font-medium truncate">{task.tepDinhKem.split("/").pop()}</p>
          </div>
        )}
      </div>

      {/* Chấm điểm */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Chấm điểm</h3>
        {isScore ? (
          <p className="text-green-600 font-semibold">Đã chấm điểm</p>
        ) : (
          <>
            <input
              type="text"
              ref={newScore}
              placeholder="Nhập điểm số"
              className="w-full border border-gray-300 rounded-md p-2 text-sm mb-1"
            />
            <p className="text-sm text-gray-400 mb-2">Nhập điểm từ 0 đến 10, có thể là số thập phân</p>
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
        <h3 className="text-lg font-semibold mb-2">Nhận xét</h3>
        <div className="space-y-4">
          <div className="flex gap-3 items-start">
            <img src={avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
            <div>
              <p className="font-semibold">
                Nguyễn Văn A <span className="text-green-500 text-sm ml-2">Admin</span>
              </p>
              <p className="text-gray-700">Nhật ký tốt, tiến độ OK.</p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <img src={avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
            <div className="flex-1 relative">
              <textarea
                rows="4"
                placeholder="Ghi phản hồi..."
                className="w-full border-2 border-gray-300 rounded-md p-2 pr-10 text-sm resize-none"
              />
              <button className="absolute top-2 right-2 bg-gray-400 text-white p-2 rounded-md hover:bg-gray-500">
                <FiSend />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Right Section: Sinh viên */}
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">Thành viên thực hiện</h3>
      {task.sinh_viens?.length > 0 ? (
        task.sinh_viens.map((sv) => (
          <div key={sv.maSV} className="flex items-center gap-3 mb-4">
            <img src={avatar} alt="avatar" className="w-10 h-10 rounded-full border object-cover" />
            <div>
              <p className="font-semibold">{sv.hoTen}</p>
              <p className="text-green-600 text-sm">{sv.viTri}</p>
              <p className="text-gray-400 text-xs">{sv.email}</p>
            </div>
          </div>
        ))
      ) : (
        <p className="italic text-sm text-gray-500">Chưa có sinh viên thực hiện</p>
      )}
    </div>
  </div>
</div>

  );
}

export default TaskDetails;
