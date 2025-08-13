import { useState } from "react";
import axiosClient from "../service/axiosClient";
import Swal from "sweetalert2";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Lấy token & email từ URL nếu có
  const tokenFromUrl = searchParams.get("token") || "";
  const emailFromUrl = searchParams.get("email") || "";

  const [email, setEmail] = useState(emailFromUrl);
  const [token, setToken] = useState(tokenFromUrl);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    Swal.fire({
      title: "Đang cập nhật...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    try {
      const res = await axiosClient.post("/reset-password", {
        email,
        token,
        password,
        password_confirmation: confirmPassword
      });

      Swal.fire("Thành công!", res.data.message, "success");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      Swal.fire("Lỗi", err.response?.data?.message || "Cập nhật thất bại", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Đặt lại mật khẩu</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 w-full mb-3"
        required
      />

      <input
        type="text"
        placeholder="Mã xác nhận"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        className="border p-2 w-full mb-3"
        required
      />

      <input
        type="password"
        placeholder="Mật khẩu mới"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 w-full mb-3"
        required
      />

      <input
        type="password"
        placeholder="Xác nhận mật khẩu"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="border p-2 w-full mb-3"
        required
      />

      <button className="bg-green-500 text-white px-4 py-2 rounded w-full">
        Xác nhận
      </button>
    </form>
  );
}
