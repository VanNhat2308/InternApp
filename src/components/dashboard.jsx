import React, { useContext, useEffect, useState } from "react";
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
import { useUser } from "../context/userContext";
import { Link } from "react-router-dom";
import { useAdminDashboardData } from "../hooks/useAdminDashboardData";
import Avatar from "react-avatar";

const Dashboard = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1025);
  const { data, isLoading, isError } = useAdminDashboardData();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1025);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function getTrangThaiTiengViet(status) {
    switch (status) {
      case "on_time":
        return "Đúng giờ";
      case "late":
        return "Đi trễ";
      case "absent":
        return "Vắng";
      default:
        return "Không xác định";
    }
  }

  const statusStyle = (status) =>
    status === "on_time"
      ? "text-green-600 bg-green-100"
      : "text-red-600 bg-red-100";

  const { User } = useUser();
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
  return (
    <div className="flex-1 space-y-6">
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
                  label: "Tổng thực tập sinh",
                  value: data.totalSV,
                  icon: <IoIosPeople />,
                },
                {
                  label: "Tổng số hồ sơ",
                  value: data.hoSo,
                  icon: <TiShoppingBag />,
                },
                {
                  label: "Điểm danh hôm nay",
                  value: data.totalDiemDanh,
                  icon: <FaRegCalendarCheck />,
                },
                { label: "Tổng số task", value: data.task, icon: <MdTask /> },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-white rounded-md border border-[#ECECEE]"
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
            <div className="w-full overflow-x-auto bg-white rounded-md p-4 mt-5 lg:mt-10 border border-[#ECECEE]">
              <div className="flex justify-between mb-4">
                <h4 className="font-semibold text-lg">Tổng quan điểm danh</h4>
                <Link
                  to={"/admin/attendance"}
                  className="text-blue-600 text-sm"
                >
                  Xem Tất Cả
                </Link>
              </div>
              <table className="w-full min-w-[550px] text-sm">
                <thead className="text-left text-gray-500 border-b border-b-gray-300">
                  <tr>
                    <th className="py-2">Tên sinh viên</th>
                    <th>Vị trí</th>
                    <th>Thời gian</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {data.students.map((s, idx) => (
                    <tr key={idx} className="border-b border-b-gray-300">
                    <td className="py-2">
  <div className="flex items-center gap-2">
    <Avatar name={s.sinh_vien.hoTen} round size="32" />
    <div className="flex flex-col">
      <span className="font-medium">{s.sinh_vien.hoTen}</span>
      <span className="text-sm text-gray-500">{s.sinh_vien.email}</span>
    </div>
  </div>
</td>


                      <td>{s.sinh_vien.viTri}</td>
                      <td>{s?.gio_bat_dau}</td>
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
          <div className="bg-white rounded-md p-4 border border-[#ECECEE] col-span-2 lg:col-span-1">
            <div className="flex flex-col gap-3">
              <AttendanceChart />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
