import { FiSearch } from "react-icons/fi";
import { useFilter } from "../context/filteContext";
import { FaSlidersH } from "react-icons/fa";
import { RiDeleteBin6Line, RiEyeLine } from "react-icons/ri";
import Pagination from "./pagination";
import { BsFillPeopleFill } from "react-icons/bs";
import { useDialog } from "../context/dialogContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../service/axiosClient";
import Avatar from "react-avatar";
import { FiClock, FiCheckCircle, FiXCircle } from "react-icons/fi";

function ApprovalPanel() {
  const { toggleFilter,setDate } = useFilter();
  const { showDialog } = useDialog();
  const navigate = useNavigate();
  const [students, setStudent] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { filterValues } = useFilter();
  const [activeTab, setActiveTab] = useState("pending");
  // const apiBaseURL = import.meta.env.VITE_API_BASE_URL
  const [filters, setFilters] = useState({
    viTri: "",
    Truong: "",
    KyThucTap: "",
  });
  function translateStatusToVietnamese(status) {
  switch (status) {
    case "pending":
      return "Chờ duyệt";
    case "approved":
      return "Đã duyệt";
    case "rejected":
      return "Đã từ chối";
    default:
      return "Không xác định";
  }
}
   useEffect(() => {
  setDate(true)
}, []);


  const fetchStudents = () => {
    setLoading(true);
    axiosClient
      .get(`/hoso/lay-danh-sach-ho-so`, {
        params: {
          status: translateStatusToVietnamese(activeTab) ||'Chờ duyệt',
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
    const selectedPositions = Object.keys(filterValues.positions || {}).filter(
      (key) => filterValues.positions[key]
    );
    const selectedUniversities = Object.keys(
      filterValues.universities || {}
    ).filter((key) => filterValues.universities[key]);
    const term = filterValues.term !== "Tất cả" ? filterValues.term : "";

    setFilters({
      viTri: selectedPositions.join(","),
      Truong: selectedUniversities.join(","),
      KyThucTap: term,
    });
  }, [filterValues]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchStudents();
    }, 500); // debounce 500ms

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, currentPage, filters, activeTab]);

  const handleReject = async (maSV) => {
    try {
      await axiosClient.delete(`sinhviens/${maSV}`);
      fetchStudents();
      alert("Đã xóa sinh viên");
    } catch (error) {
      console.error("Lỗi khi từ chối (xoá sinh viên):", error);
    }
  };

  const handleOpenDialog = (maSV) => {
    showDialog({
      title: "Xác nhận xóa thông tin",
      content:
        "Sau khi bạn xóa thông tin, thông tin của sinh viên thực tập sẽ được xóa khỏi danh sách sinh viên. Hãy kiểm tra kỹ.",
      icon: <BsFillPeopleFill />, // ✅ Truyền icon tại đây
      confirmText: "Có, xóa sinh viên",
      cancelText: "Không, tôi muốn kiểm tra lại",
      onConfirm: () => handleReject(maSV),
    });
  };
  const handleView = (id) => {
    navigate(`/admin/approval/approval-details/${id}`);
  };
  const statusStyle = (status) =>{
      switch (status) {
        case 'Đã duyệt':
          return 'text-green-600 bg-green-100'
        case 'Chờ duyệt':
          return 'text-yellow-600 bg-yellow-100'
        case 'Đã từ chối':
          return 'text-red-600 bg-red-100'         
        default:
          break;
      }
   
  }
  // tabs

  const TableView = ()=>{
    return <>
      <div className="p-4 w-full max-w-screen h-fit mt-5 rounded-xl shadow border border-[#ECECEE]">
        {/* filter bar */}
        {/* filter bar */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
        {/* Search box */}
        <div className="relative flex-1">
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        type="text"
        placeholder="Tìm kiếm"
        className="w-full border border-gray-300 pl-10 pr-4 py-3 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-200 focus:shadow-md"
      />
      <FiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
        </div>
      
        {/* Filter button */}
        <button
      onClick={toggleFilter}
      className="flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-800 hover:bg-gray-50 transition-all"
        >
      <FaSlidersH />
      <span className="hidden sm:inline">Lọc</span>
        </button>
      </div>
        {/* table */}
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
        ) : (
          <div className="overflow-x-auto mt-5">
            <table className="lg:w-full min-w-[800px] text-sm table-auto">
              <thead className="text-left bg-gray-100 text-gray-500 border-b border-b-gray-300">
                <tr>
                  <th className="py-2 pl-3">Tên sinh viên</th>
                  <th>Ngày gửi</th>
                  <th>Vị trí ứng tuyển</th>
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
        <Avatar name={s?.sinh_vien?.hoTen} round size="32" />
        <div className="flex flex-col">
          <span className="font-medium">{s?.sinh_vien?.hoTen}</span>
          <span className="text-sm text-gray-500">{s?.sinh_vien?.email}</span>
        </div>
      </div>
        </td>
                      <td>{new Date(s.ngayNop).toLocaleDateString("vi-VN")}</td>
                      <td>{s?.sinh_vien?.viTri}</td>
                      <td>{s?.sinh_vien?.truong?.tenTruong}</td>
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
                        <button
                          onClick={() => handleView(s.maSV)}
                          className="text-xl cursor-pointer mr-2"
                        >
                          <RiEyeLine />
                        </button>
                        {activeTab !== 'rejected' ? '':(<button
                          onClick={() => handleOpenDialog(s?.sinh_vien?.maSV)}
                          className="text-xl cursor-pointer"
                        >
                          <RiDeleteBin6Line />
                        </button>)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />
      </div>
    </>
  }
 
  return (
    <>
  <div className="mt-5">
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
      <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
  <li className="me-2">
    <button
      onClick={() => setActiveTab("pending")}
      className={`cursor-pointer inline-flex items-center gap-1 p-4 border-b-2 rounded-t-lg ${
        activeTab === "pending"
          ? "text-green-600 border-green-600 dark:text-green-500 dark:border-green-500"
          : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
      }`}
    >
      <FiClock className="text-base" />
      Hồ sơ chưa duyệt
    </button>
  </li>
  <li className="me-2">
    <button
      onClick={() => setActiveTab("approved")}
      className={`cursor-pointer inline-flex items-center gap-1 p-4 border-b-2 rounded-t-lg ${
        activeTab === "approved"
          ? "text-green-600 border-green-600 dark:text-green-500 dark:border-green-500"
          : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
      }`}
    >
      <FiCheckCircle className="text-base" />
      Hồ sơ đã duyệt
    </button>
  </li>
  <li className="me-2">
    <button
      onClick={() => setActiveTab("rejected")}
      className={`cursor-pointer inline-flex items-center gap-1 p-4 border-b-2 rounded-t-lg ${
        activeTab === "rejected"
          ? "text-green-600 border-green-600 dark:text-green-500 dark:border-green-500"
          : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
      }`}
    >
      <FiXCircle className="text-base" />
      Hồ sơ đã từ chối
    </button>
  </li>
</ul>
      </div>

      {/* Nội dung tương ứng tab */}
      <div className="mt-6">
        {activeTab === "pending" && (
        <TableView/>
        )}
        {activeTab === "approved" && (
              <TableView/>
        )}
        {activeTab === "rejected" && (
              <TableView/>
        )}
      </div>
    </div>
    
    </>
  );
}

export default ApprovalPanel;
