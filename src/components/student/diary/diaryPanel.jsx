import { FiSearch } from "react-icons/fi";
import { GoPlusCircle } from "react-icons/go";
import { RiEyeLine } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ResponNav from "../../../components/responsiveNav";
import Header from "../../../components/header";
import dayjs from "dayjs";

function DiaryPanel() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1025);
  const [searchTerm, setSearchTerm] = useState("");
  const [diaries, setDiaries] = useState([]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1025);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);



  const handleView = (id) => navigate(`/student/diary/diary-details/${id}`);


  // Dummy Data
  useEffect(() => {
    setDiaries([
      { id: 1, tieuDe: "Nhật ký thực tập tuần 1", ngay: "04/10/2025", trangThai: "Hoàn thành" },
      { id: 2, tieuDe: "Nhật ký thực tập tuần 2", ngay: "04/17/2025", trangThai: "Hoàn thành" },
      { id: 3, tieuDe: "Nhật ký thực tập tuần 3", ngay: "04/22/2025", trangThai: "Chưa xong" },
      { id: 4, tieuDe: "Nhật ký thực tập tuần 4", ngay: "04/27/2025", trangThai: "Chưa xong" },
    ]);
  }, []);

  const getStatusStyle = (status) =>
    status === "Hoàn thành"
      ? "text-green-600 bg-green-100"
      : "text-red-600 bg-red-100";
const handleCreateNextDiary = () => {
  const today = new Date();
  
  if (diaries.length > 0) {
    const lastDiaryDate = new Date(diaries[diaries.length - 1].ngay);
    const diffInMs = today - lastDiaryDate;
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    if (diffInDays < 5) {
      alert(`Bạn chỉ có thể tạo nhật ký sau ${Math.ceil(5 - diffInDays)} ngày nữa.`);
      return;
    }
  }

  const weekNumbers = diaries.map((item) => {
    const match = item.tieuDe.match(/tuần (\d+)/i);
    return match ? parseInt(match[1]) : 0;
  });

  const nextWeek = Math.max(...weekNumbers) + 1;
  const todayStr = today.toISOString().split("T")[0];

  const newDiary = {
    id: nextWeek,
    tieuDe: `Nhật ký thực tập tuần ${nextWeek}`,
    ngay: todayStr,
    trangThai: "Chưa xong",
  };

  setDiaries((prev) => [...prev, newDiary]);
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

        <div className="overflow-x-auto">
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
                  <td>{item.tieuDe}</td>
                  <td>{dayjs(item.ngay).format("DD/MM/YYYY")
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
                      onClick={() => handleView(item.id)}
                      className="text-xl text-gray-600 cursor-pointer flex flex-col justify-center hover:text-black"
                    >
                      <RiEyeLine />
                    </button>
                    
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default DiaryPanel;
