import { useEffect, useRef, useState } from "react";
import ResponNav from "../responsiveNav";
import Header from "../header";
import { TiShoppingBag } from "react-icons/ti";
import { FaDownload, FaRegCalendarCheck } from "react-icons/fa";
import { MdTask } from "react-icons/md";
import UpdatedDate from "../updatedDate";
import { BiTimer } from "react-icons/bi";
import { BsClockFill } from "react-icons/bs";
import { TbCalendarPlus } from "react-icons/tb";
import WeeklyAttendanceChart from "../WeeklyAttendanceChart";
import { useDialog } from "../../context/dialogContext";
import Toast from "../toast";
import { useToast } from "../../context/toastContext";
import Clock from "../Clock";
import { useDashboardData } from "../../hooks/useDashboardData";
import axiosClient from "../../service/axiosClient";
import { useQueryClient } from '@tanstack/react-query';

function Dashboard() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1025);
  const [btnStatus, setBtnStatus] = useState("Chưa điểm danh");
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [currentTime,setCurrentTime] = useState(null)
  const queryClient = useQueryClient();

  // logic checking
const handleClockIn = async() => {
  const now = new Date();
  const hhmmss = now.toTimeString().split(' ')[0]; // "HH:mm:ss"
  setCheckInTime(hhmmss);

  // Tính tổng phút hiện tại
  const [hour, minute] = hhmmss.split(":").map(Number);
  const totalMinutes = hour * 60 + minute;

  // Mặc định là 'on_time', nếu điểm danh sau 08:00 hoặc sau 13:00 thì là 'late'
  let status = "on_time";
  if (hour < 12) {
    // Buổi sáng: sau 08:00 AM là trễ
    if (totalMinutes > 480) status = "late";
  } else {
    // Buổi chiều: sau 01:00 PM là trễ
    if (totalMinutes > 780) status = "late";
  }

 await axiosClient.post('/diem-danh/store-or-update', {
    maSV,
    gio_bat_dau: hhmmss,
    trang_thai: status, // 'on_time' hoặc 'late'
  });
 queryClient.invalidateQueries(['dashboard-data', maSV]);

  setBtnStatus("Clock up");
};

const handleClockOut = async() => {
  if (!checkInTime) {
    alert("Bạn chưa điểm danh giờ bắt đầu.");
    return;
  }

  const now = new Date();
  const [inHour, inMinute, inSecond] = checkInTime.split(":").map(Number);
  const checkInDate = new Date(now);
  checkInDate.setHours(inHour, inMinute, inSecond, 0);

  const diffMs = now - checkInDate;
  const diffMinutes = Math.floor(diffMs / 1000 / 60);

  if (diffMinutes < 5) {
    alert("Bạn chưa làm việc đủ 5 phút để Clock Out.");
    return;
  }

  const hhmmss = now.toTimeString().split(' ')[0];
  setCheckOutTime(hhmmss);

  await axiosClient.post('/diem-danh/store-or-update', {
    maSV,
    gio_ket_thuc: hhmmss,
  });
 queryClient.invalidateQueries(['dashboard-data', maSV]);
 setBtnStatus("Đã hết giờ làm việc")
};





const handleCheckTime = () => {
  if (btnStatus === "Chưa điểm danh") {
    handleClockIn(); // lấy giờ hiện tại 1 lần duy nhất
  } else if (btnStatus === "Clock up") {
    handleShowClockOut(); // chỉ hiện dialog
  }
};



  // 
  const maSV = localStorage.getItem("maSV");
  const parseTimeToMinutes = (timeStr) => {
    const [time, meridiem] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (meridiem === "PM" && hours !== 12) hours += 12;
    if (meridiem === "AM" && hours === 12) hours = 0;
    return hours * 60 + minutes;
  };
  const formatTo12Hour = (timeStr) => {
    if (!timeStr || typeof timeStr !== "string") return "";

    const parts = timeStr.split(":");
    if (parts.length < 2) return "";

    let hour = parseInt(parts[0], 10);
    const minute = parts[1] || "00";

    const meridiem = hour >= 12 ? "PM" : "AM";
    hour = hour % 12;
    hour = hour === 0 ? 12 : hour;

    return `${hour}:${minute.padStart(2, "0")} ${meridiem}`;
  };

