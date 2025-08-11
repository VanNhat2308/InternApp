import { FiSearch } from "react-icons/fi";
import { FaPlus, FaSlidersH } from "react-icons/fa";
import { RiCalendarScheduleLine, RiEyeLine } from "react-icons/ri";

import { useNavigate } from "react-router-dom";
import { useFilter } from "../context/filteContext";
import { useEffect, useRef, useState } from "react";
import { useDialog } from "../context/dialogContext";
import { BsFillPeopleFill } from "react-icons/bs";
import axiosClient from "../service/axiosClient";
import { IoSwapHorizontal } from "react-icons/io5";
import Pagination from "./Pagination";
import Avatar from "react-avatar";
import SwapSchedule from "./SwapSchedule";
import Swal from 'sweetalert2';
import ScheduleFormMultiStudent from "./ScheduleFormMultiStudent";
function SchedulePanel() {
      const navigate = useNavigate()
      const { showDialog,hideDialog } = useDialog();
      const[students,setStudent] = useState([]);
      const [currentPage, setCurrentPage] = useState(1);
      const [totalPages, setTotalPages] = useState(1); 
      const [loading, setLoading] = useState(false)
      const [searchTerm, setSearchTerm] = useState('');
      const { filterValues, setDate } = useFilter();
      const [activeTab, setActiveTab] = useState("lich");
      // const apiBaseURL = import.meta.env.VITE_API_BASE_URL
      const [filters,setFilters] = useState({
        viTri:'',
        Truong:'',
        date:''
      })
      const fetchStudents = () => {
  setLoading(true);
  axiosClient
    .get(`/sinhviens/lay-danh-sach-sinh-vien`, {
      params: {
        page: currentPage,
        per_page: 10,
        search: searchTerm,
        vi_tri: filters.viTri,
        truong: filters.Truong,
        date: filters.date,
      },
    })
    .then((res) => {
      setStudent(res.data.data.data);
      setTotalPages(res.data.data.last_page);
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

        const handleSwapInfo =(id) => {
          navigate(`/admin/schedule/SwapSchedule/${id}`)
        }
      


// Đồng bộ mỗi khi filterValues thay đổi
useEffect(() => {
  const selectedPositions = Object.keys(filterValues.positions || {}).filter(key => filterValues.positions[key]);
  const selectedUniversities = Object.keys(filterValues.universities || {}).filter(key => filterValues.universities[key]);
  const date = filterValues.date || '';

  
  setFilters({
    viTri: selectedPositions.join(','),
    Truong: selectedUniversities.join(','),
    date: date
  });

  
}, [filterValues]);

useEffect(() => {
  const delayDebounce = setTimeout(() => {
    fetchStudents();
  }, 500); // debounce 500ms

  return () => clearTimeout(delayDebounce);
}, [searchTerm, currentPage, filters]);


 
  const {toggleFilter} = useFilter()
  
  const handleView = (id) => {
  navigate(`/admin/schedule/schedule-details/${id}`);
};
  const handleEdit = (id) => {  
  navigate(`/admin/list/edit-student/${id}`);
};
  const statusStyle = (status) =>
    status === "Đang thực tập"
      ? "text-green-600 bg-green-100"
      : "text-red-600 bg-red-100";

         useEffect(() => {
  setDate(false)
}, []);


const formRef = useRef();
// them lich cho nhieu
const handleAddScheduleForMany = async() => {
  showDialog({
    title: "Thêm lịch cho nhiều sinh viên",
    customContent: 
    (
      <ScheduleFormMultiStudent ref={formRef}/>
    ),
    confirmText: "Áp dụng cho tất cả",
    cancelText: "Đặt lại",
    onValidatedConfirm: async () => {
         const success = await formRef.current?.submitSchedule();
         if (success) {
           hideDialog();
             await Swal.fire({
       icon: 'success',
       title: 'Tạo Lịch thành công',
       text: 'Lịch mới đã được thêm cho các sinh viên.',
       confirmButtonText: 'OK',
     });
           fetchStudents();
         }
         return false
       },
  });
};

  return (
    <>
     <div className="mt-5 flex-1 flex flex-col">
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
          <li className="me-2">
            <button
              onClick={() => setActiveTab("lich")}
              className={`cursor-pointer inline-block p-4 border-b-2 rounded-t-lg ${
                activeTab === "lich"
                  ? "text-green-600 border-green-600 dark:text-green-500 dark:border-green-500"
                  : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              }`}
            >
            <div className="flex items-center gap-2">
              <RiCalendarScheduleLine /> Lịch thực tập
            </div>
            </button>
          </li>
    
          <li className="me-2">
            <button
              onClick={() => setActiveTab("doiLich")}
              className={`cursor-pointer inline-block p-4 border-b-2 rounded-t-lg ${
                activeTab === "doiLich"
                  ? "text-green-600 border-green-600 dark:text-green-500 dark:border-green-500"
                  : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              }`}
            >
                <div className="flex items-center gap-2">
              <IoSwapHorizontal />  Yêu Cầu Đổi Lịch
            </div>
            </button>
          </li>
        </ul>
      </div>

      {/* Nội dung tương ứng tab */}
      <div className="mt-5">
        {activeTab === "lich" && (
          <div className="p-4 w-full max-w-screen h-fit mt-5 rounded-md border border-gray-100">
      {/* filter bar */}
      <div className="flex flex-col lg:flex-row gap-2 lg:gap-4 lg:h-12">
        {/* search */}
        <div className="h-full relative flex-1">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            placeholder="Tìm kiếm"
            className="w-full border h-full border-gray-300 pl-8 pr-4 px-4 py-2 lg:py-1 rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-200 focus:shadow-md"
          />

          <FiSearch className="absolute top-1/2 left-2 transform -translate-y-1/2" />
        </div>
        {/* filter btn */}
        <button onClick={toggleFilter} className="rounded-md p-2 lg:p-5 flex items-center gap-2 border border-gray-200 cursor-pointer">
          <FaSlidersH />
          Lọc
        </button>
        {/* add btn */}
        <button onClick={handleAddScheduleForMany} className="rounded-md bg-green-600 text-white p-2 lg:p-5 flex items-center gap-2 border border-gray-200 cursor-pointer">
          <FaPlus />
          Thêm
        </button>
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
      ) : (<div className="overflow-x-auto mt-5">
         <table className="w-full min-w-[800px] text-sm table-auto">
            <thead className="text-left bg-gray-100 text-gray-500 border-b border-b-gray-300">
              <tr>
                <th className="py-2 pl-3">Tên sinh viên</th>
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
                  <tr key={idx} className="border-b border-b-gray-300 hover:bg-gray-100 transition duration-150">
                    <td className="py-2 px-2 align-middle">
    <div className="flex items-center gap-2">
      <Avatar name={s.hoTen} round size="32" />
      <div className="flex flex-col">
        <span className="font-medium">{s.hoTen}</span>
        <span className="text-sm text-gray-500">{s.email}</span>
      </div>
    </div>
  </td>
                    <td>{s.maSV}</td>
                    <td>{s.viTri}</td>
                    <td>{s.truong.tenTruong}</td>
                    <td>
                      {" "}
                      <span
                        className={`px-2 py-1 rounded-sm text-xs font-medium ${statusStyle(
                          s.trangThai
                        )}`}
                      >
                        {s.trangThai}
                      </span>
                    </td>
                    <td>
                      <button onClick={() => handleView(s.maSV)} className="text-xl cursor-pointer">
                          <RiEyeLine />
                      </button>
                      {/* <button 
                      onClick={() => handleOpenDialog(s.maSV)}
                      className="text-xl cursor-pointer mx-2">
                         <RiDeleteBin6Line />
                      </button> */}
                    
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>)}
      <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />

    </div>
        )}
        {activeTab === "doiLich" && (
          <SwapSchedule/>
        )}
     
      </div>
    </div>
  
    </>
  );
}

export default SchedulePanel;