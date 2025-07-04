import { FiSearch } from "react-icons/fi";
import { GoPlusCircle } from "react-icons/go";
import { RiEyeLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ResponNav from "../../../components/responsiveNav";
import Header from "../../../components/header";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import axiosClient from "../../../service/axiosClient";
function DiaryPanel() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1025);
  const [searchTerm, setSearchTerm] = useState("");
  const [diaries, setDiaries] = useState([]);
  const [loading, setLoading] = useState(false)
  let maSV = localStorage.getItem('maSV')
  dayjs.extend(isoWeek);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1025);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);



  const handleView = (id) => navigate(`/student/diary/diary-details/${id}`);
  const fetchDiary = () => {
    setLoading(true)
    axiosClient.get(`/nhat-ky/list/${maSV}`, {
      params: { keyword: searchTerm}
    })
      .then((res) => {
        setDiaries(res.data.data);
      })
      .catch((err) => {
        console.error("Lỗi khi tải nhật ký:", err);
      }).finally(() => setLoading(false))
  };


  

  useEffect(() => {
    if (maSV) {
      fetchDiary();
    }
  }, [maSV,searchTerm]); 

  const getStatusStyle = (status) =>
    status === "Hoàn thành"
      ? "text-green-600 bg-green-100"
      : "text-red-600 bg-red-100";
const handleCreateNextDiary = () => {
  const today = dayjs();
  const currentWeek = today.isoWeek();
  const currentYear = today.year();

  // Kiểm tra xem đã tạo nhật ký cho tuần này chưa
  const existingWeek = diaries.find((diary) => {
    const diaryDate = dayjs(diary.ngayTao);
    return (
      diaryDate.isoWeek() === currentWeek &&
      diaryDate.year() === currentYear
    );
  });

  if (existingWeek) {
    alert("Bạn đã tạo nhật ký cho tuần này rồi.");
    return;
  }

  const weekNumbers = diaries.map((item) => {
    const match = item.noiDung.match(/tuần (\d+)/i);
    return match ? parseInt(match[1]) : 0;
  });

  const nextWeek = Math.max(...weekNumbers, 0) + 1;

  const newDiary = {
    ngayTao: today.format("YYYY-MM-DD"),
    noiDung: `Nhật ký thực tập tuần ${nextWeek}`,
    trangThai: "Chưa xong",
    maSV: localStorage.getItem("maSV"),
  };

  // Gọi API để tạo nhật ký
  axiosClient.post("/nhat-ky/store", newDiary)
    .then((res) => {
      setDiaries((prev) => [
        ...prev,
        {
          id: nextWeek,
          noiDung: newDiary.noiDung,
          ngayTao: newDiary.ngayTao,
          trangThai: newDiary.trangThai,
        },
      ]);
      alert("Tạo nhật ký thành công!");
    })
    .catch((err) => {
      console.error("Lỗi khi tạo nhật ký:", err);
      alert("Không thể tạo nhật ký. Vui lòng thử lại.");
    });
};


  return (
    <>
      {isMobile ? (
        <ResponNav />
      ) : (
        <Header>
          <h2 className="text-xl font-semibold">Nhật ký thực tập</h2>
          <p className="text-gray-500">Danh sách nhật ký từng tuần</p>
        </Header>
      )}

      <div className="p-4 max-w-screen bg-white lg:rounded-xl shadow border border-[#ECECEE] mt-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Tìm kiếm"
              className="w-full border border-gray-300 pl-10 pr-4 py-2 rounded-lg  focus:ring-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
          </div>
          <button
            onClick={handleCreateNextDiary}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
          >
            <GoPlusCircle className="text-lg" />
            Tạo Nhật Ký
          </button>
        </div>

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
      ):(<div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm table-auto">
            <thead className="text-left text-gray-500 border-b border-gray-200">
              <tr>
                <th className="py-2">STT</th>
                <th>Tiêu Đề</th>
                <th>Ngày</th>
                <th>Trạng Thái</th>
                <th>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {diaries.map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-2">{index + 1}</td>
                  <td>{item.noiDung}</td>
                  <td>{dayjs(item.ngayTao).format("DD/MM/YYYY")
}</td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getStatusStyle(
                        item.trangThai
                      )}`}
                    >
                      {item.trangThai}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleView(item.maNK)}
                      className="text-xl text-gray-600 cursor-pointer flex flex-col justify-center hover:text-black"
                    >
                      <RiEyeLine />
                    </button>
                    
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>)}
      </div>
    </>
  );
}

export default DiaryPanel;