const getStatus = (checkInTime) => {
  const [hour, minute] = checkInTime.split(":").map(Number);

  const totalMinutes = hour * 60 + minute;

  // Nếu điểm danh buổi sáng (trước 12h)
  if (hour < 12) {
    return totalMinutes <= 480 ? "Đúng giờ" : "Đi trễ"; // 480 = 8:00 AM
  } else {
    return totalMinutes <= 780 ? "Đúng giờ" : "Đi trễ"; // 780 = 13:00 PM
  }
};


  const statusStyles = (checkInTime) => {
    const totalMinutes = parseTimeToMinutes(checkInTime);
    return totalMinutes <= 480
      ? "text-green-600 bg-green-100"
      : "text-yellow-600 bg-yellow-100";
  };
const { data = { internStats: {}, diemDanh: [], chartData: {}, todayCheck: null}, isLoading, isError } = useDashboardData(maSV);
const { internStats, diemDanh, chartData } = data;


useEffect(() => {
  const today = data?.todayCheck?.data;

  if (today) {
    const { gio_bat_dau, gio_ket_thuc } = today;

    if (gio_bat_dau && !gio_ket_thuc) {
      setBtnStatus("Clock up");
      setCheckInTime(gio_bat_dau);
    } else if (gio_bat_dau && gio_ket_thuc) {
      setBtnStatus("Đã hết giờ làm việc");
      setCheckInTime(gio_bat_dau);
      setCheckOutTime(gio_ket_thuc);
    }
  } else {
    // Nếu chưa có điểm danh hôm nay
    setBtnStatus("Chưa điểm danh");
    setCheckInTime(null);
    setCheckOutTime(null);
  }
}, [data]);



  const getStyleBtnStatus = (btnStatus) => {
    switch (btnStatus) {
      case "Chưa điểm danh":
        return "bg-green-500";
      case "Clock up":
        return "bg-black text-white";
      case "Đã hết giờ làm việc":
        return "bg-gray-400 text-white";
      default:
        return "bg-green-500";
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1025);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


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
  const nameUser = localStorage.getItem("user");

  //   diaglog

  const { showDialog } = useDialog();

  const handleShowDialog = () => {
    showDialog({
      title: "Báo cáo đã được tạo thành công",
      icon: <FaDownload />,
      content:
        "Báo cáo thực tập của bạn đã được tạo thành công và bạn có thể tải về.",
      customContent: (
        <div className="flex justify-center gap-4">
          <button
            onClick={() => {
              // Gọi API hoặc tải file PDF
              //   window.open("/files/baocao.pdf", "_blank");
            }}
            className="bg-[#34A853] text-white px-6 py-2 rounded-full font-medium"
          >
            Tải về .PDF
          </button>
          <button
            onClick={() => {
              // Gọi API hoặc tải file DOCX
              //   window.open("/files/baocao.docx", "_blank");
              setToast(true);
            }}
            className="bg-[#34A853] text-white px-6 py-2 rounded-full font-medium"
          >
            Tải về .DOCX
          </button>
        </div>
      ),
      cancelText: "Đóng",
    });
  };
  const handleShowClockOut = () => {
    showDialog({
      title: "Xác nhận Clockout",
      icon: <BsClockFill />,
      content:
        "Sau khi bạn Clockout, bạn sẽ không thể chỉnh sửa thời gian này. Vui lòng kiểm tra lại giờ làm việc của bạn trước khi tiếp tục.",
      customContent: (
        <div>
          <div className="flex justify-around my-4 gap-2">
            <div className="bg-gray-200 px-6 py-4 rounded-md flex-1">
              <p className="text-gray-500 flex items-center gap-1">
                <BsClockFill /> Hôm nay
              </p>
              <p className="text-xl font-semibold">{checkInTime} hrs</p>
            </div>
            <div className="bg-gray-200 px-6 py-4 rounded-md flex-1">
              <p className="text-gray-500 flex items-center gap-1">
                <BsClockFill /> Overtime
              </p>
              <p className="text-xl font-semibold">  {checkOutTime || new Date().toTimeString().split(" ")[0]} hrs</p>
            </div>
          </div>
        </div>
      ),
      confirmText: "Có, Clock Out",
      cancelText: "Không, tôi muốn kiểm tra lại",
      onConfirm: () => {
        handleClockOut();
      },
    });
  };

  const { isToast, setToast } = useToast();



  return (
    <div className="lg:p-6 flex-1 space-y-6">
      {isToast ? (
        <Toast onClose={() => setToast(false)}>
          <div className="flex items-center gap-3">
            <div className="w-15 aspect-square rounded-full border-2 border-green-400 flex items-center justify-center">
              <FaDownload className="text-2xl text-green-400" />
            </div>
            <p>Tải về báo cáo thành công!</p>
          </div>
        </Toast>
      ) : (
        ""
      )}
      {isMobile ? (
        <ResponNav />
      ) : (
        <Header>
          <h2 className="text-xl font-semibold">
            Xin chào {nameUser || "Unknow"} 👋
          </h2>
          <p className="text-gray-500">{getGreetingTime()}</p>
        </Header>
      )}

      {isLoading ? (
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-2 lg:p-0">
          <div className="col-span-2">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 ">
              {[
                {
                  label: "Tổng thời gian thực tập",
                  value: `${internStats?.totalTime ?? 0} Giờ`,
                  icon: <BiTimer />,
                },
                {
                  label: "Mức độ chuyên cần",
                  value: `${internStats?.level ?? 0} Buổi`,
                  icon: <TiShoppingBag />,
                },
                {
                  label: "Tổng số task đã thực hiện",
                  value: internStats?.numTasks ?? 0,
                  icon: <MdTask />,
                },
                {
                  label: "Điểm số tổng hợp",
                  value: `${internStats?.score ?? 0}/10`,
                  icon: <FaRegCalendarCheck />,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-white rounded-xl shadow border border-[#ECECEE]"
                >
                  <div className="p-4 pb-2">
                    <div className="flex gap-2 items-center">
                      <div className="flex items-center justify-center text-2xl w-10 h-10 bg-green-100 text-green-400 rounded-md">
                        {item.icon}
                      </div>
                      <p className="text-sm font-semibold">{item.label}</p>
                    </div>
                    <h3 className="text-2xl font-bold mt-2">{item.value}</h3>
                  </div>
                  <UpdatedDate />
                </div>
              ))}
            </div>
            {/* Table */}
            <div className="w-full overflow-x-auto bg-white rounded-xl shadow p-4 mt-5 lg:mt-10 border border-[#ECECEE]">
              <div className="flex justify-between mb-4">
                <h4 className="font-semibold text-lg">Tổng quan điểm danh</h4>
                <button className="text-blue-600 text-sm">Xem Tất Cả</button>
              </div>
              <table className="w-full min-w-[600px] text-sm">
                <thead className="text-left text-gray-500 border-b border-b-gray-300">
                  <tr>
                    <th className="py-2 text-left">Ngày</th>
                    <th className="text-left">Điểm danh</th>
                    <th className="text-left">Clockout</th>
                    <th className="text-left">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {diemDanh.map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-200">
                      <td className="py-2">
                        {new Date(item.ngay_diem_danh).toLocaleDateString(
                          "vi-VN"
                        )}
                      </td>
                      <td>{formatTo12Hour(item.gio_bat_dau)}</td>

                      <td>{formatTo12Hour(item.gio_ket_thuc)}</td>
                      <td>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${statusStyles(
                            item.gio_bat_dau
                          )}`}
                        >
                          {getStatus(item.gio_bat_dau)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Bar Chart placeholder */}
          <div className=" col-span-2 lg:col-span-1">
            <div className="flex flex-col gap-2 mb-5 bg-white rounded-xl shadow p-4 border border-[#ECECEE]">
              <h3 className="text-xl font-bold">Thời gian làm việc</h3>
              <p className="text-gray-700 text-base">
                Thời gian thực tập tháng 4 2025 - tháng 6 2025
              </p>
              <div className="p-3 bg-gray-100 rounded-md">
                <div className="flex items-center gap-1">
                  <BsClockFill className="text-gray-500" />
                  <span>Hôm nay</span>
                </div>
                <h1 className="text-3xl font-semibold">
                 <Clock onTimeUpdate={(time) => setCurrentTime(time)} />
                </h1>
              </div>
              <button
                onClick={handleCheckTime}
                disabled={btnStatus === "Đã hết giờ làm việc"}
                className={`${getStyleBtnStatus(
                  btnStatus
                )} py-2 cursor-pointer rounded-3xl`}
              >
                {btnStatus}
              </button>
            </div>
            <button
              onClick={handleShowDialog}
              className="flex cursor-pointer items-center gap-2 w-full bg-white rounded-xl shadow p-4 border border-[#ECECEE] mb-5"
            >
              <div className="p-2 rounded-md bg-green-100 flex items-center justify-center">
                <TbCalendarPlus className="text-green-400 text-xl" />
              </div>
              <span>Tạo báo cáo tự động</span>
            </button>
            <div className="flex flex-col gap-3 ">
              <WeeklyAttendanceChart  chartData={chartData}/>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
