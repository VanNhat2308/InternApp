import { FiSearch } from "react-icons/fi";
import { GoPlusCircle } from "react-icons/go";
import { FaSlidersH } from "react-icons/fa";
import { RiEyeLine } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import avatar from "../assets/images/avatar.png";
import { useNavigate } from "react-router-dom";
import { useFilter } from "../context/filteContext";
import { useEffect, useState } from "react";
import ResponNav from "../components/responsiveNav";
import Header from "../components/header";
import { useDialog } from "../context/dialogContext";
import { BsFillPeopleFill } from "react-icons/bs";
import axiosClient from "../service/axiosClient";
import { useUser } from "../context/userContext";
import Swal from 'sweetalert2';
import Pagination from "./Pagination";
import Avatar from "react-avatar";

function ListStudentPanel() {
      const [perPage, setPerPage] = useState(10)
      const [totalRecords, setTotalRecords] = useState(0)
      const [isMobile, setIsMobile] = useState(window.innerWidth < 1025);
      const navigate = useNavigate()
      const { showDialog } = useDialog();
      const[students,setStudent] = useState([]);
      const [currentPage, setCurrentPage] = useState(1);
      const [totalPages, setTotalPages] = useState(1); 
      const [loading, setLoading] = useState(false)
      const [searchTerm, setSearchTerm] = useState('');
      const { filterValues } = useFilter();
      const apiBaseURL = import.meta.env.VITE_API_BASE_URL
      const [filters,setFilters] = useState({
        viTri:'',
        Truong:'',
        KyThucTap:''
      })
      const fetchStudents = () => {
  setLoading(true);
  axiosClient
    .get(`/sinhviens/lay-danh-sach-sinh-vien`, {
      params: {
        page: currentPage,
        per_page: perPage,
        search: searchTerm,
        vi_tri: filters.viTri,
        truong: filters.Truong,
        ky_thuc_tap: filters.KyThucTap,
      },
    })
    .then((res) => {
      setStudent(res.data.data.data);
      setTotalPages(res.data.data.last_page)
      setTotalRecords(res.data.data.total)
    })
    .catch((err) => console.log(err))
    .finally(() => setLoading(false));
};




       const handleDelete = (id) => {
        axiosClient.delete(`/sinhviens/${id}`)
          .then(res => {
            alert("Xóa thành công!");
            fetchStudents(); //
          })
          .catch(err => {
            alert("Xóa thất bại: " + (err?.response?.data?.message || err.message));
          });
      };
      
 

      
        const handleOpenDialog = (id) => {
          showDialog({
            title: "Xác nhận xóa thông tin",
            content: "Sau khi bạn xóa thông tin, thông tin của sinh viên thực tập sẽ được xóa khỏi danh sách sinh viên. Hãy kiểm tra kỹ.",
            icon: <BsFillPeopleFill />, 
            confirmText: "Có, xóa sinh viên",
            cancelText: "Không, tôi muốn kiểm tra lại",
            onConfirm: () => handleDelete(id),
          });
        };
      
      useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth < 1025);
      };
  
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);


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
}, [searchTerm, currentPage, filters, perPage]);


 
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
  
            function getGreetingTime() {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return "Chào buổi sáng";
  } else if (hour >= 12 && hour < 14) {
    return "Chào buổi trưa";
  } else if (hour >= 14 && hour < 18) {
    return "Chào buổi chiều";
  } else {
    return "Chào buổi tối";
  }
}
 const nameUser = localStorage.getItem('user')
 const [selectedStudents, setSelectedStudents] = useState([]);
