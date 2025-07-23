import { FiSearch } from "react-icons/fi";
import { FaSlidersH } from "react-icons/fa";
import { RiEyeLine } from "react-icons/ri";
import avatar from "../assets/images/avatar.png";
import Pagination from "../components/pagination";
import { useNavigate } from "react-router-dom";
import { useFilter } from "../context/filteContext";
import { useEffect, useState } from "react";
import ResponNav from "../components/responsiveNav";
import Header from "../components/header";
import { useDialog } from "../context/dialogContext";
import axiosClient from "../service/axiosClient";
import { BsFillPeopleFill } from "react-icons/bs";
import Avatar from "react-avatar";

function AttendancePanel() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1025);
  const navigate = useNavigate();
  const { showDialog } = useDialog();
  const [students,setStudent] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); 
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('');
  const { filterValues } = useFilter();
  
  // const apiBaseURL = import.meta.env.VITE_API_BASE_URL
  const [filters,setFilters] = useState({
              viTri:'',
              Truong:'',
              KyThucTap:''
            })
       const fetchStudents = () => {
  setLoading(true);
  axiosClient
    .get(`/diem-danh/danh-sach-hom-nay`, {
      params: {
        page: currentPage,
        per_page: 10,
        search: searchTerm,
        vi_tri: filters.viTri,
        truong: filters.Truong,
        ky_thuc_tap: filters.KyThucTap,
      },
    })
    .then((res) => {
      setStudent(res.data.data.data);
      setTotalPages(res.data.data.last_page);
    })
    .catch((err) => console.log(err))
    .finally(() => setLoading(false));
};
// Đồng bộ mỗi khi filterValues thay đổi
useEffect(() => {
  const selectedPositions = Object.keys(filterValues.positions || {}).filter(key => filterValues.positions[key]);
  const selectedUniversities = Object.keys(filterValues.universities || {}).filter(key => filterValues.universities[key]);
  const term = filterValues.term !== "Tất cả" ? filterValues.term : '';

  
  setFilters({
    viTri: selectedPositions.join(','),
    Truong: selectedUniversities.join(','),
    KyThucTap: term
  });
}, [filterValues]);

useEffect(() => {
  const delayDebounce = setTimeout(() => {
    fetchStudents();
  }, 500); // debounce 500ms

  return () => clearTimeout(delayDebounce);
}, [searchTerm, currentPage, filters]);


  const handleOpenDialog = () => {
    showDialog({
      title: "Xác nhận xóa thông tin",
      content:
        "Sau khi bạn xóa thông tin, thông tin của sinh viên thực tập sẽ được xóa khỏi danh sách sinh viên. Hãy kiểm tra kỹ.",
      icon: <BsFillPeopleFill />,
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

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);



  const { toggleFilter } = useFilter();

  const handleView = (id) => {
    navigate(`/admin/attendance/attendance-details/${id}`);
  };

  function getTrangThaiTiengViet(status) {
  switch (status) {
    case 'on_time':
      return 'Đúng giờ';
    case 'late':
      return 'Đi trễ';
    case 'absent':
      return 'Vắng';
    default:
      return 'Không xác định';
  }
}

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
  const userRole = localStorage.getItem('role')

  return (
    <>
      {isMobile ? (
        <ResponNav />
      ) : (
        <Header>
          <h2 className="text-xl font-semibold">Quản Lý Điểm Danh</h2>
          <p className="text-gray-500">{userRole==='Student'? 'Danh sách lịch sử điểm danh của sinh viên' :'Xem Thời Gian Điểm Danh Của Sinh Viên'}</p>
        </Header>
      )}
   <div className="p-4 w-full max-w-screen h-fit mt-10 rounded-xl shadow border border-[#ECECEE]">
  {/* Filter bar */}
  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between mb-4">
    {/* Left: Title */}

    {/* Right: Search + Filter */}
    <div className="flex flex-col sm:flex-row gap-3 flex-1 lg:justify-end">
      {/* Search input */}
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-200 focus:shadow-md transition"
        />
        <FiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
      </div>

    
    </div>
  </div>


        {/* table */}

        {loading? 
         (
                 <div className="flex justify-center items-center py-10">
        <div role="status">
    <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-green-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
    <span className="sr-only">Loading...</span>
</div>
        </div>
               )
        :(<div className="overflow-x-auto mt-5">
          <table className=" min-w-[800px] w-full text-sm table-auto">
            <thead className="bg-gray-100 text-left text-gray-500 border-b border-b-gray-300">
              <tr>
                <th className="py-2 pl-3">Tên sinh viên</th>
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
                      <td className="py-2 px-2 align-middle">
    <div className="flex items-center gap-2">
      <Avatar name={s?.sinh_vien?.hoTen} round size="32" />
      <div className="flex flex-col">
        <span className="font-medium">{s?.sinh_vien?.hoTen}</span>
        <span className="text-sm text-gray-500">{s?.sinh_vien?.email}</span>
      </div>
    </div>
  </td>
                    <td>{s.maSV}</td>
                    <td>{s.sinh_vien.viTri}</td>
                    <td>{s.gio_bat_dau}</td>
                   
                    <td>
                      {" "}
                      <span
                        className={`px-2 py-1 rounded-sm text-xs font-medium ${statusStyle(
                          getTrangThaiTiengViet(s?.trang_thai)
                        )}`}
                      >
                        {getTrangThaiTiengViet(s?.trang_thai)}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleView(s.maSV)}
                        className="text-xl cursor-pointer"
                      >
                        <RiEyeLine />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>)}
         <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
      </div>
    </>
  );
}

export default AttendancePanel;
