import { useState } from "react";

function SettingPanel() {
  const [tab, setTab] = useState("admin");

  return (
    <div className="mt-5">
      <h1 className="text-2xl font-semibold mb-4">Cài đặt hệ thống</h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
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
      </div>

      {/* Nội dung */}
      {tab === "admin" && <AdminAccountForm />}
      {tab === "history" && <LoginHistory />}
    </div>
  );
}

function AdminAccountForm() {
  const [form, setForm] = useState({
    hoTen: "",
    email: "",
    matKhau: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Tạo tài khoản admin:", form);
    // Gửi dữ liệu đến backend ở đây
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
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
          name="matKhau"
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
  const loginLogs = [
    { id: 1, email: "admin1@example.com", time: "2025-07-20 14:23", ip: "192.168.1.10" },
    { id: 2, email: "admin2@example.com", time: "2025-07-19 09:12", ip: "192.168.1.12" },
  ];

  return (
    <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
      <table className="min-w-full text-sm text-left text-gray-700 border">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border">STT</th>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">Thời gian</th>
            <th className="px-4 py-2 border">IP</th>
          </tr>
        </thead>
        <tbody>
          {loginLogs.map((log, index) => (
            <tr key={log.id} className="border-t">
              <td className="px-4 py-2 border">{index + 1}</td>
              <td className="px-4 py-2 border">{log.email}</td>
              <td className="px-4 py-2 border">{log.time}</td>
              <td className="px-4 py-2 border">{log.ip}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SettingPanel;
