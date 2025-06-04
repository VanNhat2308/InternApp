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

 useEffect(() => {
  Promise.all([
    axiosClient.get('/sinhviens/diem-danh-hom-nay'),
    axiosClient.get('/hoso/counths'),
    axiosClient.get('/student/tasks/countTask'),
    axiosClient.get('/sinhviens/countSV'),
  ])
    .then(([studentsRes, hoSoRes, taskRes, totalRes]) => {
      setStudents(studentsRes.data);
      setHoSo(hoSoRes.data.total_hs);
      setTask(taskRes.data.total_task);
      setDiemDanh(studentsRes.data.length); // sửa length
      setTotal(totalRes.data.total_sv);
    })
    .catch(err => console.error(err));
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

  const statusStyle = (status) =>
    status === "co_mat"
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
                      {s.tenDangNhap}
                    </td>

                    <td>{s.viTri}</td>
                    <td>{s?.diem_danhs?.[0]?.gio_bat_dau
}</td>
                    <td>
                      <span
                        className={`px-2 py-1 rounded-sm text-xs font-medium ${statusStyle(
                          s?.diem_danhs?.[0]?.trang_thai

                        )}`}
                      >
                        {s?.diem_danhs?.[0]?.trang_thai
}
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
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold">Tổng quan điểm danh</h4>
            <select className="border rounded px-2 py-1 text-sm">
              <option>Tuần này</option>
              <option>Tuần trước</option>
            </select>
          </div>
          <div className="flex items-end gap-3">
            <AttendanceChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
