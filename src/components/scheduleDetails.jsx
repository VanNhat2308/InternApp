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
import { useEffect, useState, forwardRef, useImperativeHandle, useRef } from "react";
import axiosClient from "../service/axiosClient";
import { useParams } from "react-router-dom";
import { AiOutlineSwap } from "react-icons/ai";
import dayjs from "dayjs";
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
  const param = localStorage.getItem('maSV') ? localStorage.getItem('maSV'):idSlug
  

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
  let selectedDate = new Date().toISOString().split("T")[0]; // format yyyy-mm-dd
  let selectedCa = "8:00-12:00";

  showDialog({
    title: "Thêm lịch",
    customContent: (
      <div className="flex flex-col mt-5">
        <label className="font-semibold text-xl" htmlFor="ngay">
          Ngày thực tập
        </label>
        <input
          type="date"
          defaultValue={selectedDate}
          className="border border-gray-300 p-3 rounded-md mt-2"
          onChange={(e) => (selectedDate = e.target.value)}
        />

        <label className="font-semibold text-xl mt-3" htmlFor="ca">
          Ca
        </label>
        <select
          className="mb-20 border border-gray-300 p-3 rounded-md mt-2"
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
      const today = new Date().toISOString().split("T")[0];
      if (selectedDate < today) {
        alert("Không thể thêm lịch vào ngày đã qua!");
        return;
      }

      try {
        const res = await axiosClient.post("/lich", {
          maSV: idSlug,
          ngay: selectedDate,
          ca: selectedCa,
        });

        alert(res.data.message);
        fetchSchedule();
      } catch (err) {
        if (err.response?.status === 409) {
          alert("Lịch bị trùng khung giờ!");
        } else {
          alert("Lỗi khi thêm lịch");
          console.error(err);
        }
      }
    },
  });
};

const formRef = useRef();
const handleOpenDialogSwap = () => {

  showDialog({
    title: "Đề xuất đổi lịch",
    customContent: <SwapScheduleForm ref={formRef} maSV={param} />,
    cancelText: "Hủy",
    onValidatedConfirm: async () => {
  if (!formRef.current) return false;

  const isValid = await formRef.current.validateForm(); // ← Thêm `await` vào đây
  if (!isValid) return false;

  const data = formRef.current.getFormData();
  console.log("✅ Dữ liệu hợp lệ:", data);

  // TODO: Gửi API ở đây nếu muốn
  return true;
}
  });
};


