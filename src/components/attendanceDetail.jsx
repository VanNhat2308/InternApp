import ResponNav from "../components/responsiveNav";
import Header from "../components/header";
import avatar from "../assets/images/avatar.png";
import manSelf from "../assets/images/maSelf.jpg";
import { useEffect, useState } from "react";
import { RiEyeLine, RiShoppingBag3Line } from "react-icons/ri";
import { MdOutlineEmail } from "react-icons/md";
import { useDialog } from "../context/dialogContext";
import { useNavigate, useParams } from "react-router-dom";
import DateInput from "./datePicker";
import Pagination from "./pagination";
function AttendanceDetails() {
   const [isMobile, setIsMobile] = useState(window.innerWidth < 1025);
  const { showDialog } = useDialog();
  const { idSlug } = useParams();
  const navigate = useNavigate()
  const workLogs = [
  { date: '2025-04-26', workDuration: '8h09', startTime: '8:00 AM', checkInTime: '7:30 AM' },
  { date: '2025-04-25', workDuration: '7h55', startTime: '8:00 AM', checkInTime: '8:07 AM' },
  { date: '2025-04-23', workDuration: '8h01', startTime: '8:00 AM', checkInTime: '8:07 AM' },
  { date: '2025-04-22', workDuration: '8h00', startTime: '8:00 AM', checkInTime: '8:00 AM' },
  { date: '2025-04-21', workDuration: '8h15', startTime: '8:00 AM', checkInTime: '7:50 AM' },
  { date: '2025-04-20', workDuration: '7h45', startTime: '8:00 AM', checkInTime: '8:05 AM' },
  { date: '2025-04-19', workDuration: '8h10', startTime: '8:00 AM', checkInTime: '7:55 AM' },
  { date: '2025-04-18', workDuration: '7h50', startTime: '8:00 AM', checkInTime: '8:10 AM' },
  { date: '2025-04-17', workDuration: '8h05', startTime: '8:00 AM', checkInTime: '7:58 AM' },
  { date: '2025-04-16', workDuration: '8h12', startTime: '8:00 AM', checkInTime: '7:48 AM' },
  { date: '2025-04-15', workDuration: '7h59', startTime: '8:00 AM', checkInTime: '8:01 AM' },
  { date: '2025-04-14', workDuration: '8h00', startTime: '8:00 AM', checkInTime: '8:00 AM' },
  { date: '2025-04-13', workDuration: '8h08', startTime: '8:00 AM', checkInTime: '7:52 AM' },
];


  

  const handleOpenDialog = () => {
    showDialog({
     customContent:(
      <div>
        <img src={manSelf} alt="ava" className="w-full object-cover rounded-xl mb-4" />
        <div className="flex justify-center mb-5">
          <span className="w-20 h-1 bg-gray-800"></span>
        </div>

     
        <div className="flex justify-between rounded-xl bg-gray-100 p-4 border border-gray-300">
          <div className="flex flex-col">
       <h6>Thời gian làm việc</h6>
       <h1 className="font-bold text-xl">08:00:00 hrs</h1>
          </div>
          <div className="flex flex-col">
       <h6>Clock in & Out</h6>
       <h1 className="font-bold text-xl">08:00 AM  — 05:00 PM</h1>
          </div>

        </div>
         </div>
      ),
      confirmText: "Đóng",
      onConfirm: () => {
        console.log("Đã xóa sinh viên");
      },
    });
  };
  


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1025);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const parseTimeToMinutes = (timeStr) => {
  const [time, meridiem] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  if (meridiem === 'PM' && hours !== 12) hours += 12;
  if (meridiem === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
};

const getStatus = (checkingTime) => {
  const totalMinutes = parseTimeToMinutes(checkingTime);
  return totalMinutes <= 480 ? "Đúng giờ" : "Đi trễ";
};



const statusStyle = (checkInTime) => {
    const totalMinutes = parseTimeToMinutes(checkInTime);
  return totalMinutes <= 480 ? "text-green-600 bg-green-100" : "text-yellow-600 bg-yellow-100"; 
};

  return(
    <>
     {isMobile ? <ResponNav /> : 
<Header>
          <h2 className="text-xl font-semibold">Quản Lý Điểm Danh</h2>
          <p className="text-gray-500">Xem Thời Gian Điểm Danh Của Sinh Viên</p>
</Header>}
<div className="border border-gray-300 p-4 mt-10 rounded-md shadow">
  <div>
        {/* avartar */}
              <div className="flex gap-2 ">
                <img
                  src={avatar}
                  alt="avartar"
                  className="w-20 aspect-square rounded-md border border-gray-300"
                />
                <div>
                  <h1 className="text-xl font-bold">PHAM VAN A</h1>
                  <h4
                    className="flex
                items-center gap-1 text-lg text-gray-600"
                  >
                    <RiShoppingBag3Line className="text-2xl" /> Graphic Designer
                  </h4>
                  <h4
                    className="flex
                items-center gap-1 text-lg text-gray-600"
                  >
                    <MdOutlineEmail className="text-2xl" />
                    phamvana123@gmail.com
                  </h4>
                </div>
              </div>
             <DateInput/>
  </div>
  {/* table */}
        <div className="overflow-x-auto mt-10">
         <table className=" min-w-[800px] w-full text-sm table-auto">
            <thead className="text-left text-gray-500 border-b border-b-gray-300">
              <tr>
                <th className="py-2 ">Ngày</th>
                <th>Thời gian làm việc</th>
                <th>Giờ bắt đầu</th>
                <th>Giờ điểm danh</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {workLogs.map((item, idx) => {
                return (
                  <tr key={idx} className="border-b border-b-gray-300">
                    <td className="py-2">
                      {item.date}
                    </td>
                    <td>{item.workDuration}</td>
                    <td>{item.startTime}</td>
                    <td>{item.checkInTime}</td>
                    <td>
                      {" "}
                      <span
                        className={`px-2 py-1 rounded-sm text-xs font-medium ${statusStyle(
                          item.checkInTime
                        )}`}
                      >
                        {getStatus(item.checkInTime)}
                      </span>
                    </td>
                    <td className="">
                      <button onClick={() => handleOpenDialog()} className="text-xl cursor-pointer">
                          <RiEyeLine />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      <Pagination totalPages={5} />

</div>


    </>
  )
}

export default AttendanceDetails