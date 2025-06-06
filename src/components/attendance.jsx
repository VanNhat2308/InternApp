import { FiSearch } from "react-icons/fi";
import { GoPlusCircle } from "react-icons/go";
import { FaSlidersH } from "react-icons/fa";
import { RiEyeLine } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import avatar from "../assets/images/avatar.png";
import Pagination from "../components/pagination";
import { useNavigate } from "react-router-dom";
import { useFilter } from "../context/filteContext";
import { useEffect, useState } from "react";
import ResponNav from "../components/responsiveNav";
import Header from "../components/header";
import { useDialog } from "../context/dialogContext";
import { BsFillPeopleFill } from "react-icons/bs";

function Attendance() {
const [isMobile, setIsMobile] = useState(window.innerWidth < 1025);
      const navigate = useNavigate()
      const { showDialog } = useDialog();
 

      
        const handleOpenDialog = () => {
          showDialog({
            title: "Xác nhận xóa thông tin",
            content: "Sau khi bạn xóa thông tin, thông tin của sinh viên thực tập sẽ được xóa khỏi danh sách sinh viên. Hãy kiểm tra kỹ.",
            icon: <BsFillPeopleFill />, // ✅ Truyền icon tại đây
            confirmText: "Có, xóa sinh viên",
            cancelText: "Không, tôi muốn kiểm tra lại",
            onConfirm: () => {
              console.log("Đã xóa sinh viên");
            },
          });
        };
      
      useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth < 1025);
      };
  
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

const students = [
  {
    name: "Nguyễn Văn A",
    studentId: "2012341",
    position: "Frontend Developer",
    university: "Đại học Bách Khoa",
    time: "8:00 AM",
    status: "Đúng giờ",
  },
  {
    name: "Trần Thị B",
    studentId: "2012342",
    position: "Backend Developer",
    university: "Đại học Khoa học Tự nhiên",
    time: "9:15 AM",
    status: "Đi trễ",
  },
  {
    name: "Lê Văn C",
    studentId: "2012343",
    position: "Tester",
    university: "Đại học Công nghệ Thông tin",
    time: "8:05 AM",
    status: "Đúng giờ",
  },
  {
    name: "Phạm Thị D",
    studentId: "2012344",
    position: "UI/UX Designer",
    university: "Đại học Sư phạm Kỹ thuật",
    time: "Nghỉ",
    status: "Nghỉ làm",
  },
  {
    name: "Hoàng Văn E",
    studentId: "2012345",
    position: "Mobile Developer",
    university: "Đại học FPT",
    time: "8:55 AM",
    status: "Đi trễ",
  },
  {
    name: "Đặng Thị F",
    studentId: "2012346",
    position: "Data Analyst",
    university: "Đại học Ngoại thương",
    time: "8:00 AM",
    status: "Đúng giờ",
  },
  {
    name: "Võ Minh G",
    studentId: "2012347",
    position: "DevOps Engineer",
    university: "Đại học Bách Khoa",
    time: "Nghỉ",
    status: "Nghỉ làm",
  },
  {
    name: "Ngô Thị H",
    studentId: "2012348",
    position: "Product Manager",
    university: "Đại học Kinh tế",
    time: "9:00 AM",
    status: "Đi trễ",
  },
  {
    name: "Lý Văn I",
    studentId: "2012349",
    position: "Game Developer",
    university: "Đại học Hoa Sen",
    time: "8:10 AM",
    status: "Đúng giờ",
  },
  {
    name: "Bùi Thị J",
    studentId: "2012350",
    position: "AI Engineer",
    university: "Đại học Quốc gia TP.HCM",
    time: "Nghỉ",
    status: "Nghỉ làm",
  },
];

  const {toggleFilter} = useFilter()

  const handleView = (id) => {
  navigate(`/admin/attendance/attendance-details/${id}`);
};

const statusStyle = (status) => {
  switch (status) {
    case "Đúng giờ":
      return "text-green-600 bg-green-100";
    case "Đi trễ":
      return "text-yellow-600 bg-yellow-100";
    case "Nghỉ làm":
      return "text-red-600 bg-red-100";
    default:
      return "text-gray-600 bg-gray-100"; 
  }
};



    return ( 
<div className="flex-1">
 {isMobile ? <ResponNav /> : 
<Header>
          <h2 className="text-xl font-semibold">Quản Lý Điểm Danh</h2>
          <p className="text-gray-500">Xem Thời Gian Điểm Danh Của Sinh Viên</p>
</Header>}
    <div className="p-4 w-full max-w-screen h-fit lg:h-screen mt-10 rounded-xl shadow border border-[#ECECEE]">
      {/* filter bar */}
      <div className="flex flex-col lg:flex-row gap-2 lg:gap-4 lg:h-12">
        <h1 className="text-2xl my-1  font-bold">Điểm danh hôm nay</h1>
        {/* search */}
        <div className="h-full relative flex-1">
          <input
            type="text"
            placeholder="Tìm kiếm"
            className="w-full border h-full border-gray-300 pl-8 pr-4 px-4 py-4 lg:py-1 rounded-lg transition-all duration-300"
          />

          <FiSearch className="absolute top-1/2 left-2 transform -translate-y-1/2" />
        </div>
     
        {/* filter btn */}
        <button onClick={toggleFilter} className="rounded-xl p-5 flex items-center gap-2 border border-gray-200 cursor-pointer">
          <FaSlidersH />
          Lọc
        </button>
      </div>
      {/* table */}
    
       <div className="overflow-x-auto mt-10">
         <table className=" min-w-[800px] w-full text-sm table-auto">
            <thead className="text-left text-gray-500 border-b border-b-gray-300">
              <tr>
                <th className="py-2 ">Tên sinh viên</th>
                <th>MSSV</th>
                <th>Vị trí</th>
                <th>Thời gian</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, idx) => {
                return (
                  <tr key={idx} className="border-b border-b-gray-300">
                    <td className="py-2 flex gap-2 items-center">
                      <img src={avatar} className="w-7" alt="ava" />
                      {s.name}
                    </td>
                    <td>{s.studentId}</td>
                    <td>{s.position}</td>
                    <td>{s.time}</td>
                    <td>
                      {" "}
                      <span
                        className={`px-2 py-1 rounded-sm text-xs font-medium ${statusStyle(
                          s.status
                        )}`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="flex justify-center">
                      <button onClick={() => handleView(s.studentId)} className="text-xl cursor-pointer">
                          <RiEyeLine />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      <Pagination totalPages={5} />

    </div>
</div>

     );
}

export default Attendance;