const SwapScheduleForm = forwardRef(({ maSV }, ref) => {
  const today = dayjs().format("YYYY-MM-DD");

  const [oldDate, setOldDate] = useState(today);
  const [oldCa, setOldCa] = useState("8:00-12:00");

  const [newDate, setNewDate] = useState(dayjs().add(1, "day").format("YYYY-MM-DD"));
  const [newCa, setNewCa] = useState("13:00-17:00");

  const [changeType, setChangeType] = useState("doi");
  const [reason, setReason] = useState("");

  // Error states
  const [errorReason, setErrorReason] = useState("");
  const [errorSwapOld, setErrorSwapOld] = useState("");
  const [errorSwapNew, setErrorSwapNew] = useState("");
  const [errorWeekend, setErrorWeekend] = useState("");

  useImperativeHandle(ref, () => ({
   validateForm: async () => {
  let isValid = true;

  // Reset lỗi cũ
  setErrorReason("");
  setErrorSwapOld("");
  setErrorSwapNew("");
  setErrorWeekend("");

  // 1. Kiểm tra lý do
  if (!reason.trim()) {
    setErrorReason("Vui lòng nhập lý do đổi ca.");
    isValid = false;
  }

  if (changeType === "doi") {
    // 2. Không đổi sang cùng ngày và cùng ca
    if (oldDate === newDate && oldCa === newCa) {
      setErrorSwapOld("Ca muốn đổi phải khác ca hiện tại.");
      isValid = false;
    }
    // 3. Không đổi sang ca giống (dù khác ngày)
    else if (oldCa === newCa) {
      setErrorSwapNew("Không được đổi sang ca giống với ca cũ.");
      isValid = false;
    }

    // 4. Không đổi sang Thứ Bảy hoặc Chủ Nhật
    const dow = dayjs(newDate).day();
    if (dow === 0 || dow === 6) {
      setErrorWeekend("Không thể đổi sang Thứ Bảy hoặc Chủ Nhật.");
      isValid = false;
    }

    // 5. Kiểm tra ca mới đã bị trùng chưa
    try {
      const resNew = await axiosClient.get('/schedule/check', {
        params: {
          type: 'new',
          date: newDate,
          ca: newCa.split('-')[0],
          maSV,
        },
      });

      if (resNew.data.exists) {
        setErrorSwapNew("Ca mới đã bị trùng lịch đăng ký.");
        isValid = false;
      }
    } catch (error) {
      console.error("Lỗi kiểm tra ca mới:", error);
    }

    // 6. Kiểm tra ca cũ có tồn tại không
    try {
      const resOld = await axiosClient.get('/schedule/check', {
        params: {
          type: 'old',
          date: oldDate,
          ca: oldCa.split('-')[0],
          maSV,
        },
      });

      if (!resOld.data.exists) {
        setErrorSwapOld("Ca hiện tại không tồn tại trong lịch đăng ký.");
        isValid = false;
      }
    } catch (error) {
      console.error("Lỗi kiểm tra ca cũ:", error);
    }
  }

  return isValid;
},


    getFormData: () => ({
      oldDate,
      oldCa,
      newDate,
      newCa,
      changeType,
      reason: reason.trim(),
    }),
  }));

  useEffect(() => {
  if (changeType === "nghi") {
    setErrorSwapNew(""); // clear lỗi khi không cần
    setErrorSwapOld(""); // clear lỗi khi không cần
  }
}, [changeType]);


  return (
    <div className="flex flex-col gap-3 mt-2">
      <label className="font-medium">Ca muốn thay đổi:</label>
      <input
        type="date"
        value={oldDate}
        onChange={(e) => setOldDate(e.target.value)}
        className="border p-2 rounded-md"
        min={today}
      />
      <select
        value={oldCa}
        onChange={(e) => setOldCa(e.target.value)}
        className="border p-2 rounded-md"
      >
        <option value="8:00-12:00">Ca sáng</option>
        <option value="13:00-17:00">Ca chiều</option>
      </select>
      {errorSwapOld && <p className="text-red-500 text-sm mt-1">{errorSwapOld}</p>}

      <label className="font-medium mt-2">Hình thức thay đổi:</label>
      <div className="flex gap-5">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={changeType === "doi"}
            onChange={() => setChangeType("doi")}
          />
          Đổi sang ca khác
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={changeType === "nghi"}
            onChange={() => setChangeType("nghi")}
          />
          Nghỉ ca này
        </label>
      </div>

      {changeType === "doi" && (
        <>
          <label className="font-medium">Ca muốn đổi sang:</label>
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="border p-2 rounded-md"
            min={today}
          />
          <select
            value={newCa}
            onChange={(e) => setNewCa(e.target.value)}
            className="border p-2 rounded-md"
          >
            <option value="8:00-12:00">Ca sáng</option>
            <option value="13:00-17:00">Ca chiều</option>
          </select>
          {errorSwapNew && <p className="text-red-500 text-sm mt-1">{errorSwapNew}</p>}
          {errorWeekend && <p className="text-red-500 text-sm mt-1">{errorWeekend}</p>}
        </>
      )}

      <textarea
        value={reason}
        onChange={(e) => {
          setReason(e.target.value);
          if (e.target.value.trim()) setErrorReason("");
        }}
        className="border rounded-md p-2 mt-2"
        placeholder="Lý do đổi ca..."
      />
      {errorReason && <p className="text-red-500 text-sm">{errorReason}</p>}
    </div>
  );
});




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
