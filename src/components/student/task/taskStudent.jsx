import { FaRegCalendarAlt, FaFlag, FaTrashAlt, FaFileAlt, FaCheckCircle } from "react-icons/fa";
import { LuShoppingBag } from "react-icons/lu";
import { FiSend } from "react-icons/fi";
import avatar from "../../../assets/images/avatar.png";
import { FaRegTrashCan, FaTrashCan, FaUpload } from "react-icons/fa6";
import { useEffect, useRef, useState } from "react";
import axiosClient from "../../../service/axiosClient";
import { useNavigate, useParams } from "react-router-dom";
import UploadSection from "../../UploadSelection";
import { BsCheckCircle, BsDownload, BsEyeFill, BsListTask } from "react-icons/bs";
import { useDialog } from "../../../context/dialogContext";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import { MdUploadFile } from "react-icons/md";
function TaskStudent() {
 const { idSlug } = useParams();
  const navigate = useNavigate();
  const { showDialog } = useDialog();

  const apiBaseURL = import.meta.env.VITE_API_BASE_URL;
  const maSV = localStorage.getItem("maSV");

  const [task, setTask] = useState({});
  const [taskUploads, setTaskUploads] = useState([]);
  const [progress, setProgress] = useState(0);
  const [btnStatus, setBtnStatus] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false)
  
  // Fetch Task
const fetchTask = async () => {
  try {
    const res = await axiosClient.get(`tasks/${idSlug}`);
    const taskData = res.data.data;
    setTask(taskData);

    if (Array.isArray(taskData.tepDinhKem) && taskData.tepDinhKem.length > 0) {
      setTaskUploads(taskData.tepDinhKem); // Gán trực tiếp
      setProgress(100);
      setBtnStatus(true);
    }

    if (["Đã nộp", "Nộp trễ"].includes(taskData.trangThai)) {
      setBtnStatus(true);
    }
  } catch (error) {
    console.error("Lỗi khi fetch task:", error);
  }
};

  // Fetch Comments
  const fetchTaskComments = async () => {
    try {
      const res = await axiosClient.get(`/task-comments/${idSlug}`);
      setComments(res.data);
    } catch (error) {
      console.error("Lỗi khi fetch nhận xét:", error);
    }
  };

  // Submit Comment
  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    try {
      await axiosClient.post("/task-comments", {
        task_id: idSlug,
        noi_dung: newComment,
        user_type: "App\\Models\\SinhVien",
        user_id: maSV,
      });

      await fetchTaskComments();
      setNewComment("");
    } catch (error) {
      alert("Gửi nhận xét thất bại.");
    }
  };

  // Upload File
 const handleUpload = async () => {
  const formData = new FormData();

  // Append từng file vào formData
  if (taskUploads && taskUploads.length > 0) {
 taskUploads.forEach((fileObj) => {
  formData.append("task[]", fileObj.file); // đúng định dạng
});
  }

  try {
    const res = await axiosClient.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (e) => {
        const percent = Math.round((e.loaded * 100) / e.total);
        setProgress(percent);
      },
    });

    // Trả về mảng đường dẫn
    return res.data.paths || [];
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.errors?.files?.[0] ||
      error.message ||
      "Đã xảy ra lỗi không xác định.";
    alert("Lỗi upload: " + message);
    throw error;
  }
};


  // Confirm Upload Task
