import { useEffect, useState } from "react";
import axiosClient from "../service/axiosClient";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import Pagination from "./Pagination";
import { FiSearch } from "react-icons/fi";

function SwapSchedule() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState(''); 

  const fetchRequests = async () => {
    setLoading(true)
    try {
    const res = await axiosClient.get("/schedule-swaps",{
      params:{
        page: currentPage,
        per_page: 10,
        search: searchTerm,
        
      }
    });

      setRequests(res.data.data);
      setTotalPages(res.data.last_page)
    } catch (error) {
      console.error("Lỗi khi lấy danh sách yêu cầu:", error);
    } finally {
      setLoading(false);
    }
  };

const handleApprove = async (id) => {
  const confirm = window.confirm("Bạn có chắc chắn muốn duyệt yêu cầu này?");
  if (!confirm) return;

  try {
    await axiosClient.put(`/schedule-swaps/${id}/status`, {
      status: "approved",
    });
    fetchRequests(); // Làm mới danh sách
  } catch (error) {
    console.error("Lỗi duyệt yêu cầu:", error);
  }
};

const handleReject = async (id) => {
  const confirm = window.confirm("Bạn có chắc chắn muốn từ chối yêu cầu này?");
  if (!confirm) return;

  try {
    await axiosClient.put(`/schedule-swaps/${id}/status`, {
      status: "rejected",
    });
    fetchRequests(); // Làm mới danh sách
  } catch (error) {
    console.error("Lỗi từ chối yêu cầu:", error);
  }
};
const getStatusLabel = (status) => {
  switch (status) {
    case "pending":
      return "Chờ duyệt";
    case "approved":
      return "Đã duyệt";
    case "rejected":
      return "Từ chối";
    default:
      return "Không rõ";
  }
};


  useEffect(() => {
      const delayDebounce = setTimeout(() => {
    fetchRequests();
  }, 500); 

  return () => clearTimeout(delayDebounce);
  }, [currentPage,searchTerm]);

  return (
    <div className="flex-1">

       <div className="p-4 w-full max-w-screen h-fit mt-5 rounded-md lg:rounded-xl shadow-md border border-[#ECECEE]">
            
         {/* Search */}
         <div className="relative flex-1">
           <input
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             type="text"
             placeholder="Tìm kiếm theo tên"
             className="w-full border border-gray-200 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-100 transition"
           />
           <FiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
         </div>
     
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
      ) : (
       
         <>
           <div className="overflow-x-auto max-w-screen">
             <table className="min-w-[800px] w-full border border-gray-300 rounded-md text-sm mt-3">
               <thead>
                 <tr className="bg-gray-100 text-gray-700">
                   <th className="border border-gray-300 px-3 py-2 text-left">Mã SV</th>
                   <th className="border border-gray-300 px-3 py-2 text-left">Họ Tên</th>
                   <th className="border border-gray-300 px-3 py-2 text-left">Ca hiện tại</th>
                   <th className="border border-gray-300 px-3 py-2 text-left">Ca muốn đổi</th>
                   <th className="border border-gray-300 px-3 py-2 text-left">Lý do</th>
                   <th className="border border-gray-300 px-3 py-2 text-left">Hình thức</th>
                   <th className="border border-gray-300 px-3 py-2 text-center">Trạng thái</th>
                   <th className="border border-gray-300 px-3 py-2 text-center">Hành động</th>
                 </tr>
               </thead>
               <tbody>
                 {requests.length === 0 ? (
                   <tr>
              <td colSpan="8" className="text-center py-4 text-gray-500">
                Không có yêu cầu nào.
              </td>
                   </tr>
                 ) : (
                   requests.map((req, index) => (
              <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                <td className="border border-gray-300 px-3 py-2">{req.maSV}</td>
                <td className="border border-gray-300 px-3 py-2">{req.sinh_vien.hoTen || 'unknow'}</td>
                <td className="border border-gray-300 px-3 py-2">
                  {dayjs(req.old_date).format("DD/MM/YYYY")} ({req.old_shift})
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  {req.change_type === "nghi"
                    ? "Nghỉ"
                    : `${dayjs(req.new_date).format("DD/MM/YYYY")} (${req.new_shift})`}
                </td>
                <td className="border border-gray-300 px-3 py-2">{req.reason}</td>
                <td className="border border-gray-300 px-3 py-2">
                  {req.change_type === "doi" ? "Đổi ca" : "Nghỉ"}
                </td>
                <td className="border border-gray-300 px-3 py-2 text-center capitalize">
                  {getStatusLabel(req.status)}
                </td>
                <td className="border border-gray-300 px-3 py-2 text-center space-x-2">
                  {req.status === "pending" ? (
                    <>
                      <button
                        onClick={() => handleApprove(req.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs"
                      >
                        Duyệt
                      </button>
                      <button
                        onClick={() => handleReject(req.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                      >
                        Từ chối
                      </button>
                    </>
                  ) : (
                    <span className="text-gray-400 text-xs italic">Đã xử lý</span>
                  )}
                </td>
              </tr>
                   ))
                 )}
               </tbody>
             </table>
           </div>
            <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
         </>
      )}
       </div>


    </div>
  );
}

export default SwapSchedule;
