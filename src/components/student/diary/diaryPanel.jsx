import { FiEye, FiPrinter, FiSearch } from "react-icons/fi";
import { GoPlusCircle } from "react-icons/go";
import { RiEyeLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ResponNav from "../../../components/responsiveNav";
import Header from "../../../components/header";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import axiosClient from "../../../service/axiosClient";
import { TbReportMedical } from "react-icons/tb";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import DatePicker from "react-datepicker";
import { FaRegCalendarAlt } from "react-icons/fa";
function DiaryPanel() {
  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1025);
  const [searchTerm, setSearchTerm] = useState("");
  const [diaries, setDiaries] = useState([]);
  const [loading, setLoading] = useState(false)
  const [loadingReport, setLoadingReport] = useState(false)
  let maSV = localStorage.getItem('maSV')
  const [activeTab, setActiveTab] = useState("diary"); // 'diary' hoặc 'report'
  const [reports, setReports] = useState([]);

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

  const existingWeek = diaries.find((diary) => {
    const diaryDate = dayjs(diary.ngayTao);
    return (
      diaryDate.isoWeek() === currentWeek &&
      diaryDate.year() === currentYear
    );
  });

  if (existingWeek) {
    Swal.fire({
      icon: "info",
      title: "Thông báo",
      text: "Bạn đã tạo nhật ký cho tuần này rồi.",
    });
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
      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Tạo nhật ký thành công!",
      });
    })
    .catch((err) => {
      console.error("Lỗi khi tạo nhật ký:", err);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không thể tạo nhật ký. Vui lòng thử lại.",
      });
    });
};



const handleReport = async (maNK) => {
  try {
    const res = await axiosClient.get(`/nhat-ky/${maNK}`);
    const diary = res.data.data;

    const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

    // Nhóm công việc theo thứ
    const groupedByDay = {};
    diary.chi_tiet_nhat_kies.forEach(task => {
      const day = new Date(task.ngayThucHien).getDay();
      const dayLabel = days[day];

      if (!groupedByDay[dayLabel]) {
        groupedByDay[dayLabel] = [];
      }
      groupedByDay[dayLabel].push(task);
    });

    // Tạo HTML báo cáo
    const reportHTML = `
      <h3 style="margin-bottom: 10px;">📌 ${diary.noiDung}</h3>
      <table style="border-collapse: collapse; width: 100%; font-size: 14px;">
        <thead>
          <tr style="background-color: #f0f0f0;">
            <th style="padding: 8px; border: 1px solid #ccc;">Thứ</th>
            <th style="padding: 8px; border: 1px solid #ccc;">Tên Công Việc</th>
            <th style="padding: 8px; border: 1px solid #ccc;">Kết Quả</th>
            <th style="padding: 8px; border: 1px solid #ccc;">Tiến Độ</th>
          </tr>
        </thead>
        <tbody>
          ${
            Object.entries(groupedByDay).map(([dayLabel, tasks]) => {
              return tasks.map((task, idx) => `
                <tr>
                  <td style="padding: 6px; border: 1px solid #ccc;">${idx === 0 ? dayLabel : ""}</td>
                  <td style="padding: 6px; border: 1px solid #ccc;">${task.tenCongViec}</td>
                  <td style="padding: 6px; border: 1px solid #ccc;">${task.ketQua}</td>
                  <td style="padding: 6px; border: 1px solid #ccc;">${task.tienDo}</td>
                </tr>
              `).join('');
            }).join('')
          }
        </tbody>
      </table>
    `;

    // Hộp thoại xác nhận tạo báo cáo
    const result = await MySwal.fire({
      title: "Tạo báo cáo từ nhật ký?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Tạo báo cáo",
      cancelButtonText: "Huỷ",
    });

  if (result.isConfirmed) {
  const confirm = await MySwal.fire({
    title: "📄 Báo cáo tuần",
    html: reportHTML,
    width: "800px",
    confirmButtonText: "Nộp báo cáo",
    showCancelButton: true,
    cancelButtonText: "Đóng",
    scrollbarPadding: false,
  });

  if (confirm.isConfirmed) {
    // Gửi dữ liệu lên API
    await axiosClient.post("/bao-cao", {
      loai: diary.noiDung,
      ngayTao: new Date().toISOString().split("T")[0],
      noiDung: reportHTML, // hoặc có thể convert sang plain text nếu cần
      tepDinhKem: null, // nếu chưa upload file
      maSV: localStorage.getItem('maSV'), // thay bằng biến thực tế
    });

    MySwal.fire("Thành công", "Đã nộp báo cáo!", "success");
  }
}

  } catch (error) {
    console.error(error);
    Swal.fire("Lỗi", "Không thể tạo báo cáo", "error");
  }
};

