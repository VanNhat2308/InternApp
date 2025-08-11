import ResponNav from "../components/responsiveNav";
import Header from "../components/header";
import avatar from "../assets/images/avatar.png";
import { useEffect, useState } from "react";
import { MdChevronRight } from "react-icons/md";
import { RiShoppingBag3Line } from "react-icons/ri";
import { MdOutlineEmail } from "react-icons/md";
import { FaRegTrashCan } from "react-icons/fa6";
import { CiEdit } from "react-icons/ci";
import { GoPeople } from "react-icons/go";
import { FaRegCalendarCheck } from "react-icons/fa";
import ChartDetails from "./ChartDetails";
import { BsFillPeopleFill } from "react-icons/bs";
import { useDialog } from "../context/dialogContext";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../service/axiosClient";
import dayjs from "dayjs";
import "dayjs/locale/vi"; 
dayjs.locale("vi");

function StudentDetails() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1025)
  const [chuyenCan, setChuyenCan] = useState(false)
  const { showDialog } = useDialog()
  const { idSlug } = useParams()
  const navigate = useNavigate()
  const [students,setStudent] = useState([])
  const [attendanceData,setAttendanceData] = useState()
  const apiBaseURL = import.meta.env.VITE_API_BASE_URL

  const semesterData = attendanceData?.semester || [];

  const dungGio = semesterData.find(item => item.name === "Đúng giờ")?.value || 0;
  const tongBuoi = semesterData.reduce((sum, item) => sum + item.value, 0);
  const DiemchuyenCan = tongBuoi ? ((dungGio / tongBuoi) * 100).toFixed(0) : 0;

 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentRes, attendanceRes] = await Promise.all([
          axiosClient.get(`sinhviens/${idSlug}`),
          axiosClient.get(`diem-danh/thong-ke/${idSlug}`)
        ]);

        setStudent(studentRes.data.data);
        setAttendanceData(attendanceRes.data.data);
      } catch (err) {
        console.log("Lỗi khi fetch dữ liệu:", err);
      }
    };

    if (idSlug) fetchData();
  }, [idSlug]);

 const handleDelete = () => {
  axiosClient.delete(`/sinhviens/${idSlug}`)
    .then(res => {
      alert("Xóa thành công!");
      navigate('/admin/list');
    })
    .catch(err => {
      alert("Xóa thất bại: " + (err?.response?.data?.message || err.message));
    });
};


  const handleOpenDialog = () => {
    showDialog({
      title: "Xác nhận xóa thông tin",
      content: "Sau khi bạn xóa thông tin, thông tin của sinh viên thực tập sẽ được xóa khỏi danh sách sinh viên. Hãy kiểm tra kỹ.",
      icon: <BsFillPeopleFill />, 
      confirmText: "Có, xóa sinh viên",
      cancelText: "Không, tôi muốn kiểm tra lại",
      onConfirm: () => {
       handleDelete()
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

    const handleEdit = (idSlug) => {
  navigate(`/admin/list/edit-student/${idSlug}`);
};
const getStatusColor = (status) => {
  if (!status) return 'text-gray-500';

  const normalized = status.trim().toLowerCase();

  if (normalized === 'đang thực tập') {
    return 'text-green-500'; 
  }

  return 'text-red-500';
};

  return (
    <div className="flex-1 flex flex-col">
      {isMobile ? (
        <ResponNav />
      ) : (
        <Header>
          <h2 className="text-xl font-semibold">Thêm Sinh Viên</h2>
          <p className="flex gap-2 items-center">
            Danh Sách <MdChevronRight className="text-xl" /> Thêm sinh viên{" "}
          </p>
        </Header>
      )}
     <div className="flex-1 border border-gray-200 p-4 mt-5 rounded-md">
  <div className="flex flex-col items-center gap-4 pb-5 border-b border-gray-300 lg:flex-row lg:justify-between">
    {/* avatar + info */}
    <div className="flex flex-col sm:flex-row items-center gap-4 sm:items-start">
      <img
        src={students.duLieuKhuonMat ? `${apiBaseURL}/${students.duLieuKhuonMat}` : avatar}
        alt="avartar"
        className="w-24 sm:w-20 aspect-square rounded-md border border-gray-300"
      />
      <div className="text-center sm:text-left">
        <h1 className="text-xl font-bold">{students?.hoTen}</h1>
        <h4 className="flex items-center gap-1 text-lg text-gray-600 justify-center sm:justify-start">
          <RiShoppingBag3Line className="text-2xl" />
          {students?.viTri}
        </h4>
        <h4 className="flex items-center gap-1 text-lg text-gray-600 justify-center sm:justify-start">
          <MdOutlineEmail className="text-2xl" />
          {students?.email}
        </h4>
      </div>
    </div>

    {/* buttons */}
    <div className="flex flex-col sm:flex-row gap-2">
      <button
        onClick={handleOpenDialog}
        className="cursor-pointer p-3 flex items-center gap-2 border border-gray-300 rounded-md justify-center"
      >
        <FaRegTrashCan />
        Xóa
      </button>
      <button
        onClick={() => {
          handleEdit(idSlug);
        }}
        className="cursor-pointer p-3 flex items-center gap-2 bg-[#34A853] rounded-md text-white justify-center"
      >
        <CiEdit />
        Chỉnh Sửa
      </button>
    </div>
  </div>

  {/* Main content */}
  <div className="flex flex-col lg:flex-row mt-5 gap-5">
    {/* Tabs */}
    <div className="flex flex-col">
      <button
        onClick={() => setChuyenCan(false)}
        className={`cursor-pointer p-3 flex items-center gap-2 border border-gray-300 rounded-t-md whitespace-nowrap ${
          chuyenCan ? "" : "bg-[#34A853] text-white"
        }`}
      >
        <GoPeople /> Thông Tin Cá Nhân
      </button>
      <button
        onClick={() => setChuyenCan(true)}
        className={`cursor-pointer p-3 flex items-center gap-2 border border-gray-300 border-t-0 rounded-b-md whitespace-nowrap ${
          chuyenCan ? "bg-[#34A853] text-white" : ""
        }`}
      >
        <FaRegCalendarCheck />
        Chuyên cần
      </button>
    </div>

    {/* Nội dung */}
    {chuyenCan ? (
      <div className="w-full">
        <h1 className="text-2xl font-semibold">Chuyên cần của sinh viên</h1>
        <h5 className="text-gray-600 text-base sm:text-lg">
          Mức độ chuyên cần của sinh viên trong tháng này
        </h5>

        <div className="flex flex-col lg:flex-row gap-4 my-4">
          {/** Mỗi ô thống kê */}
          <div className="flex-1 p-3 border border-gray-300 rounded-md bg-gray-100">
            <div className="flex gap-2 items-center">
              <div className="w-5 h-5 rounded-full bg-green-400"></div>
              <span>Đi làm đúng giờ</span>
            </div>
            <div className="text-2xl font-semibold">
              {attendanceData?.month[0]?.value}
            </div>
          </div>
          <div className="flex-1 p-3 border border-gray-300 rounded-md bg-gray-100">
            <div className="flex gap-2 items-center">
              <div className="w-5 h-5 rounded-full bg-yellow-500"></div>
              <span>Đi làm trễ</span>
            </div>
            <div className="text-2xl font-semibold">
              {attendanceData?.month[1]?.value}
            </div>
          </div>
          <div className="flex-1 p-3 border border-gray-300 rounded-md bg-gray-100">
            <div className="flex gap-2 items-center">
              <div className="w-5 h-5 rounded-full bg-red-500"></div>
              <span>Nghỉ học</span>
            </div>
            <div className="text-2xl font-semibold">
              {attendanceData?.month[2]?.value}
            </div>
          </div>
        </div>

        {/* Thống kê tổng */}
        <h1 className="text-xl font-bold">Thống kê chuyên cần</h1>
        <div className="flex flex-col lg:flex-row gap-6 mt-5">
          {/* Chart */}
          <div className="w-full lg:w-2/3">
            <ChartDetails attendanceData={attendanceData} />
          </div>

          {/* Tổng kết */}
          <div className="flex flex-col gap-5 w-full lg:w-1/3">
            <div className="p-4 border border-gray-300 rounded-xl">
              <h1 className="font-bold text-xl">Mức độ chuyên cần</h1>
              <h1 className="text-3xl font-bold">{DiemchuyenCan}%</h1>
              <h6 className="text-lg">
                {dungGio}/{tongBuoi} buổi
              </h6>
            </div>
            <div className="p-4 border border-gray-300 rounded-xl">
              <h1 className="font-bold text-xl">Điểm số tổng hợp</h1>
              <h1 className="text-3xl font-bold">
                {(DiemchuyenCan / 10).toFixed(1)}/10
              </h1>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm flex-1">
        {[
          ["Họ Tên", students?.hoTen],
          ["Thời Gian Thực Tập", students?.thoiGianTT],
          ["Mã Số Sinh Viên", students?.maSV],
          ["Giáo Viên Hướng Dẫn", students?.tenGiangVien],
          ["Trường Đại Học", students?.truong?.tenTruong],
          ["Ngày Sinh", dayjs(students?.ngaySinh).format('DD/MM/YYYY')],
          ["Chuyên Ngành", students?.nganh],
          ["Vị Trí Thực Tập", students?.viTri],
          [
            "Trạng Thái",
            <span
              className={`font-medium text-lg ${getStatusColor(
                students?.trangThai
              )}`}
            >
              {students?.trangThai || "Không rõ"}
            </span>,
          ],
        ].map(([label, value], idx) => (
          <div key={idx} className="p-2 border-b border-gray-300">
            <p className="text-gray-400">{label}</p>
            <p className="font-medium text-lg">{value}</p>
          </div>
        ))}
      </div>
    )}
  </div>
</div>

    </div>
  );
}

export default StudentDetails;