const handleConfirmUpTask = async () => {
  if (!taskUploads) {
    Swal.fire({
      icon: "warning",
      title: "Thiếu tệp đính kèm",
      text: "Vui lòng chọn file để nộp trước khi hoàn thành task!",
    });
    return;
  }

  try {
    const res = await handleUpload();
    const filePath = res?.task;

    if (!filePath) {
      Swal.fire({
        icon: "error",
        title: "Lỗi tải tệp",
        text: "Tệp không được tải lên thành công. Vui lòng thử lại.",
      });
      return;
    }

    const today = dayjs();
    const deadline = dayjs(task.hanHoanThanh);
    const status = today.isAfter(deadline, "day") ? "Nộp trễ" : "Đã nộp";

  await axiosClient.put(`/tasks/${idSlug}/update-status`, {
  trangThai: status,
  tepDinhKem: filePath, // gửi nguyên mảng
});

    setBtnStatus(true);

    Swal.fire({
      icon: "success",
      title: "Thành công",
      text: "Đã hoàn thành task!",
    });

    fetchTask(); // reload lại task
  } catch (error) {
    console.error("Lỗi khi hoàn thành task:", error);
    Swal.fire({
      icon: "error",
      title: "Lỗi cập nhật",
      text: "Có lỗi khi cập nhật task. Vui lòng thử lại.",
    });
  }
};

  // Mở dialog xác nhận
  const handleOpenDialog = () => {
    showDialog({
      title: "Hoàn thành task",
      content:
        "Sau khi bạn ấn hoàn thành, task sẽ được đánh dấu hoàn tất và không thể chỉnh sửa. Vui lòng kiểm tra kỹ thông tin trước khi nộp.",
      icon: <BsListTask />,
      confirmText: "Hoàn thành",
      cancelText: "Không, tôi muốn kiểm tra lại",
      onConfirm: handleConfirmUpTask,
    });
  };

  // Chọn file
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const handleFileChange = (e) => {
  const files = Array.from(e.target.files);
  const validFiles = [];

  files.forEach((file) => {
    if (file.size <= MAX_FILE_SIZE) {
      validFiles.push({ file, name: file.name, progress: 0 });
    } else {
Swal.fire({
  icon: "error",
  title: "File quá lớn",
  text: `File "${file.name}" vượt quá 10MB`,
});

    }
  });

  setTaskUploads((prev) => [...prev, ...validFiles]);
   e.target.value = "";
};


  // Xóa file
const handleRemove = (indexToRemove) => {
  console.log(indexToRemove);
  
  setTaskUploads((prev) => prev.filter((_, i) => i !== indexToRemove));
};


  // Trạng thái màu
  const getStatusColor = (trangThai) => {
    switch (trangThai) {
      case "Chưa nộp":
        return "#ff6600";
      case "Đã nộp":
        return "#6EE7B7";
      case "Nộp trễ":
        return "#FCA5A5";
      default:
        return "#E5E7EB";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Cao":
        return "#EF4444";
      case "Trung bình":
        return "#F59E0B";
      case "Thấp":
        return "#10B981";
      default:
        return "#9CA3AF";
    }
  };

  // Load dữ liệu khi khởi động
