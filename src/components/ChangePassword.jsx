import { useState } from "react";
import Swal from "sweetalert2";
import axiosClient from "../service/axiosClient";

export default function ChangePassword() {
  const [form, setForm] = useState({
    current_password: "",
    user_id: localStorage.getItem("maSV")
      ? localStorage.getItem("maSV")
      : localStorage.getItem("maAdmin"),
    role: localStorage.getItem("maSV") ? "sinhvien" : "admin",
    new_password: "",
    new_password_confirmation: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    Swal.fire({
      title: "Đang xử lý...",
      text: "Vui lòng chờ",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      await axiosClient.post("/change-password", form);
      Swal.fire("Thành công", "Mật khẩu đã được thay đổi!", "success");
      setForm({
        user_id: localStorage.getItem("maSV")
          ? localStorage.getItem("maSV")
          : localStorage.getItem("maAdmin"),
        role: localStorage.getItem("maSV") ? "sinhvien" : "admin",
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
      });
    } catch (err) {
      Swal.fire("Lỗi", err?.response?.data?.message || err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 mt-5 rounded-md">

      <div className="mb-4">
        <label className="block mb-1">Mật khẩu hiện tại</label>
        <input
          type="password"
          name="current_password"
          value={form.current_password}
          onChange={handleChange}
          className="w-full border border-gray-400 focus:outline-1 focus:outline-blue-400 p-2 rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Mật khẩu mới</label>
        <input
          type="password"
          name="new_password"
          value={form.new_password}
          onChange={handleChange}
          className="w-full border border-gray-400 focus:outline-1 focus:outline-blue-400 p-2 rounded"
          minLength={8}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Nhập lại mật khẩu mới</label>
        <input
          type="password"
          name="new_password_confirmation"
          value={form.new_password_confirmation}
          onChange={handleChange}
          className="w-full border border-gray-400 focus:outline-1 focus:outline-blue-400 p-2 rounded"
          minLength={8}
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        Đổi mật khẩu
      </button>
    </form>
  );
}
