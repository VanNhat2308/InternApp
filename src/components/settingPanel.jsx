import { useEffect, useState } from "react";
import axiosClient from "../service/axiosClient";
import Swal from "sweetalert2";
import ChangePassword from "./ChangePassword";
function SettingPanel() {
  const [tab, setTab] = useState("admin");

  return (
    <div className="mt-10 lg:mt-5">
      <h1 className="text-2xl font-semibold mb-4 ml-2 lg:ml-0">Cài đặt hệ thống</h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 justify-center lg:justify-start">
        <button
          onClick={() => setTab("admin")}
          className={`cursor-pointer px-4 py-2 rounded-lg ${
            tab === "admin" ? "bg-blue-600 text-white" : "bg-gray-100"
          }`}
        >
          Cấp tài khoản Admin
        </button>
        <button
          onClick={() => setTab("history")}
          className={`cursor-pointer px-4 py-2 rounded-lg ${
            tab === "history" ? "bg-blue-600 text-white" : "bg-gray-100"
          }`}
        >
          Lịch sử đăng nhập
        </button>
        <button
          onClick={() => setTab("reset")}
          className={`cursor-pointer px-4 py-2 rounded-lg ${
            tab === "reset" ? "bg-blue-600 text-white" : "bg-gray-100"
          }`}
        >
          Thay đổi mật khẩu
        </button>
      </div>

      {/* Nội dung */}
      {tab === "admin" && <AdminAccountForm />}
      {tab === "history" && <LoginHistory />}
      {tab === "reset" && <ChangePassword />}
    </div>
  );
}

function AdminAccountForm() {
  const [form, setForm] = useState({
    hoTen: "",
    email: "",
    password: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });



const handleSubmit = async (e) => {
  e.preventDefault();
   // Validate
  if (!form.hoTen.trim()) {
    return Swal.fire({
      icon: "warning",
      title: "Họ tên không được để trống!",
    });
  }
  if (form.hoTen.length < 6) {
    return Swal.fire({
      icon: "warning",
      title: "Họ tên không được nhỏ hơn 6 ký tự!",
    });
  }

  if (!form.email.trim()) {
    return Swal.fire({
      icon: "warning",
      title: "Email không được để trống!",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(form.email)) {
    return Swal.fire({
      icon: "warning",
      title: "Email không hợp lệ!",
    });
  }

  if (!form.password.trim()) {
    return Swal.fire({
      icon: "warning",
      title: "Mật khẩu không được để trống!",
    });
  }

  if (form.password.length < 6) {
    return Swal.fire({
      icon: "warning",
      title: "Mật khẩu phải có ít nhất 6 ký tự!",
    });
  }
  try {
    const response = await axiosClient.post("/admin", form)
    .then(
    Swal.fire({
      icon: "success",
      title: "Tạo tài khoản admin thành công!",
      showConfirmButton: false,
      timer: 2000,
    }));
  } catch (error) {
    console.error("Lỗi khi tạo admin:", error);
    
    Swal.fire({
      icon: "error",
      title: "Tạo tài khoản admin thất bại!",
      text: error?.response?.data?.message || "Vui lòng kiểm tra lại thông tin.",
      confirmButtonText: "Đóng",
    });
  }
};


  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white">
      <div>
        <label className="block text-sm font-medium mb-1">Họ tên</label>
        <input
          type="text"
          name="hoTen"
          value={form.hoTen}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded p-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:shadow-md"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded p-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:shadow-md"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Mật khẩu</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          className="w-full border  border-gray-300 rounded p-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:shadow-md"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Tạo tài khoản
      </button>
    </form>
  );
}

function LoginHistory() {
  const [logs, setLogs] = useState([])
  useEffect(()=>{
    axiosClient.get('/LoginHistory')
    .then((res)=>{
      setLogs(res.data)
    }
    )
  },[])
  const loginLogs = [
    { id: 1, email: "admin1@example.com", time: "2025-07-20 14:23", ip: "192.168.1.10" },
    { id: 2, email: "admin2@example.com", time: "2025-07-19 09:12", ip: "192.168.1.12" },
  ];

  return (
    <div className="overflow-x-auto max-w-screen max-h-[500px] overflow-y-auto">
      <table className="min-w-[550px] w-full text-sm text-left text-gray-700 border">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border">STT</th>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">Thời gian</th>
            <th className="px-4 py-2 border">IP</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr key={log.id} className="border-t">
              <td className="px-4 py-2 border">{index + 1}</td>
              <td className="px-4 py-2 border">{log.email}</td>
              <td className="px-4 py-2 border">{log.login_at}</td>
              <td className="px-4 py-2 border">{log.ip_address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SettingPanel;
