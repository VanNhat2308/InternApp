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
useEffect(() => {
  setLoading(true);
  axiosClient
    .get(`/diem-danh/sinh-vien/${param}`, {
      params: {
        date: date ? format(date, 'yyyy-MM-dd') : null,
        page: currentPage,
        per_page: 15,
      },
    })
    .then((res) => {
      const data = res.data?.data;

      setDiemDanh(Array.isArray(data?.data) ? data.data : []); // nếu không có, set rỗng
      setTotalPages(data?.last_page || 1);
    })
    .catch((err) => {
      console.error(err);
      setDiemDanh([]); // lỗi cũng set rỗng
    })
    .finally(() => setLoading(false));
}, [date, currentPage]);
  
  
  
 

  
const handleOpenDialog = (id) => {
  const item = diemdanh.find((entry) => entry.id === id);

  if (!item) return;

  const thoiGianLamViec = tinhThoiGianLamViec(item.gio_bat_dau, item.gio_ket_thuc);
  const clockIn = formatTo12Hour(item.gio_bat_dau);
  const clockOut = formatTo12Hour(item.gio_ket_thuc);

  showDialog({
    customContent: (
      <div>
        <img src={manSelf} alt="ava" className="w-full object-cover rounded-xl mb-4" />
        <div className="flex justify-center mb-5">
          <span className="w-20 h-1 bg-gray-800"></span>
        </div>

        <div className="flex justify-between rounded-xl bg-gray-100 p-4 border border-gray-300">
          <div className="flex flex-col">
            <h6>Thời gian làm việc</h6>
            <h1 className="font-bold text-xl">{thoiGianLamViec}</h1>
          </div>
          <div className="flex flex-col">
            <h6>Clock in & Out</h6>
            <h1 className="font-bold text-xl">
              {clockIn} — {clockOut}
            </h1>
          </div>
        </div>
      </div>
    ),
    confirmText: "Đóng",
    onConfirm: () => {
      console.log("Đã đóng dialog");
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


function tinhThoiGianLamViec(gioBatDau, gioKetThuc) {
  if(!gioBatDau || !gioKetThuc)
    return '0 giờ'
  const [h1, m1] = gioBatDau.split(":").map(Number);
  const [h2, m2] = gioKetThuc.split(":").map(Number);

  const start = h1 * 60 + m1;
  const end = h2 * 60 + m2;

  let duration = end - start;
  if (duration < 0) duration += 24 * 60; 

  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;

  return `${hours} giờ ${minutes} phút`;
}
const name = localStorage.getItem('hoTen') ? localStorage.getItem('hoTen') : diemdanh[0]?.sinh_vien?.hoTen
const viTri = localStorage.getItem('viTri') ? localStorage.getItem('viTri') : diemdanh[0]?.sinh_vien?.viTri
const email = localStorage.getItem('email') ? localStorage.getItem('email') : diemdanh[0]?.sinh_vien?.email

  return(
    <>
     {isMobile ? <ResponNav /> : 
<Header>
          <h2 className="text-xl font-semibold">Quản Lý Điểm Danh</h2>
          <p className="text-gray-500">Xem Thời Gian Điểm Danh Của Sinh Viên</p>
</Header>}
<div className="flex-1 border border-gray-200 p-4 mt-5 rounded-md w-full max-w-screen">
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
        <h1 className="text-xl font-bold">{name || 'Nguyen Van A'}</h1>
        <h4 className="flex items-center gap-2 text-gray-600 text-sm sm:text-base">
          <RiShoppingBag3Line className="text-lg" />
          {viTri || 'unknow'}
        </h4>
        <h4 className="flex items-center gap-2 text-gray-600 text-sm sm:text-base">
          <MdOutlineEmail className="text-lg" />
          {email || 'unknow@gmail.com'}
        </h4>
      </div>
    </div>

    {/* Date Picker */}
    <div className="mt-2 lg:mt-0 w-full lg:w-auto">
      <DateInput value={date} onChange={setDate} />
    </div>
  </div>

  {/* Table */}
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
  ):(<div className="overflow-x-auto mt-8">
    <table className="min-w-[800px] w-full table-auto text-sm">
      <thead className="text-gray-500 border-b border-gray-300 bg-gray-50">
        <tr>
          <th className="py-2 text-left">Ngày</th>
          <th className="text-left">Thời gian làm việc</th>
          <th className="text-left">Giờ điểm danh</th>
          <th className="text-left">Giờ kết thúc</th>
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
            <td>{tinhThoiGianLamViec(item.gio_bat_dau, item.gio_ket_thuc)}</td>
             <td>{formatTo12Hour(item.gio_bat_dau)}</td>
            <td>{formatTo12Hour(item.gio_ket_thuc)}</td>
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
                onClick={() => handleOpenDialog(item.id)}
                className="text-xl text-gray-600 hover:text-black"
              >
                <RiEyeLine />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>)}

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