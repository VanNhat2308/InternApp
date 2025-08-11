import { FaRegCalendarAlt, FaFlag, FaFileAlt } from "react-icons/fa";
import { MdUploadFile } from "react-icons/md";
import { FiSend } from "react-icons/fi";
import { FaRegTrashCan } from "react-icons/fa6";
import avatar from "../assets/images/avatar.png";
import { useEffect, useRef, useState } from "react";
import axiosClient from "../service/axiosClient";
import { useNavigate, useParams } from "react-router-dom";
import { BsDownload } from "react-icons/bs";
import Swal from 'sweetalert2';
function TaskDetails() {
  const [task, setTask] = useState({});
  const [isScore, setScore] = useState(false);
  const newScore = useRef(null);
  const navigate = useNavigate();
  const { idSlug } = useParams();
const [comments, setComments] = useState([]);
const [loading, setLoading] = useState(false);
const [newComment, setNewComment] = useState("");

const fetchTask = async () => {
  const res = await axiosClient.get(`tasks/${idSlug}`);
  setTask(res.data.data);
  if (res.data.data.diemSo !== null) {
    setScore(true);
  }
};

const fetchComment = async () => {
  const res = await axiosClient.get(`/task-comments/${idSlug}`);
  setComments(res.data);
};

const fetchAllData = async () => {
  setLoading(true);
  try {
    await Promise.all([fetchTask(), fetchComment()]);
  } catch (err) {
    console.error('Lỗi khi tải dữ liệu:', err);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchAllData();
}, []);

 
const handleScore = () => {
  const value = newScore.current?.value?.trim();
  const parsed = parseFloat(value);

  if (!value || isNaN(parsed) || parsed < 0 || parsed > 10) {
    Swal.fire({
      icon: 'warning',
      title: 'Điểm không hợp lệ',
      text: 'Điểm số phải là số từ 0 đến 10!',
      confirmButtonText: 'OK'
    });
    return;
  }

  // ✅ Hiển thị hộp thoại xác nhận
  Swal.fire({
    title: 'Xác nhận chấm điểm?',
    text: `Bạn có chắc muốn cập nhật điểm là ${parsed}?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Chấm điểm',
    cancelButtonText: 'Huỷ',
    confirmButtonColor: '#16a34a',  // xanh lá
    cancelButtonColor: '#d33'
  }).then((result) => {
    if (result.isConfirmed) {
      // ✅ Nếu xác nhận, tiến hành cập nhật
      axiosClient.put(`/tasks/diem-so/${idSlug}`, { diemSo: parsed })
        .then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Thành công',
            text: 'Cập nhật điểm số thành công!',
            confirmButtonText: 'OK'
          });
          fetchTask();
          setScore(true);
        })
        .catch((err) => {
          console.error(err);
          Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Cập nhật điểm thất bại. Vui lòng thử lại.',
            confirmButtonText: 'OK'
          });
        });
    }
  });
};

const handleDel = () => {
  Swal.fire({
    title: 'Bạn có chắc chắn?',
    text: 'Thao tác này sẽ xoá task vĩnh viễn!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Xoá',
    cancelButtonText: 'Huỷ',
  }).then((result) => {
    if (result.isConfirmed) {
      axiosClient.delete(`/tasks/${idSlug}`)
        .then(() => {
          Swal.fire({
            title: 'Đã xoá!',
            text: 'Task đã được xoá thành công.',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            navigate("/admin/task");
          });
        })
        .catch((err) => {
          console.error(err);
          Swal.fire({
            title: 'Thất bại!',
            text: 'Xoá task thất bại.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        });
    }
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

    // Submit Comment
 const handleSubmitComment = async () => {
  const trimmedComment = newComment.trim();
  if (!trimmedComment) {
    Swal.fire({
      icon: 'warning',
      title: 'Nhận xét trống!',
      text: 'Vui lòng nhập nội dung nhận xét trước khi gửi.',
      confirmButtonText: 'OK'
    });
    return;
  }

  try {
    await axiosClient.post("/task-comments", {
      task_id: idSlug,
      noi_dung: trimmedComment,
      user_type: "App\\Models\\Admin",
      user_id: localStorage.getItem('maAdmin'),
    });

    await fetchComment();
    setNewComment("");
  } catch (error) {
    console.error(error);
    Swal.fire({
      icon: 'error',
      title: 'Gửi nhận xét thất bại!',
      text: 'Vui lòng thử lại sau.',
      confirmButtonText: 'OK'
    });
  }
};

  return (
  <>
  {loading ?       <div className="flex justify-center items-center py-10">
            <div role="status">
        <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-green-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
        <span className="sr-only">Loading...</span>
    </div>
            </div>: (
               
  <div className="mt-5 flex-1 w-full rounded-md bg-white border border-gray-200 p-6 space-y-6">
  {/* Header */}
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-300 pb-4">
    <div className="flex items-start gap-4">
      <div className="bg-gray-100 p-5 rounded-lg">
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
  type="button"
  className="cursor-pointer py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-red-600 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 inline-flex items-center gap-2"
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
        <h3 className="text-lg font-semibold mb-2">Mô Tả</h3>
        <p className="text-gray-700 whitespace-pre-wrap">{task.noiDung || "Không có nội dung"}</p>
      </div>

      {/* Nộp bài */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Bài Nộp</h3>
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
          </label>
        ) : (
          
              <div className="w-full lg:mx-auto space-y-3">
                {task.tepDinhKem.map((fileObj, index) => {
                  const stored = fileObj.path?.replace('tasks/', '');
                  const original = fileObj.name?.split('/').pop() || "file";
          
                  return (
                   <div
  key={index}
  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition"
>
  {/* Left: File info */}
  <div className="flex items-start sm:items-center gap-4 flex-1">
    <FaFileAlt className="text-green-400 text-4xl mt-1 sm:mt-0" />
    <div>
      <p className="text-base font-semibold text-gray-800">{original}</p>
      <p className="text-sm text-gray-500 mt-1">
        Đã nộp lúc: {new Date(task.updated_at).toLocaleString("vi-VN")}
      </p>
    </div>
  </div>

  {/* Right: Actions */}
  <div className="flex items-center gap-3">
    <button
      onClick={() => {
        window.open(
          `${import.meta.env.VITE_API_URL}/download/${stored}/${encodeURIComponent(original)}`,
          '_blank'
        );
      }}
      className="flex items-center gap-1 text-green-600 hover:text-green-800 transition"
      title={`Tải xuống: ${original}`}
    >
      <BsDownload className="text-xl" />
      <span className="hidden sm:inline text-sm font-medium">Tải xuống</span>
    </button>

    {/* Nếu cần nút xóa thì bật lại bên dưới */}
    {/* {!task?.tepDinhKem && (
      <button
        onClick={() => handleRemove(index)}
        className="text-red-500 hover:text-red-700 transition"
        title="Xóa file"
      >
        <FaTrashCan className="text-lg" />
      </button>
    )} */}
  </div>
</div>

                  );
                })}
              </div>
            )}
 
      </div>

      {/* Chấm điểm */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Chấm Điểm</h3>
        {isScore ? (
         <p className="inline-block bg-gradient-to-br from-green-700 to-lime-600 text-white text-xl font-bold px-3 py-1 rounded-lg shadow-lg">
    {task.diemSo || 0}
  </p>
        ) : (
           <>
    <div className="flex items-center gap-3 mb-2">
      <input
        type="text"
        ref={newScore}
        placeholder="Nhập điểm số"
        className="flex-1 border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-2 focus:outline-green-300"
      />
     <button
    disabled={['Chưa nộp', 'Nộp trễ'].includes(task.trangThai)}
  onClick={handleScore}
  type="button"
  className={`py-2.5 px-5 text-sm font-medium text-white rounded-lg transition focus:outline-none focus:ring-4
    ${['Chưa nộp', 'Nộp trễ'].includes(task.trangThai)
      ? 'bg-green-400 cursor-not-allowed opacity-50'
      : 'bg-green-600 hover:bg-green-700 focus:ring-green-300 dark:bg-green-700 dark:hover:bg-green-800 dark:focus:ring-green-900'
    }`}
>
  Chấm Điểm
</button>

    </div>
    <p className="text-sm text-gray-400 mb-2">
      Nhập điểm từ 0 đến 10, có thể là số thập phân
    </p>
  </>
        )}
      </div>
          <div>
             <h3 className="text-lg font-semibold mb-3">Nhận Xét</h3>
            {/* Nhận xét đã có */}
                     {comments.map((comment) => (
                    <div key={comment.id} className="flex items-start gap-3 mb-4">
            <img
              src={avatar} // Bạn có thể thay đổi ảnh theo user_type nếu muốn
              alt="avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold">
                {comment.user?.hoTen || "Không rõ"}
                <span className="text-green-500 text-sm ml-2">
                  {comment.user_type.includes("Admin") ? "Admin" : "Student"}
                </span>
              </p>
              <p className="text-gray-700">{comment.noi_dung}</p>
            </div>
                    </div>
                  ))}
            
                  {/* Nhận xét */}
                  <div className="flex items-start gap-3">
            <img src={avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
            <div className="flex-1 relative">
                  <textarea
                  rows="4"
                  className="w-full border-1 border-gray-300 rounded-md p-2 pr-10 text-sm resize-none focus:outline-3 focus:outline-green-100"
                  placeholder="Ghi phản hồi..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                ></textarea>
                <button
                  disabled={!newComment.trim()}
                  className={`absolute top-2 right-2 p-2 rounded-md transition ${
                    newComment.trim()
            ? "bg-green-500 hover:bg-green-600 text-white cursor-pointer"
            : "bg-gray-300 text-white cursor-not-allowed"
                  }`}
                  onClick={handleSubmitComment}
                >
                  <FiSend />
                </button>
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
)}
</>
  );
}

export default TaskDetails;
