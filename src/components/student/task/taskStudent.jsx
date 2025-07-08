import { FaRegCalendarAlt, FaFlag, FaTrashAlt, FaFileAlt, FaCheckCircle } from "react-icons/fa";
import { LuShoppingBag } from "react-icons/lu";
import { FiSend } from "react-icons/fi";
import avatar from "../../../assets/images/avatar.png";
import { FaRegTrashCan, FaTrashCan, FaUpload } from "react-icons/fa6";
import { useEffect, useRef, useState } from "react";
import axiosClient from "../../../service/axiosClient";
import { useNavigate, useParams } from "react-router-dom";
import UploadSection from "../../UploadSelection";
import { BsEyeFill, BsListTask } from "react-icons/bs";
import { useDialog } from "../../../context/dialogContext";
import dayjs from "dayjs";
function TaskStudent() {
 const navigate = useNavigate()

 const [btnStatus, setBtnStatus] = useState(false)
 const {idSlug} = useParams()
 const [task,setTask] = useState({})
 const maSV = localStorage.getItem('maSV')
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


const handleComfirmUpTask = async () => {
  try {
    if (!taskUpload) {
      alert("Vui lòng chọn file để nộp trước khi hoàn thành task!");
      return;
    }

    const res = await handleUpload();
    const filePath = res?.task

    if (!filePath) {
      alert("Tệp không được tải lên thành công. Vui lòng thử lại.");
      return;
    }

        // Kiểm tra ngày hiện tại so với hạn hoàn thành
    const today = dayjs(); // ngày hôm nay
    const deadline = dayjs(task.hanHoanThanh); // ngày hạn

    const status = today.isAfter(deadline, "day") ? "Nộp trễ" : "Đã nộp";

    await axiosClient.put(`/tasks/${idSlug}/update-status`, {
      trangThai: status,
      tepDinhKem: filePath,
    });

    setBtnStatus(true); // Đánh dấu đã hoàn thành
    alert("Đã hoàn thành task!");
  } catch (error) {
    console.error("Lỗi khi hoàn thành task:", error);
    alert("Có lỗi khi cập nhật task. Vui lòng thử lại.");
  }
};




  const {showDialog} = useDialog()
    //  dialog
  const handleOpenDialog = () => {
    showDialog({
      title: "Hoàn thành task",
      content:
        "Sau khi bạn ấn hoàn thành task sẽ được đánh dấu hoàn tất và không thể chỉnh sửa. Vui lòng kiểm tra kỹ thông tin trước khi ấn",
      icon: <BsListTask />,
      confirmText: "Hoàn thành",
      cancelText: "Không, tôi muốn kiểm tra lại",
      onConfirm: handleComfirmUpTask
  })}


    const [taskUpload, setTaskUpload] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setTaskUpload(selectedFile);
      // Giả lập progress (bạn thay bằng logic upload thật nếu cần)
      let value = 0;
      const interval = setInterval(() => {
        value += 10;
        setProgress(value);
        if (value >= 100) clearInterval(interval);
      }, 100);
    }
  };

  const handleRemove = () => {
    setTaskUpload(null);
    setProgress(0);
  };


  // upload
  const handleUpload = async () => {
    const formData = new FormData();
  
    if (taskUpload) formData.append("task", taskUpload);
  
    try {
      const res = await axiosClient.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          const percent = Math.round((e.loaded * 100) / e.total);
          setProgress(percent);
        },
      });
  
      console.log("Response data upload:", res.data);
  
      const { avatar, cv, task } = res.data.paths || res.data;
  
      return { avatar, cv, task };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.errors?.avatar?.[0] ||
        error.response?.data?.errors?.cv?.[0] ||
        error.message ||
        "Đã xảy ra lỗi không xác định.";
  
      alert("Lỗi upload: " + message);
      throw error;
    }
  };
  
useEffect(() => {
  axiosClient.get(`tasks/${idSlug}`)
    .then((res) => {
      const taskData = res.data.data;
      setTask(taskData);

      // Nếu đã có file đính kèm => gán lại
      if (taskData.tepDinhKem) {
        setTaskUpload({
          name: taskData.tepDinhKem.split('/').pop(), // Lấy tên file từ đường dẫn
          url: `${import.meta.env.VITE_API_BASE_URL}/${taskData.tepDinhKem}`
        });
        setProgress(100);
        setBtnStatus(true);
      }

      if (taskData.trangThai === "Đã nộp" || taskData.trangThai === "Nộp trễ") {
        setBtnStatus(true);
      }
    });
}, []);

//comments
const [comments, setComments] = useState([]);
const fetchTaskComments = async (taskId) => {
  try {
    const res = await axiosClient.get(`/task-comments/${taskId}`);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi fetch nhận xét:", error);
    return [];
  }
}

