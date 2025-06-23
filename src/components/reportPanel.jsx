import { useNavigate } from "react-router-dom";
import { useDialog } from "../context/dialogContext";
import { useFilter } from "../context/filteContext";
import avatar from "../assets/images/avatar.png"
import { BsFillPeopleFill } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import { FaSlidersH } from "react-icons/fa";
import { RiDeleteBin6Line, RiEyeLine } from "react-icons/ri";
import Pagination from "./pagination";
import { useEffect, useState } from "react";
import axiosClient from "../service/axiosClient";

function ReportPanel() {
      const {toggleFilter} = useFilter()
      const { showDialog } = useDialog()
      const navigate = useNavigate()
      const [students,setStudent] = useState([])
      const [currentPage, setCurrentPage] = useState(1)
      const [totalPages, setTotalPages] = useState(1)
      const [loading, setLoading] = useState(false)
      const [searchTerm, setSearchTerm] = useState('')
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
    .get(`/bao-cao`, {
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
      setStudent(res.data.baoCaos.data); // ✅ Sửa đúng path
      setTotalPages(res.data.baoCaos.last_page || 1); // nếu backend có `last_page`, còn không giữ 1
    })
    .catch((err) => console.log(err))
    .finally(() => setLoading(false));
};

      
      
      
             const handleDelete = (id) => {
              axiosClient.delete(`/bao-cao/${id}`)
                .then(res => {
                  alert("Xóa thành công!");
                  fetchStudents(); //
                })
                .catch(err => {
                  alert("Xóa thất bại: " + (err?.response?.data?.message || err.message));
                });
            };
            
       



//       const applications = [
//   {
//     avatar: avatar,
//     mssv:21117081,
//     name: 'Phạm Văn A',
//     date: '05/05/2025',
//     position: 'Graphic Designer',
//     university: 'VLU',
//   },
//   {
//     avatar: avatar,
//     mssv:21117081,
//     name: 'Lê Thị B',
//     date: '05/05/2025',
//     position: 'Business Analyst',
//     university: 'UEF',
//   },
//   {
//     avatar: avatar,
//     mssv:21117081,
//     name: 'Trần Văn C',
//     date: '05/05/2025',
//     position: 'Tester',
//     university: 'UEF',
//   },
//   {
//     avatar: avatar,
//     mssv:21117081,
//     name: 'Lê Văn D',
//     date: '04/04/2025',
//     position: 'Front-end Developer',
//     university: 'VLU',
//   },
//   {
//     avatar: avatar,
//     mssv:21117081,
//     name: 'Nguyễn Văn Z',
//     date: '04/04/2025',
//     position: 'Back-end Developer',
//     university: 'UEH',
//   },
//   {
//     avatar: avatar,
//     mssv:21117081,
//     name: 'Trần Văn Q',
//     date: '04/04/2025',
//     position: 'Back-end Developer',
//     university: 'UEH',
//   },
//   {
//     avatar: avatar,
//     mssv:21117081,
//     name: 'Trần Văn B',
//     date: '02/02/2025',
//     position: 'Digital Marketing',
//     university: 'VLU',
//   },
//   {
//     avatar: avatar,
//     mssv:21117081,
//     name: 'Phạm Văn ABC',
//     date: '02/02/2025',
//     position: 'Graphic Designer',
//     university: 'UEL',
//   },
//   {
//     avatar: avatar,
//     mssv:21117081,
//     name: 'Phạm Văn A',
//     date: '28/04/2025',
//     position: 'Graphic Designer',
//     university: 'VLU',
//   },
//   {
//     avatar: avatar,
//     mssv:21117081,
//     name: 'Phạm Văn A',
//     date: '28/04/2025',
//     position: 'Graphic Designer',
//     university: 'VLU',
//   },
//   {
//     avatar: avatar,
//     mssv:21117081,
//     name: 'Phạm Văn A',
//     date: '28/04/2025',
//     position: 'Graphic Designer',
//     university: 'VLU',
//   },
// ];
  

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
          const handleView = (id) => {
  navigate(`/admin/report/report-details/${id}`);
};

    return ( 

            <div className="p-4 w-full max-w-screen h-fit mt-10 rounded-md lg:rounded-xl shadow border border-[#ECECEE]">
              {/* filter bar */}
              <div className="flex flex-col lg:flex-row gap-2 lg:gap-4 lg:h-12">
                {/* search */}
                <div className="h-full relative flex-1">
                  <input
                    type="text"
                    placeholder="Tìm kiếm"
                    onChange={(e)=>setSearchTerm(e.target.value)}
                    className="w-full border h-full border-gray-300 pl-8 pr-4 px-4 py-3 lg:py-4 rounded-md lg:rounded-lg transition-all duration-300"
                  />
        
                  <FiSearch className="absolute top-1/2 left-2 transform -translate-y-1/2" />
                </div>
               
                {/* filter btn */}
                <button onClick={toggleFilter} className="rounded-md lg:rounded-xl p-2 lg:p-5 flex items-center gap-2 border border-gray-200 cursor-pointer">
                  <FaSlidersH/>
                  Lọc
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
               )
               :(<div className="overflow-x-auto mt-10">
                 <table className="lg:w-full min-w-[800px] text-sm table-auto">
                    <thead className="text-left text-gray-500 border-b border-b-gray-300">
                      <tr>
                        <th className="py-2 ">Tên sinh viên</th>
                        <th>MSSV</th>
                        <th>Vị trí</th>
                        <th>Trường</th>
                        <th>Ngày gửi</th>
                        <th>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((a, idx) => {
                        return (
                          <tr key={idx} className="border-b border-b-gray-300">
                            <td className="py-2 flex gap-2 items-center">
                              <img src={avatar} className="w-7" alt="ava" />
                              {a?.sinh_vien?.hoTen}
                            </td>
                            <td>{a?.sinh_vien?.maSV}</td>
                            <td>{a?.sinh_vien.viTri}</td>
                            <td>{a?.sinh_vien?.truong?.tenTruong}</td>
                            <td>{new Date(a.ngayTao).toLocaleDateString("vi-VN")}</td>
                           
                            <td className="flex gap-2">
                              <button onClick={() => handleView(a.maBC)} className="text-xl cursor-pointer">
                                  <RiEyeLine />
                              </button>
    
                              <button 
                              onClick={()=>handleOpenDialog(a.maBC)}
                              className="text-xl cursor-pointer">
                                 <RiDeleteBin6Line />
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
     );
}

export default ReportPanel;