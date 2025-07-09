import { RiShoppingBag3Line } from "react-icons/ri";
import avatar from "../assets/images/avatar.png";
import { MdOutlineDone, MdOutlineEmail } from "react-icons/md";
import { useDialog } from "../context/dialogContext";
import { useToast } from "../context/toastContext";
import { BiEdit, BiTrash } from "react-icons/bi";
import ViewModeCalendar from "./calendar/viewModeCalendar";
import Toast from "./toast";
import { BsFillPeopleFill } from "react-icons/bs";
import ScheduleGrid from "./calendar/scheduleGrid";
import ScheduleMonthGrid from "./calendar/scheduleMonthGrid";
import { useEffect, useState } from "react";
import axiosClient from "../service/axiosClient";
import { useParams } from "react-router-dom";
import { AiOutlineSwap } from "react-icons/ai";
function ScheduleDetails() {
  const { showDialog } = useDialog();
  const { isToast, setToast } = useToast();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("week");
  const [currentWeek, setCurrentWeek] = useState(0);
  const [student,setStudent] = useState({})
  const { idSlug } = useParams();
  const userRole = localStorage.getItem('role')
  const param = localStorage.getItem('maSV')?localStorage.getItem('maSV'):idSlug
  

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

// Tính tuần trong tháng
const getWeekOfMonth = (date) => {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const firstMondayOffset = (firstDay.getDay() + 6) % 7; // Mon = 0
  return Math.floor((date.getDate() + firstMondayOffset - 1) / 7) + 1;
};


const currentWeek_ = getWeekOfMonth(now);


  const fetchSchedule = async () => {
    if (!param) return;
    setLoading(true);

    let url = "/lich/theo-tuan";
    const params = { maSV: param, week: currentWeek };

    if (viewMode === "month") {
      url = "/lich/theo-thang";
      params.month = new Date().getMonth() + 1; // hoặc state month
      params.year = new Date().getFullYear();
    } 

    try {
      const res = await axiosClient.get(url, { params });
      setEvents(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy lịch:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteById = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa lịch này?")) return;

    try {
      const res = await axiosClient.delete(`/lich/${id}`);
      alert(res.data.message || "Đã xóa lịch.");
      fetchSchedule(); // cập nhật lại danh sách
    } catch (error) {
      console.error(error);
      alert("Không thể xóa lịch.");
    }
  };

  const handleDeleteAll = async () => {
    try {
      const res = await axiosClient.delete(`/lich/sinhvien/${param}`);
      alert(res.data.message || "Đã xóa toàn bộ lịch.");
      fetchSchedule();
    } catch (error) {
      alert("Không thể xóa toàn bộ lịch.");
    }
  };
  useEffect(()=>{
    axiosClient.get(`/sinhviens/${param}`)
    .then((res)=>{
      setStudent(res.data.data)
      console.log(res.data.data);
      
    })
  },[param])

  useEffect(() => {
    fetchSchedule();
  }, [param, currentWeek, viewMode]);

  const handleOpenDialogDelete = () => {
    showDialog({
      title: "Xác nhận xóa lịch thực tập",
      content:
        "Sau khi xóa lịch thực tập thì lịch thực tập của sinh viên sẽ được xóa khỏi danh sách.",
      icon: <BsFillPeopleFill />,
      confirmText: "Xóa",
      cancelText: "Không, tôi muốn kiểm tra lại",
      onConfirm: () => {
        handleDeleteAll();
        // setToast(true)
      },
    });
  };
const handleOpenDialog = () => {
  let selectedThu = "Mon";
  let selectedCa = "8:00-12:00";

  showDialog({
    title: "Thêm lịch",
    customContent: (
      <div className="flex flex-col mt-5">
        <label className="font-semibold text-xl" htmlFor="thu">
          Thứ
        </label>
        <select
          className="border border-gray-300 p-3 rounded-md"
          id="thu"
          onChange={(e) => (selectedThu = e.target.value)}
        >
          <option value="Mon">Thứ 2</option>
          <option value="Tue">Thứ 3</option>
          <option value="Wed">Thứ 4</option>
          <option value="Thu">Thứ 5</option>
          <option value="Fri">Thứ 6</option>
        </select>

        <label className="font-semibold text-xl mt-3" htmlFor="ca">
          Ca
        </label>
        <select
          className="mb-20 border border-gray-300 p-3 rounded-md"
          id="ca"
          onChange={(e) => (selectedCa = e.target.value)}
        >
          <option value="8:00-12:00">Ca sáng: 8:00 - 12:00</option>
          <option value="13:00-17:00">Ca chiều: 13:00 - 17:00</option>
        </select>
      </div>
    ),

    confirmText: "Áp dụng",
    cancelText: "Đặt lại",
    onConfirm: async () => {
      try {
        const res = await axiosClient.post("/lich", {
            maSV: idSlug,
            thu: selectedThu,
            ca: selectedCa,
            currentWeek: currentWeek, // -1, 0, 1
            month: currentMonth,
            year: currentYear,
        });

        alert(res.data.message);
        fetchSchedule(); // cập nhật lại dữ liệu
      } catch (err) {
        if (err.response && err.response.status === 409) {
          alert("Lịch bị trùng khung giờ");
        } else {
          alert("Lỗi khi thêm lịch");
          console.error(err);
        }
      }
    },
  });
};
const handleOpenDialogSwap = () => {
  showDialog({
    title: "Đề xuất đổi lịch",
    customContent: <SwapScheduleForm />,
    confirmText: "Gửi yêu cầu",
    cancelText: "Hủy",
    onConfirm: () => {}, // sẽ xử lý trong form luôn
  });
};

const SwapScheduleForm = () => {
  const [selectedThu, setSelectedThu] = useState("Mon");
  const [selectedCa, setSelectedCa] = useState("8:00-12:00");
  const [newThu, setNewThu] = useState("Thu");
  const [newCa, setNewCa] = useState("13:00-17:00");
  const [changeType, setChangeType] = useState("doi");
  const [reason, setReason] = useState("");

  // Khi người dùng bấm xác nhận trong dialog
  const handleSubmit = async () => {
    // const payload = {
    //   maSV: idSlug,
    //   caCu: { thu: selectedThu, ca: selectedCa },
    //   loai: changeType,
    //   lyDo: reason,
    // };

    // if (changeType === "doi") {
    //   payload.caMoi = { thu: newThu, ca: newCa };
    // }

    // try {
    //   const res = await axiosClient.post("/de-xuat-doi-ca", payload);
    //   alert(res.data.message);
    //   fetchSchedule();
    // } catch (err) {
    //   alert("Gửi yêu cầu thất bại");
    //   console.error(err);
    // }
  };

  // Gửi tự động khi dialog gọi onConfirm
  useEffect(() => {
    const listener = () => handleSubmit();
    window.addEventListener("dialogConfirm", listener);
    return () => window.removeEventListener("dialogConfirm", listener);
  }, [selectedThu, selectedCa, newThu, newCa, changeType, reason]);

  return (
    <div className="flex flex-col gap-3 mt-2">
      {/* Ca cần thay đổi */}
      <label className="font-medium">Chọn ca cần thay đổi:</label>
      <select
        className="border border-gray-300 p-2 rounded-md"
        onChange={(e) => {
          const [thu, ca] = e.target.value.split("|");
          setSelectedThu(thu);
          setSelectedCa(ca);
        }}
      >
        <option value="Mon|8:00-12:00">Thứ 2, Ca sáng</option>
        <option value="Mon|13:00-17:00">Thứ 2, Ca chiều</option>
        <option value="Tue|8:00-12:00">Thứ 3, Ca sáng</option>
        <option value="Tue|13:00-17:00">Thứ 3, Ca chiều</option>
        <option value="Wed|8:00-12:00">Thứ 4, Ca sáng</option>
        <option value="Wed|13:00-17:00">Thứ 4, Ca chiều</option>
        <option value="Thu|8:00-12:00">Thứ 5, Ca sáng</option>
        <option value="Thu|13:00-17:00">Thứ 5, Ca chiều</option>
        <option value="Fri|8:00-12:00">Thứ 6, Ca sáng</option>
        <option value="Fri|13:00-17:00">Thứ 6, Ca chiều</option>
      </select>

      {/* Hình thức thay đổi */}
      <label className="font-medium">Hình thức thay đổi:</label>
      <div className="flex gap-4">
        <label className="flex items-center gap-1">
          <input
            type="radio"
            name="hinh-thuc"
            checked={changeType === "doi"}
            onChange={() => setChangeType("doi")}
          />
          Đổi sang ca khác
        </label>
        <label className="flex items-center gap-1">
          <input
            type="radio"
            name="hinh-thuc"
            checked={changeType === "nghi"}
            onChange={() => setChangeType("nghi")}
          />
          Nghỉ ca đó
        </label>
      </div>

      {/* Ca mới (ẩn nếu chọn nghỉ) */}
      {changeType === "doi" && (
        <div className="flex flex-col gap-2 transition-all duration-300">
          <label className="font-medium">Chọn ca mới:</label>
          <select
            className="border border-gray-300 p-2 rounded-md"
            onChange={(e) => {
              const [thu, ca] = e.target.value.split("|");
              setNewThu(thu);
              setNewCa(ca);
            }}
          >
            <option value="Mon|8:00-12:00">Thứ 2, Ca sáng</option>
            <option value="Mon|13:00-17:00">Thứ 2, Ca chiều</option>
            <option value="Tue|8:00-12:00">Thứ 3, Ca sáng</option>
            <option value="Tue|13:00-17:00">Thứ 3, Ca chiều</option>
            <option value="Wed|8:00-12:00">Thứ 4, Ca sáng</option>
            <option value="Wed|13:00-17:00">Thứ 4, Ca chiều</option>
            <option value="Thu|8:00-12:00">Thứ 5, Ca sáng</option>
            <option value="Thu|13:00-17:00">Thứ 5, Ca chiều</option>
            <option value="Fri|8:00-12:00">Thứ 6, Ca sáng</option>
            <option value="Fri|13:00-17:00">Thứ 6, Ca chiều</option>
          </select>
        </div>
      )}

      {/* Lý do */}
      <textarea
        placeholder="Nhập lý do đổi ca"
        className="border border-gray-300 rounded-md p-2 mt-2"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />
    </div>
  );
};


  return (
    <>
      {isToast ? (
        <Toast onClose={() => setToast(false)}>
          <div className="flex items-center gap-3">
            <div className="w-15 aspect-square rounded-full border-2 border-green-400 flex items-center justify-center">
              <MdOutlineDone className="text-2xl text-green-400" />
            </div>
            <p>Lịch thực tập đã được thêm vào !</p>
          </div>
        </Toast>
      ) : (
        ""
      )}
      <div className="border border-gray-300 p-4 mt-10 rounded-md shadow">
        <div className="flex flex-col items-center pb-5 border-b border-gray-300 lg:flex-row lg:justify-between">
          {/* avartar */}
          <div className="flex gap-2 ">
            <img
              src={avatar}
              alt="avartar"
              className="w-20 aspect-square rounded-md border border-gray-300"
            />
            <div>
              <h1 className="text-xl font-bold">{student.hoTen}</h1>
              <h4
                className="flex
                      items-center gap-1 text-lg text-gray-600"
              >
                <RiShoppingBag3Line className="text-2xl" /> {student.viTri}
              </h4>
              <h4
                className="flex
                      items-center gap-1 text-lg text-gray-600"
              >
                <MdOutlineEmail className="text-2xl" />
                {student.email}
              </h4>
            </div>
          </div>
          {userRole==='Student'?
          (
            <button 
            onClick={handleOpenDialogSwap}
            className="bg-green-500 cursor-pointer flex gap-1 items-center text-white rounded-lg px-4 py-2">
             <AiOutlineSwap /> Đổi lịch
            </button>
          )
          :(<div className="flex gap-2 mt-3 lg:mt-0">
            <button
              onClick={handleOpenDialogDelete}
              className="cursor-pointer p-3 flex items-center gap-2 border border-gray-300 rounded-md"
            >
              <BiTrash className="text-xl" />
              Xóa
            </button>
            <button
              onClick={handleOpenDialog}
              disabled={viewMode === "month"}
              className="cursor-pointer p-3 flex items-center gap-2 bg-[#34A853] rounded-md text-white"
            >
              <BiEdit className="text-xl" />
              Thêm
            </button>
          </div>)}
        </div>

        {/* lịch */}
        <div>
          <div className="bg-green-100 p-1 lg:rounded-2xl inline-flex mt-4">
            <button
              onClick={() => setViewMode("week")}
              className={`rounded-2xl py-1 px-5 text-lg font-bold cursor-pointer transition ${
                viewMode === "week"
                  ? "bg-white shadow"
                  : "bg-transparent text-gray-500"
              }`}
            >
              Tuần
            </button>
            <button
              onClick={() => setViewMode("month")}
              className={`rounded-2xl py-1 px-5 text-lg font-bold cursor-pointer transition ${
                viewMode === "month"
                  ? "bg-white text-black shadow"
                  : "bg-transparent text-gray-500"
              }`}
            >
              Tháng
            </button>
          </div>
          {/* Chọn tuần chỉ khi ở chế độ tuần */}
          {viewMode === "week" && (
            <select
              id="week-select"
              value={currentWeek}
              onChange={(e) => setCurrentWeek(Number(e.target.value))}
              className="px-4 py-2 bg-green-50 border border-gray-300 rounded-md lg:rounded-xl ml-1 lg:ml-5 mt-2 lg:mt-0"
            >
              <option value={0}>Tuần hiện tại</option>
              <option value={-1}>Tuần trước</option>
              <option value={1}>Tuần tới</option>
            </select>
          )}

          {/* Hiển thị theo chế độ */}
          {viewMode === "week" ? (
            <ScheduleGrid
              loading={loading}
              onDeleteById={handleDeleteById}
              events={events}
              currentWeek={currentWeek}
            />
          ) : (
            <ScheduleMonthGrid 
              loading={loading}
              onDeleteById={handleDeleteById}
              events={events}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default ScheduleDetails;