const fetchReports = async () => {
  try {
    setLoadingReport(true)
    const res = await axiosClient.get('/bao-cao-theo-ma', {
      params: { maSV, date: selectedDate}
    });
    setReports(res.data.data || []);
  } catch (err) {
    console.error("Lỗi khi lấy danh sách báo cáo:", err);
  }finally{
    setLoadingReport(false)
  }
};
const handleViewReport = (report) => {
  // Có thể hiển thị modal hoặc chuyển trang chi tiết
  Swal.fire({
    title: report.loai,
    html: report.noiDung,
    width: '60%',
    showCloseButton: true,
  });
};

const handlePrintReport = (report) => {
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head>
        <title>${report.loai}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          table { border-collapse: collapse; width: 100%; }
          td, th { border: 1px solid #ccc; padding: 8px; }
        </style>
      </head>
      <body>
        <h2>${report.loai}</h2>
        <p><strong>Ngày tạo:</strong> ${dayjs(report.ngayTao).format("DD/MM/YYYY")}</p>
        ${report.noiDung}
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
};

const [selectedDate, setSelectedDate] = useState(null);
useEffect(()=>{
  fetchReports()
},[selectedDate])
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
<div className="flex gap-2 mt-10 p-2 lg:p-0 lg:mt-5">
  <button
    className={`cursor-pointer px-4 py-2 rounded ${activeTab === "diary" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600"}`}
    onClick={() => setActiveTab("diary")}
  >
    Nhật ký
  </button>
  <button
    className={`cursor-pointer px-4 py-2 rounded ${activeTab === "report" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600"}`}
    onClick={() => {
      setActiveTab("report");
    }}
  >
    Báo cáo đã nộp
  </button>
</div>
{activeTab === "diary" ? (

   <div className="p-4 max-w-screen bg-white lg:rounded-md border border-[#ECECEE] mt-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Tìm kiếm"
              className="w-full border border-gray-300 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 focus:shadow-md"
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
                    <div className="flex gap-1 ml-4">
                      <button
                      title="Xem"
                        onClick={() => handleView(item.maNK)}
                        className="text-xl cursor-pointer flex flex-col justify-center hover:text-black"
                      >
                        <RiEyeLine />
                      </button>
                      <button
                      title="Tạo Báo Cáo"
                        onClick={() => handleReport(item.maNK)}
                        className="text-xl cursor-pointer flex flex-col justify-center hover:text-black"
                      >
                       <TbReportMedical />
                      </button>
                    </div>
                    
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>)}
      </div>
) : (

  <div className="p-4 max-w-screen bg-white lg:rounded-md border border-[#ECECEE] mt-3 overflow-x-auto">
       <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
         
   

<div className="relative w-full max-w-xs">
  <FaRegCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
  <input
    type="date"
    value={selectedDate}
    onChange={(e) => setSelectedDate(e.target.value)}
    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 text-gray-700"
  />
</div>


        </div>
      {loadingReport ? (
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
      ):(<table className="w-full min-w-[600px] text-sm table-auto">
      <thead className="text-left text-gray-500 border-b border-gray-200">
        <tr>
          <th className="py-2">STT</th>
          <th>Loại</th>
          <th>Ngày Tạo</th>
          <th>Hành Động</th>
        </tr>
      </thead>
      <tbody>
        {reports.map((item, index) => (
          <tr key={index} className="border-b border-gray-100">
            <td className="py-2">{index + 1}</td>
            <td>{item.loai}</td>
            <td>{dayjs(item.ngayTao).format("DD/MM/YYYY")}</td>
           <td>

<div className="flex gap-4">
  <button
    onClick={() => handleViewReport(item)}
    className="flex items-center gap-1 hover:underline cursor-pointer"
    title="Xem nội dung"
  >
    <FiEye />
    Xem
  </button>
  <button
    onClick={() => handlePrintReport(item)}
    className="flex items-center gap-1 hover:underline cursor-pointer"
    title="In báo cáo"
  >
    <FiPrinter />
    In
  </button>
</div>
</td>

          </tr>
        ))}
      </tbody>
    </table>)}
  </div>
)}

     
    </>
  );
}

export default DiaryPanel;