const selectedAll = students.length > 0 && selectedStudents.length === students.length;
const handleSelectOne = (id) => {
  setSelectedStudents((prev) =>
    prev.includes(id)
      ? prev.filter((sid) => sid !== id)
      : [...prev, id]
  );
};
const handleSelectAll = () => {
  if (selectedAll) {
    setSelectedStudents([]);
  } else {
    const allIds = students.map((s) => s.maSV);
    setSelectedStudents(allIds);
  }
};
const handleDeleteSelected = () => {
  showDialog({
    title: "Xác nhận xóa nhiều sinh viên",
    content: `Bạn có chắc chắn muốn xóa ${selectedStudents.length} sinh viên này không?`,
    confirmText: "Xóa",
    cancelText: "Hủy",
    onConfirm: async () => {
      try {
        await axiosClient.post("/sinhviens/xoa-nhieu", {
          ids: selectedStudents,
        });

        fetchStudents();
        setSelectedStudents([]);

        Swal.fire({
          icon: "success",
          title: "Đã xóa thành công!",
          text: `${selectedStudents.length} sinh viên đã được xóa.`,
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Lỗi khi xóa!",
          text: err?.response?.data?.message || "Đã xảy ra lỗi trong quá trình xóa.",
        });
      }
    },
  });
};


  return (
    <>
     {isMobile ? <ResponNav /> : <Header>
       <h2 className="text-xl font-semibold">Xin chào {nameUser||'UnKnow'} 👋</h2>
          <p className="text-gray-500">{getGreetingTime()}</p>
      </Header>}
    <div className="p-4 w-full max-w-screen h-fit lg:h-fit mt-10 rounded-xl shadow border border-[#ECECEE]">
      {/* filter bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
  {/* Search */}
  <div className="relative flex-1">
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      type="text"
      placeholder="Tìm kiếm"
      className="w-full border border-gray-300 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
    />
    <FiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
  </div>

  {/* Nút Thêm sinh viên */}
  <button
    onClick={handleNavigate}
    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
  >
    <GoPlusCircle className="text-lg" />
    <span className="text-sm font-medium">Thêm sinh viên</span>
  </button>

  {/* Nút Lọc */}
  <button
    onClick={toggleFilter}
    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
  >
    <FaSlidersH className="text-base" />
    <span className="text-sm font-medium">Lọc</span>
  </button>

  {/* xóa */}
  {selectedStudents.length > 0 && (
  <button
    onClick={handleDeleteSelected}
    className="w-full sm:w-auto flex items-center bg-red-500 text-white justify-center gap-2 px-4 py-2 rounded-lg border hover:bg-red-600 transition cursor-pointer"
  >
    Xóa {selectedStudents.length} sinh viên
  </button>
)}

</div>

      {/* table */}
    
       {loading ? (
        <div className="flex justify-center items-center py-10">
        <div role="status">
    <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-green-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
    <span className="sr-only">Loading...</span>
</div>
        </div>
      ) : (<div className="overflow-x-auto mt-10 max-h-[600px]">
         <table className="lg:w-full min-w-[800px] text-sm table-auto">
            <thead className="sticky top-0 bg-white text-left text-gray-500 border-b border-b-gray-300 z-10">
              <tr>
                <th className="text-center">
  <input
    type="checkbox"
    checked={selectedAll}
    onChange={handleSelectAll}
  />
</th>

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
                <tr key={idx} className="border-b border-b-gray-300 text-sm">
  {/* Checkbox */}
  <td className="px-2 text-center align-middle">
    <input
      type="checkbox"
      checked={selectedStudents.includes(s.maSV)}
      onChange={() => handleSelectOne(s.maSV)}
    />
  </td>

  {/* Avatar, Họ tên, Email */}
  <td className="py-2 px-2 align-middle">
    <div className="flex items-center gap-2">
      <Avatar name={s.hoTen} round size="32" />
      <div className="flex flex-col">
        <span className="font-medium">{s.hoTen}</span>
        <span className="text-sm text-gray-500">{s.email}</span>
      </div>
    </div>
  </td>

  {/* Mã sinh viên */}
  <td className="px-2 align-middle">{s.maSV}</td>

  {/* Vị trí */}
  <td className="px-2 align-middle">{s.viTri}</td>

  {/* Tên trường */}
  <td className="px-2 align-middle">{s.truong.tenTruong}</td>

  {/* Trạng thái */}
  <td className="px-2 align-middle">
    <span
      className={`px-2 py-1 rounded-sm text-xs font-medium ${statusStyle(
        s.trangThai
      )}`}
    >
      {s.trangThai}
    </span>
  </td>

  {/* Hành động */}
  <td className="px-2">
    <div className="flex gap-2">
      <button onClick={() => handleView(s.maSV)} className="text-xl cursor-pointer">
        <RiEyeLine />
      </button>
      <button onClick={() => handleEdit(s.maSV)} className="text-xl cursor-pointer">
        <CiEdit />
      </button>
      <button onClick={() => handleOpenDialog(s.maSV)} className="text-xl cursor-pointer">
        <RiDeleteBin6Line />
      </button>
    </div>
  </td>
</tr>

                );
              })}
            </tbody>
          </table>
        </div>)}
        <div className="flex items-center gap-2 my-4">
  <input
    id="perPage"
    type="number"
    min={1}
    value={perPage}
    onChange={(e) => setPerPage(Number(e.target.value))}
    className="border border-gray-300 px-2 py-1 w-20 rounded"
  />
  <span className="text-sm text-gray-600">
  trên {totalRecords} bản ghi
  </span>
</div>

      <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />

    </div>
    </>
  );
}

export default ListStudentPanel;
