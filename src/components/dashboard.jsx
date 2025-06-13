import React, { useEffect, useState } from "react";
import Header from "../components/header";
import { IoIosPeople } from "react-icons/io";
import { TiShoppingBag } from "react-icons/ti";
import { FaRegCalendarCheck } from "react-icons/fa";
import { MdTask } from "react-icons/md";
import avatar from "../assets/images/avatar.png";
import AttendanceChart from "./attendanceChart";
import ResponNav from "../components/responsiveNav";
import axiosClient from "../service/axiosClient";
import UpdatedDate from "./updatedDate";

const Dashboard = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1025);
  const [students,setStudents] = useState([])
  const [total,setTotal] = useState(0)
  const [hoSo,setHoSo] = useState(0)
  const [task,setTask] = useState(0)
  const [diemDanh,setDiemDanh] = useState(0)
  const [loading, setLoading] = useState(false)
 

 useEffect(() => {
  setLoading(true);
  Promise.all([
    axiosClient.get('/diem-danh/danh-sach-hom-nay?page=1'),
    axiosClient.get('/hoso/counths'),
    axiosClient.get('/student/tasks/countTask'),
    axiosClient.get('/sinhviens/countSV'),
  ])
    .then(([studentsRes, hoSoRes, taskRes, totalRes]) => {
      setStudents(studentsRes.data.data.data);
      setHoSo(hoSoRes.data.total_hs);
      setTask(taskRes.data.total_task);
      setDiemDanh(studentsRes.data.data.total); 
      setTotal(totalRes.data.total_sv);
    })
    .catch(err => console.error(err))
    .finally(() => setLoading(false))

}, []);



  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1025);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // const students = [
  //   {
  //     name: "Phạm Văn A",
  //     role: "Graphic Design",
  //     time: "8:00 AM",
  //     status: "Đúng giờ",
  //   },
  //   {
  //     name: "Lê Thị B",
  //     role: "Business analyst",
  //     time: "7:58 AM",
  //     status: "Đúng giờ",
  //   },
  //   { name: "Trần Văn C", role: "Tester", time: "7:30 AM", status: "Đúng giờ" },
  //   {
  //     name: "Lê Văn D",
  //     role: "Front-end Developer",
  //     time: "8:07 AM",
  //     status: "Đi trễ",
  //   },
  //   {
  //     name: "Nguyễn Văn Z",
  //     role: "Back-end Developer",
  //     time: "8:30 AM",
  //     status: "Đi trễ",
  //   },
  //   {
  //     name: "Trần Văn D",
  //     role: "Back-end Developer",
  //     time: "8:47 AM",
  //     status: "Đi trễ",
  //   },
  //   {
  //     name: "Trần Văn B",
  //     role: "Digital Marketing",
  //     time: "7:55 AM",
  //     status: "Đúng giờ",
  //   },
  // ];
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

  return (
    <div className="lg:p-6 flex-1 space-y-6">
      {isMobile ? (
        <ResponNav />
      ) : (
        <Header>
          <h2 className="text-xl font-semibold">Xin chào Nguyễn Văn A 👋</h2>
          <p className="text-gray-500">Chào buổi sáng</p>
        </Header>
      )}

      {loading? (
 <div className="flex justify-center items-center py-10">
        <div role="status">
    <svg aria-hidden="true" class="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-green-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
    <span class="sr-only">Loading...</span>
</div>
        </div>
      ) :(
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-2 lg:p-0">
        <div className="col-span-2">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 ">
            {[
              {
                label: "Tổng thực tập sinh",
                value: total,
                icon: <IoIosPeople />,
              },
              { label: "Tổng số hồ sơ", value: hoSo, icon: <TiShoppingBag /> },
              {
                label: "Điểm danh hôm nay",
                value: diemDanh,
                icon: <FaRegCalendarCheck />,
              },
              { label: "Tổng số task", value: task, icon: <MdTask /> },
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
        <div className="bg-white rounded-xl shadow p-4 border border-[#ECECEE] col-span-2 lg:col-span-1">
        
          <div className="flex flex-col gap-3">
            <AttendanceChart />
          </div>
        </div>
      </div>)}
    </div>
  );
};

export default Dashboard;
