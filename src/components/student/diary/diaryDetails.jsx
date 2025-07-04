import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../header";
import ResponNav from "../../responsiveNav";
import { MdChevronRight, MdOutlineEmail } from "react-icons/md";
import avatar from "../../../assets/images/avatar.png";
import { BsSave } from "react-icons/bs";
import { RiDeleteBin6Line, RiShoppingBag3Line } from "react-icons/ri";
import { FaRegSave } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { FiPlus } from "react-icons/fi";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
dayjs.extend(isoWeek);
import axiosClient from "../../../service/axiosClient";
function DiaryDetails() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1025);
  const { idSlug } = useParams();
  const [showInput, setShowInput] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  // const maSV = localStorage.getItem('maSV')
  const email = localStorage.getItem('email')
  const hoTen = localStorage.getItem('hoTen')
  const viTri = localStorage.getItem('viTri')
  const [loading, setLoading] = useState(false)
  const [diary, setDiary] = useState(null)
  let tieuDe = diary?.noiDung || 'Unknow'
  const [editTask, setEditTask] = useState({
    tenCongViec: "",
    ketQua: "",
    tienDo: "Chưa xong",
  });
  const [taskInput, setTaskInput] = useState({
    tenCongViec: "",
    ketQua: "",
    tienDo: "Chưa xong",
  });

function getWeekRange(dateString) {
  const startOfWeek = dayjs(dateString).startOf("isoWeek");
  const endOfWeek = startOfWeek.add(6, "day");

  return `Ngày ${startOfWeek.format("DD/MM")} - ${endOfWeek.format("DD/MM")}`;
}

function getWeekDates(selectedDate) {
  const inputDate = dayjs(selectedDate);
  const monday = inputDate.startOf("isoWeek"); // Bắt đầu từ Thứ 2
  const weekDates = [];

  for (let i = 0; i < 7; i++) {
    const currentDay = monday.add(i, "day");
    weekDates.push({
      label: i === 6 ? "Chủ nhật" : `Thứ ${i + 2}`, // i=6 là Chủ nhật
      date: currentDay.format("DD/MM"),
      fullDate: currentDay.format("YYYY-MM-DD"),
      isToday: currentDay.isSame(dayjs(), "day"),
      isSelected: currentDay.isSame(dayjs(selectedDate), "day"),
    });
  }

  return weekDates;
}

const handleStatusDiary = (id) => {
  axiosClient.put(`/nhat-ky/${id}/trang-thai`)
    .then((res) => {
      setDiary(res.data.data); // cập nhật lại trạng thái mới
    })
    .catch((err) => console.error(err));
};
  

const handleAddTask = () => {
  if (!taskInput.tenCongViec.trim() || !taskInput.ketQua.trim()) {
    alert("Vui lòng nhập đầy đủ thông tin.");
    return;
  }

  axiosClient.post(`/nhat-ky/${idSlug}/chi-tiet`, taskInput)
    .then(() => {
      fetchTask(); 
      setTaskInput({ tenCongViec: "", ketQua: "", tienDo: "Chưa xong" });
      setShowInput(false);
    })
    .catch((err) => console.error(err));
};

  
  const handleEditTask = (index) => {
  const task = diary.chi_tiet_nhat_kies[index];
  setEditIndex(index);
  setEditTask({
    tenCongViec: task.tenCongViec || "",
    ketQua: task.ketQua || "",
    tienDo: task.tienDo || "Chưa xong",
  });
};

const handleDeleteTask = (index) => {
  const item = diary.chi_tiet_nhat_kies[index];

  const confirmDelete = window.confirm(`Bạn có chắc chắn muốn xoá công việc "${item.tenCongViec}" không?`);

  if (!confirmDelete) return;

  axiosClient
    .delete(`/nhat-ky/${idSlug}/chi-tiet/${item.id}`)
    .then(() => fetchTask())
    .catch((err) => console.error(err));
};


