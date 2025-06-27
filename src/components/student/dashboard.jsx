import { useEffect, useState } from "react";
import ResponNav from "../responsiveNav";
import Header from "../header";
import { TiShoppingBag } from "react-icons/ti";
import { FaDownload, FaRegCalendarCheck} from "react-icons/fa";
import { MdTask } from "react-icons/md";
import UpdatedDate from "../updatedDate";
import { BiTimer } from "react-icons/bi";
import { BsClockFill } from "react-icons/bs";
import { TbCalendarPlus } from "react-icons/tb";
import WeeklyAttendanceChart from "../WeeklyAttendanceChart";
import { useDialog } from "../../context/dialogContext";
import Toast from "../toast";
import { useToast } from "../../context/toastContext";

function Dashboard() {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1025);
    const [students,setStudents] = useState([])
    const [total,setTotal] = useState(0)
    const [hoSo,setHoSo] = useState(0)
    const [task,setTask] = useState(0)
    const [diemDanh,setDiemDanh] = useState(0)
    const [loading, setLoading] = useState(false)
    const [btnStatus,setBtnStatus] = useState('Chưa điểm danh')

    const getStyleBtnStatus = (btnStatus)=>{
        switch (btnStatus) {
            case 'Chưa điểm danh':
                return 'bg-green-500'
            case 'Clock up':
                return 'bg-black text-white'
            case 'Đã hết giờ làm việc':
                return 'bg-gray-400 text-white'    
            default:
               return 'bg-green-500'
        }

    }


      useEffect(() => {
        const handleResize = () => {
          setIsMobile(window.innerWidth < 1025);
        };
    
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
      }, []);



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
      
        const statusStyle = (status) =>
          status === "on_time"
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


    //   diaglog

    const {showDialog} = useDialog()

     const handleShowDialog = () => {
    showDialog({
      title: "Báo cáo đã được tạo thành công",
      icon: <FaDownload />,
      content: "Báo cáo thực tập của bạn đã được tạo thành công và bạn có thể tải về.",
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
            setToast(true)
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
  const handleShowClockOut = ()=>{

    showDialog({
  title: "Xác nhận Clockout",
  icon: <BsClockFill />,
  content: "Sau khi bạn Clockout, bạn sẽ không thể chỉnh sửa thời gian này. Vui lòng kiểm tra lại giờ làm việc của bạn trước khi tiếp tục.",
  customContent: (
    <div>
      <div className="flex justify-around my-4 gap-2">
        <div className="bg-gray-200 px-6 py-4 rounded-md flex-1">
          <p className="text-gray-500 flex items-center gap-1"><BsClockFill/> Hôm nay</p>
          <p className="text-xl font-semibold">08:00:00 Hrs</p>
        </div>
        <div className="bg-gray-200 px-6 py-4 rounded-md flex-1">
          <p className="text-gray-500 flex items-center gap-1"><BsClockFill/> Overtime</p>
          <p className="text-xl font-semibold">00:13:00 Hrs</p>
        </div>
      </div>
    </div>
  ),
  confirmText: "Có, Clock Out",
  cancelText: "Không, tôi muốn kiểm tra lại",
  onConfirm: () => {
    // Gọi API clock out tại đây
    console.log("Clocked out");
  }
});

  }


   const { isToast, setToast } = useToast();

   const handleCheckTime = ()=>{
    if(btnStatus === 'Chưa điểm danh'){
      // cập nhật checkingtime
      setBtnStatus('Clock up')
    }
    else if(btnStatus === 'Clock up'){
      // gọi dialog, cập nhật checkout
       handleShowClockOut()
       // chỗ này sẽ gọi trong hàm onChange
       setBtnStatus('Đã hết giờ làm việc')
    }
   }

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
          <h2 className="text-xl font-semibold">Xin chào {nameUser || 'Unknow'} 👋</h2>
          <p className="text-gray-500">{getGreetingTime()}</p>
        </Header>
      )}

      {loading? (
 <div className="flex justify-center items-center py-10">
        <div role="status">
    <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-green-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
    <span className="sr-only">Loading...</span>
</div>
        </div>
      ) :(
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-2 lg:p-0">
        <div className="col-span-2">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 ">
            {[
              {
                label: "Tổng thời gian thực tập",
                value: total,
                icon: <BiTimer />,
              },
              { label: "Mức độ chuyên cần", value: hoSo, icon: <TiShoppingBag /> },
               { label: "Tổng số task đã thực hiện", value: task, icon: <MdTask /> },
              {
                label: "Điểm số tổng hợp",
                value: diemDanh,
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
                <UpdatedDate/>
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
                  <th className="py-2">Tên sinh viên</th>
                  <th>Vị trí</th>
                  <th>Thời gian</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, idx) => (
               
                <tr key={idx} className="border-b border-b-gray-300">
                    <td className="py-2 flex gap-2 items-center">
                      <img src={avatar} className="w-7" alt="ava" />
                      {s.sinh_vien.tenDangNhap}
                    </td>

                    <td>{s.sinh_vien.viTri}</td>
                    <td>{s?.gio_bat_dau
}</td>
                    <td>
                      <span
                        className={`px-2 py-1 rounded-sm text-xs font-medium ${statusStyle(
                          s?.trang_thai
                        )}`}
                      >
                        {getTrangThaiTiengViet(s?.trang_thai)}

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
            <p className="text-gray-700 text-base">Thời gian thực tập tháng 4 2025 - tháng 6 2025</p>
            <div className="p-3 bg-gray-100 rounded-md">
            <div className="flex items-center gap-1">
                <BsClockFill className="text-gray-500"/>
                <span>Hôm nay</span>
            </div>
            <h1 className="text-3xl font-semibold">00:00 Hrs</h1>
            </div>
           <button
  onClick={handleCheckTime}
  disabled={btnStatus === 'Đã hết giờ làm việc'}
  className={`${getStyleBtnStatus(btnStatus)} py-2 cursor-pointer rounded-3xl`}
>
  {btnStatus}
</button>

        </div>
        <button onClick={handleShowDialog} className="flex cursor-pointer items-center gap-2 w-full bg-white rounded-xl shadow p-4 border border-[#ECECEE] mb-5">
       <div className="p-2 rounded-md bg-green-100 flex items-center justify-center">
           <TbCalendarPlus  className="text-green-400 text-xl"/>
       </div>
       <span>Tạo báo cáo tự động</span>
        </button>
          <div className="flex flex-col gap-3 ">
            <WeeklyAttendanceChart />
          </div>
        </div>
      </div>)}
    </div>
     );
}

export default Dashboard;