useEffect(() => {
  const loadData = async () => {
    setLoading(true);
    try {
      if (idSlug) {
        await fetchTask(); // Đảm bảo chờ fetch xong
        await fetchTaskComments();
      }
    } catch (error) {
      console.error("Lỗi khi load dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  loadData();
}, [idSlug]);




  return (
     
   <>
     {loading ? (<div className="flex justify-center items-center py-10">
            <div role="status">
        <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-green-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
        <span className="sr-only">Loading...</span>
    </div>
            </div>
              ) : (
      <div className="flex-1 mt-5 p-4 border border-gray-100 bg-white rounded-md w-full">
  {/* Header */}
  <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 pb-4 border-b border-gray-200">
    {/* Left */}
    <div className="flex gap-3 items-center">
      <div className="bg-gray-100 p-4 rounded-md h-fit">
        <MdUploadFile className="text-2xl" />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-bold break-words">{task.tieuDe || 'tieu de'}</h2>
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <FaRegCalendarAlt />
            <span>{new Date(task.hanHoanThanh).toLocaleDateString("vi-VN")||'unknow'}</span>
          </div>
          <span
            style={{ backgroundColor: getStatusColor(task.trangThai) }}
            className="px-3 py-1 text-white rounded-full text-xs"
          >
            {task.trangThai || 'trang thai'}
          </span>
          <span
            style={{ backgroundColor: getPriorityColor(task.doUuTien) }}
            className="px-3 py-1 text-white rounded-full text-xs flex items-center gap-1"
          >
            <FaFlag /> {task.doUuTien || 'cao'}
          </span>
        </div>
      </div>
    </div>

    {/* Delete button */}
    <div>
   <button
  type="button"
  disabled={btnStatus}
  onClick={handleOpenDialog}
  className={`cursor-pointer py-2.5 px-5 me-2 mb-2 text-sm font-medium rounded-full border flex items-center gap-2 transition
    ${btnStatus
      ? 'text-gray-500 bg-gray-100 border-gray-200 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600'
      : 'text-gray-900 bg-white border-gray-200 hover:bg-gray-100 hover:text-green-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:text-white dark:hover:bg-green-700 dark:border-gray-600'
    }`}
>
  {btnStatus ? <><FaCheckCircle /> Hoàn thành</> : <><FaUpload /> Nộp Task</>}
</button>

    </div>
  </div>

  {/* Description */}
  <div className="mb-6 border-b pb-5 border-gray-200">
    <h3 className="font-bold text-lg">Mô tả</h3>
    <p className="text-gray-600 text-base whitespace-pre-wrap">{task.noiDung || 'Noi dung'}</p>
  </div>

  {/* Người thực hiện */}
  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">Thành viên thực hiện</h3>
      {task.sinh_viens?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2">
          {task.sinh_viens.map((sv) => (
            <div key={sv.maSV} className="flex items-center gap-3 mb-4">
              <img src={avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
              <div>
                <p className="font-semibold">{sv.hoTen}</p>
                <p className="text-green-600 text-sm">{sv.viTri}</p>
                <p className="text-gray-400 text-xs">{sv.email}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="italic text-sm text-gray-500">Chưa có sinh viên thực hiện</p>
      )}
    </div>

  {/* Nộp bài */}
{/* Nộp bài */}
<div className="mt-6 border-y py-5 border-gray-200">
  <h3 className="font-bold text-lg mb-4 ">Nộp Bài</h3>

  {/* Ô chọn file nếu chưa nộp */}
  {!task?.tepDinhKem && (
    <div className="mb-6 lg:w-[60%] lg:mx-auto">
      <label
        htmlFor="file-upload"
        className="block border-2 border-dashed border-green-400 rounded p-6 cursor-pointer hover:bg-green-50 transition"
      >
         <div className="flex flex-col items-center justify-center mb-2">
           <svg className="w-6 h-6 text-green-700" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h5v-2H4V5h12v10h-5v2h5a2 2 0 002-2V5a2 2 0 00-2-2H4z" />
                    <path d="M9 12h2V8h3l-4-4-4 4h3v4z" />
                  </svg>
                   <p className="text-green-700 font-medium">Click hoặc kéo file vào đây để tải lên</p>
                   <p className="text-xs text-gray-500 mt-1">Hỗ trợ nhiều file (PDF, hình ảnh...)</p>
         </div>
      </label>
      <input
        id="file-upload"
        type="file"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  )}

  {/* Danh sách file đã nộp hoặc đã chọn */}
  {(taskUploads.length > 0 || task?.tepDinhKem) && (
    <div className="w-full lg:w-[60%] lg:mx-auto space-y-3">
      {taskUploads.map((fileObj, index) => {
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



  {/* điểm */}
  <div className="border-b py-4 border-gray-200">
    <h3 className="font-bold text-lg">Điểm Số</h3>
   {!task.diemSo?
   (
  <p className="italic text-sm text-gray-500">Chưa chấm điểm</p>
   )
   :
   (
<p className="inline-block bg-gradient-to-br from-green-700 to-lime-600 text-white text-xl font-bold px-3 py-1 rounded-lg shadow-lg">
  {task.diemSo||0}
</p>





   )

   }


  </div>

  {/* Nhận xét */}
  <div className="mt-3">
    <h3 className="font-bold text-lg mb-3">Nhận Xét</h3>

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


    {/* Ghi nhận xét mới */}
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
</div>)}
</>
)
 
}

export default TaskStudent;