const handleSaveEdit = () => {
  const original = diary.chi_tiet_nhat_kies[editIndex];

  // So sánh nếu không có gì thay đổi thì không gọi API
  if (
    editTask.tenCongViec === original.tenCongViec &&
    editTask.ketQua === original.ketQua &&
    editTask.tienDo === original.tienDo
  ) {
    alert("Không có thay đổi nào để lưu.");
    setEditIndex(null); // Thoát chế độ sửa
    return;
  }

  // Có thay đổi -> gọi API cập nhật
  axiosClient
    .put(`/nhat-ky/${idSlug}/chi-tiet/${original.id}`, editTask)
    .then(() => {
      fetchTask();
      setEditIndex(null);
    })
    .catch((err) => console.error(err));
};


  const fetchTask = ()=>{
         setLoading(true)
         axiosClient.get(`/nhat-ky/${idSlug}`)
         .then((res)=>{
           setDiary(res.data.data)
         })
         .catch((err)=>{
          console.log(err);
          
         })
         .finally(()=>{
          setLoading(false)
         })
  }

  useEffect(()=>{
    fetchTask()
  },[])

  const today = dayjs().format("DD/MM/YYYY"); // hôm nay
  const monday = dayjs().startOf("week").add(1, "day");

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = monday.add(i, "day");
    return {
      label: `Thứ ${i + 2}`,
      date: day.format("DD/MM"),
      full: day.format("DD/MM/YYYY"),
      isToday: day.format("DD/MM/YYYY") === today,
    };
  });

  const statusColor = (status) => {
    if (status === "Hoàn thành") return "text-green-500";
    if (status === "Chưa xong") return "text-yellow-500";
    return "text-gray-500";
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1025);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div className="flex-1">
      {isMobile ? (
        <ResponNav />
      ) : (
        <Header>
          <h2 className="text-xl font-semibold">Viết Nhật Ký</h2>
          <p className="flex gap-2 items-center">
            Danh Sách Nhật Ký <MdChevronRight className="text-xl" /> Chi Tiết Nhật Ký
          </p>
        </Header>
      )}
      <div className="border border-gray-300 p-4 mt-10 rounded-md shadow">
        <div className="flex flex-col items-center gap-4 pb-5 border-b border-gray-300 lg:flex-row lg:justify-between">
          {/* avatar + info */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:items-start">
            <img
              src={
                // students.duLieuKhuonMat ? `${apiBaseURL}/${students.duLieuKhuonMat}` :
                avatar
              }
              alt="avartar"
              className="w-24 sm:w-20 aspect-square rounded-md border border-gray-300"
            />
            <div className="text-center sm:text-left">
              <h1 className="text-xl font-bold">
                {hoTen || "Nguyen Van A"}
              </h1>
              <h4 className="flex items-center gap-1 text-lg text-gray-600 justify-center sm:justify-start">
                <RiShoppingBag3Line className="text-2xl" />
                {viTri || "Sale mana"}
              </h4>
              <h4 className="flex items-center gap-1 text-lg text-gray-600 justify-center sm:justify-start">
                <MdOutlineEmail className="text-2xl" />
                {email || "ddos@gmail.com"}
              </h4>
            </div>
          </div>

          {/* buttons */}
          <div className="flex flex-col sm:flex-row gap-2">
     <button
  onClick={() => handleStatusDiary(idSlug)}
  className={`cursor-pointer p-3 flex items-center gap-2 rounded-md justify-center ${
    diary?.trangThai === "Hoàn thành" ?   "bg-[#34A853] text-white" : "bg-white border border-gray-300 text-gray-500 hover:bg-gray-400 hover:text-gray-700"
  }`}
>
  <FaRegSave />
  {diary?.trangThai === "Hoàn thành" ? "Hoàn thành" : "Đánh dấu Hoàn thành"}
</button>


          </div>
        </div>
        <div className="bg-white p-6">
          <h2 className="text-xl font-bold mb-2">{tieuDe}</h2>
          <p className="text-gray-500 mb-4">  {diary?.ngayTao ? getWeekRange(diary.ngayTao) : ""}</p>

          {/* Calendar header */}
          <div className="flex gap-2 mb-6">
            {diary?.ngayTao &&
  getWeekDates(diary.ngayTao).map((day, index) => (
              <div
                key={day.date}
                  className={`text-center py-2 px-4 rounded-lg border border-gray-300 
        ${day.isSelected ? "bg-blue-600 text-white" : 
          day.isToday ? "bg-green-600 text-white" : "bg-gray-100"}`}
              >
                <div className="text-sm font-medium">{day.label}</div>
                <div className="text-lg font-semibold">
                  {day.date.split("/")[0]}
                </div>
              </div>
            ))}
          </div>

          {/* Table header */}
        {loading ? (
        <div className="flex justify-center items-center py-10">
          <div role="status">
            <svg
              aria-hidden="true"
              className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-green-500"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ):(<>
       <div className="grid grid-cols-12 text-gray-500 text-sm font-medium border-b border-gray-300  pb-2">
            <div className="col-span-3">Tên Công Việc</div>
            <div className="col-span-5">Kết Quả Thực Hiện</div>
            <div className="col-span-2">Tiến Độ</div>
            <div className="col-span-2">Hành Động</div>
          </div>

          {/* Task rows */}
          {diary?.chi_tiet_nhat_kies?.map((task, idx) => (
            <div
              key={idx}
              className="grid grid-cols-12 py-2 items-center border-b border-gray-300  text-sm"
            >
              {editIndex === idx ? (
                <>
                  <input
                    className="col-span-3 border rounded px-2 py-1"
                    placeholder={task.tenCongViec}
                    value={editTask.tenCongViec ?? ""}
                    onChange={(e) =>
                      setEditTask({ ...editTask, tenCongViec: e.target.value })
                    }
                  />
                  <input
                    className="col-span-5 border rounded px-2 py-1"
                    placeholder={task.ketQua}
                    value={editTask.ketQua ?? ""}
                    onChange={(e) =>
                      setEditTask({ ...editTask, ketQua: e.target.value })
                    }
                  />
                  <select
                    className="col-span-2 border rounded px-2 py-1"
                    value={editTask.tienDo ?? ""}
                    onChange={(e) =>
                      setEditTask({ ...editTask, tienDo: e.target.value })
                    }
                  >
                    <option value="Hoàn thành">Hoàn thành</option>
                    <option value="Chưa xong">Chưa xong</option>
                  </select>
                  <div className="col-span-2 flex gap-2">
                    <button onClick={handleSaveEdit} className="text-green-600">
                      ✔
                    </button>
                    <button
                      onClick={() => setEditIndex(null)}
                      className="text-red-600"
                    >
                      ✖
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="col-span-3 font-medium text-gray-700">
                    {task.tenCongViec ?? ""}
                  </div>
                  <div className="col-span-5 text-gray-600">{task.ketQua ?? ""}</div>
                  <div
                    className={`col-span-2 font-semibold ${statusColor(
                      task.tienDo
                    )}`}
                  >
                    {task.tienDo ?? ""}
                  </div>
                  <div className="col-span-2 flex gap-3">
                    <button onClick={() => handleEditTask(idx)}>
                      <CiEdit className="text-xl" />
                    </button>
                    <button onClick={() => handleDeleteTask(idx)}>
                      <RiDeleteBin6Line className="text-xl" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}

          {showInput && (
            <div className="grid grid-cols-12 gap-2 py-2 items-center border-b text-sm">
              <input
                type="text"
                placeholder="Nhập tên công việc"
                value={taskInput.tenCongViec ?? ""}
                onChange={(e) =>
                  setTaskInput({ ...taskInput, tenCongViec: e.target.value })
                }
                className="col-span-3 border rounded px-2 py-1"
              />
              <input
                type="text"
                placeholder="Nhập kết quả thực hiện"
                value={taskInput.ketQua ?? ""}
                onChange={(e) =>
                  setTaskInput({ ...taskInput, ketQua: e.target.value })
                }
                className="col-span-5 border rounded px-2 py-1"
              />
              <select
                value={taskInput.tienDo ?? ""}
                onChange={(e) =>
                  setTaskInput({ ...taskInput, tienDo: e.target.value })
                }
                className="col-span-2 border rounded px-2 py-1 "
              >
                <option value="Hoàn thành" className="text-green-500">
                  Hoàn thành
                </option>
                <option value="Chưa xong" className="text-yellow-500">
                  Chưa xong
                </option>
              </select>
              <div className="col-span-2 flex justify-end gap-2">
                <button
                  onClick={handleAddTask}
                  className="text-green-600 font-medium"
                >
                  ✔
                </button>
                <button
                  onClick={() => setShowInput(false)}
                  className="text-red-600 font-medium"
                >
                  ✖
                </button>
              </div>
            </div>
          )}

          <div className="flex justify-center mt-6">
            <button
              onClick={() => setShowInput(true)}
              className="cursor-pointer flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-md text-sm hover:bg-gray-100"
            >
              <FiPlus className="text-2xl" /> Thêm công việc
            </button>
          </div>
        </>)
        }
        </div>
      </div>
    </div>
  );
}

export default DiaryDetails;
