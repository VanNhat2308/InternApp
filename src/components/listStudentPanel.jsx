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
function ListStudentPanel() {
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
      status: "Đang thực tập",
    },
    {
      name: "Trần Thị B",
      studentId: "2012342",
      position: "Backend Developer",
      university: "Đại học Khoa học Tự nhiên",
      status: "Chờ duyệt",
    },
    {
      name: "Lê Văn C",
      studentId: "2012343",
      position: "Tester",
      university: "Đại học Công nghệ Thông tin",
      status: "Đã hoàn thành",
    },
    {
      name: "Phạm Thị D",
      studentId: "2012344",
      position: "UI/UX Designer",
      university: "Đại học Sư phạm Kỹ thuật",
      status: "Tạm dừng",
    },
    {
      name: "Hoàng Văn E",
      studentId: "2012345",
      position: "Mobile Developer",
      university: "Đại học FPT",
      status: "Đang thực tập",
    },
    {
      name: "Đặng Thị F",
      studentId: "2012346",
      position: "Data Analyst",
      university: "Đại học Ngoại thương",
      status: "Chờ duyệt",
    },
    {
      name: "Võ Minh G",
      studentId: "2012347",
      position: "DevOps Engineer",
      university: "Đại học Bách Khoa",
      status: "Đã hoàn thành",
    },
    {
      name: "Ngô Thị H",
      studentId: "2012348",
      position: "Product Manager",
      university: "Đại học Kinh tế",
      status: "Tạm dừng",
    },
    {
      name: "Lý Văn I",
      studentId: "2012349",
      position: "Game Developer",
      university: "Đại học Hoa Sen",
      status: "Đang thực tập",
    },
    {
      name: "Bùi Thị J",
      studentId: "2012350",
      position: "AI Engineer",
      university: "Đại học Quốc gia TP.HCM",
      status: "Chờ duyệt",
    },
  ];
  const {toggleFilter} = useFilter()
  const handleNavigate = ()=>{
    navigate("/admin/list/add-student");
  }
  const handleView = (id) => {
  navigate(`/admin/list/student-details/${id}`);
};
  const handleEdit = (id) => {
  navigate(`/admin/list/edit-student/${id}`);
};
  const statusStyle = (status) =>
    status === "Đang thực tập"
      ? "text-green-600 bg-green-100"
      : "text-red-600 bg-red-100";
  return (
    <>
     {isMobile ? <ResponNav /> : <Header>
       <h2 className="text-xl font-semibold">Xin chào Nguyễn Văn A 👋</h2>
          <p className="text-gray-500">Chào buổi sáng</p>
      </Header>}
    <div className="p-4 w-full max-w-screen h-fit lg:h-screen mt-10 rounded-xl shadow border border-[#ECECEE]">
      {/* filter bar */}
      <div className="flex flex-col lg:flex-row gap-2 lg:gap-4 lg:h-12">
        {/* search */}
        <div className="h-full relative flex-1">
          <input
            type="text"
            placeholder="Tìm kiếm"
            className="w-full border h-full border-gray-300 pl-8 pr-4 px-4 py-4 lg:py-1 rounded-lg transition-all duration-300"
          />

          <FiSearch className="absolute top-1/2 left-2 transform -translate-y-1/2" />
        </div>
        {/* add btn */}
        <button onClick={handleNavigate} className="rounded-xl p-5 flex items-center gap-2 bg-green-600 text-white cursor-pointer">
          <GoPlusCircle className="text-xl" />
          Thêm sinh viên
        </button>
        {/* filter btn */}
        <button onClick={toggleFilter} className="rounded-xl p-5 flex items-center gap-2 border border-gray-200 cursor-pointer">
          <FaSlidersH />
          Lọc
        </button>
      </div>
      {/* table */}
    
       <div className="overflow-x-auto mt-10">
         <table className=" min-w-[800px] text-sm table-auto">
            <thead className="text-left text-gray-500 border-b border-b-gray-300">
              <tr>
                <th className="py-2 ">Tên sinh viên</th>
                <th>MSSV</th>
                <th>Vị trí</th>
                <th>Trường</th>
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
                    <td>{s.university}</td>
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
                    <td className="flex gap-2">
                      <button onClick={() => handleView(s.studentId)} className="text-xl cursor-pointer">
                          <RiEyeLine />
                      </button>
                      <button
                      onClick={()=>{
                        handleEdit(s.studentId)
                      }}
                      className="text-xl cursor-pointer">
                          <CiEdit />
                      </button>
                      <button 
                      onClick={handleOpenDialog}
                      className="text-xl cursor-pointer">
                         <RiDeleteBin6Line />
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
    </>
  );
}

export default ListStudentPanel;
