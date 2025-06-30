import ResponNav from "../components/responsiveNav";
import Header from "../components/header";
import avatar from "../assets/images/avatar.png";
import manSelf from "../assets/images/maSelf.jpg";
import { useEffect, useState } from "react";
import { RiEyeLine, RiShoppingBag3Line } from "react-icons/ri";
import { MdOutlineEmail } from "react-icons/md";
import { useDialog } from "../context/dialogContext";
import { useNavigate, useParams } from "react-router-dom";
import DateInput from "./datePicker";
import Pagination from "./pagination";
import axiosClient from "../service/axiosClient";
import { format } from "date-fns";
function AttendanceDetails() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1025);
  const { showDialog } = useDialog();
  const { idSlug } = useParams();
  const navigate = useNavigate()
  const [diemdanh,setDiemDanh] = useState([])
  const [date,setDate] = useState()
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); 
  const [loading, setLoading] = useState(false)
  
  const param = localStorage.getItem("maSV")?localStorage.getItem("maSV"):idSlug
   useEffect(()=>{
    setLoading(true);
      axiosClient
        .get(`/diem-danh/sinh-vien/${param}`, {
          params: {
            date: date ? format(date,'yyyy-MM-dd') : null,
            page: currentPage,
            per_page: 10,
          },
        })
        .then((res) => {
          setDiemDanh(res.data.data.data);
          setTotalPages(res.data.data.last_page);
        })
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));

   },[date])
  
  
  
 

  

  const handleOpenDialog = () => {
    showDialog({
     customContent:(
      <div>
        <img src={manSelf} alt="ava" className="w-full object-cover rounded-xl mb-4" />
        <div className="flex justify-center mb-5">
          <span className="w-20 h-1 bg-gray-800"></span>
        </div>

     
        <div className="flex justify-between rounded-xl bg-gray-100 p-4 border border-gray-300">
          <div className="flex flex-col">
       <h6>Thời gian làm việc</h6>
       <h1 className="font-bold text-xl">08:00:00 hrs</h1>
          </div>
          <div className="flex flex-col">
       <h6>Clock in & Out</h6>
       <h1 className="font-bold text-xl">08:00 AM  — 05:00 PM</h1>
          </div>

        </div>
         </div>
      ),
      confirmText: "Đóng",
      onConfirm: () => {
        console.log("Đã xóa sinh viên");
      },
    });
  };
  


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1025);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const parseTimeToMinutes = (timeStr) => {
  const [time, meridiem] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  if (meridiem === 'PM' && hours !== 12) hours += 12;
  if (meridiem === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
};
const formatTo12Hour = (timeStr) => {
  if (!timeStr || typeof timeStr !== 'string') return '';

  const parts = timeStr.split(':');
  if (parts.length < 2) return '';

  let hour = parseInt(parts[0], 10);
  const minute = parts[1] || '00';

  const meridiem = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  hour = hour === 0 ? 12 : hour;

  return `${hour}:${minute.padStart(2, '0')} ${meridiem}`;
};


const getStatus = (checkingTime) => {
  const totalMinutes = parseTimeToMinutes(checkingTime);
  return totalMinutes <= 480 ? "Đúng giờ" : "Đi trễ";
};



const statusStyle = (checkInTime) => {
    const totalMinutes = parseTimeToMinutes(checkInTime);
  return totalMinutes <= 480 ? "text-green-600 bg-green-100" : "text-yellow-600 bg-yellow-100"; 
};

  return(
    <>
     {isMobile ? <ResponNav /> : 
<Header>
          <h2 className="text-xl font-semibold">Quản Lý Điểm Danh</h2>
          <p className="text-gray-500">Xem Thời Gian Điểm Danh Của Sinh Viên</p>
</Header>}
<div className="border border-gray-300 p-4 mt-10 rounded-md shadow w-full max-w-screen">
  {/* Header info */}
  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
    {/* Avatar + Info */}
    <div className="flex items-center gap-4">
      <img
        src={avatar}
        alt="avatar"
        className="w-20 aspect-square rounded-md border border-gray-300 object-cover"
      />
      <div>
        <h1 className="text-xl font-bold">{diemdanh[0]?.sinh_vien?.hoTen}</h1>
        <h4 className="flex items-center gap-2 text-gray-600 text-sm sm:text-base">
          <RiShoppingBag3Line className="text-lg" />
          {diemdanh[0]?.sinh_vien?.viTri}
        </h4>
        <h4 className="flex items-center gap-2 text-gray-600 text-sm sm:text-base">
          <MdOutlineEmail className="text-lg" />
          {diemdanh[0]?.sinh_vien?.email}
        </h4>
      </div>
    </div>

    {/* Date Picker */}
    <div className="mt-2 lg:mt-0 w-full lg:w-auto">
      <DateInput value={date} onChange={setDate} />
    </div>
  </div>

  {/* Table */}
  <div className="overflow-x-auto mt-8">
    <table className="min-w-[800px] w-full table-auto text-sm">
      <thead className="text-gray-500 border-b border-gray-300 bg-gray-50">
        <tr>
          <th className="py-2 text-left">Ngày</th>
          <th className="text-left">Thời gian làm việc</th>
          <th className="text-left">Giờ bắt đầu</th>
          <th className="text-left">Giờ điểm danh</th>
          <th className="text-left">Trạng thái</th>
          <th className="text-left">Hành động</th>
        </tr>
      </thead>
      <tbody>
        {diemdanh.map((item, idx) => (
          <tr key={idx} className="border-b border-gray-200">
            <td className="py-2">
              {new Date(item.ngay_diem_danh).toLocaleDateString("vi-VN")}
            </td>
            <td>{formatTo12Hour(item.gio_bat_dau)}</td>
            <td>8:00 AM</td>
            <td>{formatTo12Hour(item.gio_bat_dau)}</td>
            <td>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${statusStyle(
                  item.gio_bat_dau
                )}`}
              >
                {getStatus(item.gio_bat_dau)}
              </span>
            </td>
            <td>
              <button
                onClick={() => handleOpenDialog()}
                className="text-xl text-gray-600 hover:text-black"
              >
                <RiEyeLine />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* Pagination */}
  <div className="mt-6">
    <Pagination
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      totalPages={totalPages}
    />
  </div>
</div>



    </>
  )
}

export default AttendanceDetails