useEffect(() => {
  if (idSlug) {
    fetchTaskComments(idSlug).then((data) => setComments(data));
  }
}, [idSlug]);

// push new comment

const [newComment, setNewComment] = useState("");

const handleSubmitComment = async () => {
  if (!newComment.trim()) return;

  try {
    await axiosClient.post("/task-comments", {
      task_id: idSlug,
      noi_dung: newComment,
      user_type: 'App\\Models\\SinhVien',
      user_id: maSV
    });

    const updatedComments = await fetchTaskComments(idSlug);
    setComments(updatedComments);
    setNewComment("");
  } catch (error) {
    alert("Gửi nhận xét thất bại.");
  }
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
    <button
      disabled={btnStatus}
      onClick={handleOpenDialog}
      className= {`cursor-pointer py-2 px-4  ${btnStatus ? 'bg-gray-400 text-black':'bg-green-500 text-white'} border border-gray-300 rounded-md text-sm hover:text-black flex items-center gap-2 self-start`}
    >
      { btnStatus ? <><FaCheckCircle /> Hoàn thành </>: <><FaUpload /> Nộp Task </> }
    </button>
  </div>

  {/* Description */}
  <div className="mb-6 border-b pb-5 border-gray-200">
    <h3 className="font-bold text-lg mb-2">Mô tả</h3>
    <p className="text-gray-600 text-base whitespace-pre-wrap">{task.noiDung || 'Noi dung'}</p>
  </div>

  {/* Người thực hiện */}
  <div className="mb-6 border-b pb-5 border-gray-200">
    <h3 className="font-bold text-lg mb-2">Thực Hiện</h3>
    <div className="flex items-center gap-3">
      <img src={avatar} alt="avatar" className="w-10 h-10 border rounded-full object-cover" />
      <div>
        <p className="font-semibold text-base">{task?.sinh_vien?.hoTen || "Jack"}</p>
        <p className="text-green-500 text-sm">{task?.sinh_vien?.viTri || "FE credit"}</p>
      </div>
    </div>
  </div>

  {/* Chấm điểm */}
  <div className="mb-6 border-b pb-5 border-gray-200">
   {!taskUpload ? (
    <>
            <label
              htmlFor="cv-upload"
              className="block w-full lg:w-[60%] lg:mx-auto lg:my-5 border-2 border-dashed border-green-400 rounded p-6 text-center cursor-pointer hover:bg-green-50 transition"
            >
              <div className="flex justify-center mb-2">
                <div className="bg-green-700 text-white p-2 rounded-md">
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h5v-2H4V5h12v10h-5v2h5a2 2 0 002-2V5a2 2 0 00-2-2H4z" />
                    <path d="M9 12h2V8h3l-4-4-4 4h3v4z" />
                  </svg>
                </div>
              </div>
              <p>
                Drag & Drop or{" "}
                <span className="text-green-600 underline">choose file</span> to
                upload
              </p>
              <p className="text-xs text-gray-500">
                supported formats: .jpeg, .pdf
              </p>
            </label>
            <input
  id="cv-upload"
  type="file"
  className="hidden"
  onChange={handleFileChange}
/> </>

          ) : (
            <div className="w-full lg:w-[60%] lg:mx-auto border border-green-400 rounded-lg p-4 relative bg-green-50">
              <div className="flex items-center space-x-4">
                <FaFileAlt className="text-orange-400" />
                <div className="flex-1">
                  <p className="font-medium text-sm">{taskUpload.name}</p>
                  <div className="w-full bg-gray-200 rounded h-2 mt-2">
                    <div
                      className="bg-green-500 h-2 rounded"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                 <div className="flex gap-1 items-center">
                               <button
  className="cursor-pointer text-green-500"
  onClick={() => {
    if (taskUpload instanceof File) {
      // Nếu là File vừa upload
      window.open(URL.createObjectURL(taskUpload), '_blank');
    } else if (taskUpload?.url) {
      // Nếu là link đã có
      window.open(taskUpload.url, '_blank');
    } else {
      alert("Không thể xem file.");
    }
  }}
>
  <BsEyeFill className="text-2xl" />
</button>

                                {taskUpload?.url ? "":(<button
                                  className="text-red-500 hover:text-red-700 cursor-pointer"
                                  onClick={handleRemove}
                                  aria-label="Xóa file"
                                >
                                  <FaTrashCan className="w-5 h-5" />
                                </button>)}
                              </div>
              </div>
            </div>
          )}
  </div>

  {/* Nhận xét */}
  <div>
    <h3 className="font-bold text-lg mb-2">Nhận Xét</h3>

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
          {comment.user_type.includes("Admin") ? "Admin" : "Sinh viên"}
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
  className="w-full border-2 border-gray-300 rounded-md p-2 pr-10 text-sm resize-none"
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

  );
}

export default TaskStudent;
