import { useState } from "react";
import axiosClient from "../service/axiosClient";
import Swal from "sweetalert2";

export default function ForgotAndResetPassword() {
  const [step, setStep] = useState(1); // 1: Nhập email, 2: Xác nhận OTP, 3: Đặt lại mật khẩu
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  // Gửi OTP
const sendOtp = async () => {
  Swal.fire({
    title: "Đang gửi OTP...",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });

  try {
    await axiosClient.post("/forgot-password", { email });

    Swal.fire("Thành công", "Mã OTP đã được gửi về email!", "success");
    setStep(2);
  } catch (err) {
    Swal.fire("Lỗi", err?.response?.data?.message || err.message, "error");
  }
};


  // Xác thực OTP
  const verifyOtp = async () => {
    try {
      await axiosClient.post("/verify-otp", { email, otp });
      Swal.fire("Thành công", "Xác thực OTP thành công!", "success");
      setStep(3);
    } catch (err) {
      Swal.fire("Lỗi", err?.response?.data?.message || err.message, "error");
    }
  };

  // Reset password
  const resetPassword = async () => {
    if (password !== passwordConfirm) {
      Swal.fire("Lỗi", "Mật khẩu xác nhận không khớp", "error");
      return;
    }
    try {
      await axiosClient.post("/reset-password", { email, otp, password });
      Swal.fire("Thành công", "Mật khẩu đã được thay đổi!", "success");
      setStep(1);
      setEmail("");
      setOtp("");
      setPassword("");
      setPasswordConfirm("");
    } catch (err) {
      Swal.fire("Lỗi", err?.response?.data?.message || err.message, "error");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto mt-[20vh] bg-white shadow rounded">
     {/* Step Indicator */}
<div className="flex items-center justify-between mb-6 relative">
  {[1, 2, 3].map((s, index) => (
    <div key={s} className={`${s!=3?'flex-1':''} flex items-center`}>
      {/* Circle */}
      <div
        className={`flex items-center justify-center w-7 h-7 rounded-full font-bold text-white 
          ${step >= s ? "bg-blue-500" : "bg-gray-300"}
        `}
      >
        {s}
      </div>

      {/* Line except last */}
      {index < 2 && (
        <div
          className={`flex-1 h-1 
            ${step > s ? "bg-blue-500" : "bg-gray-300"}
          `}
        ></div>
      )}
    </div>
  ))}
</div>


      {step === 1 && (
        <>
          <h2 className="text-xl font-bold mb-4 text-center">Quên mật khẩu</h2>
          <label className="block mb-2 font-medium">Email</label>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-400 p-2 flex-1 rounded focus:outline-1 focus:outline-blue-400"
              required
            />
            <button
              onClick={sendOtp}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded"
            >
              Gửi mã
            </button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <h2 className="text-xl font-bold mb-4 text-center">Xác nhận OTP</h2>
          <input
            type="text"
            placeholder="Nhập mã OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="border border-gray-400 p-2 w-full rounded mb-3 focus:outline-1 focus:outline-green-400"
          />
          <button
            onClick={verifyOtp}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded w-full"
          >
            Xác nhận
          </button>
        </>
      )}

      {step === 3 && (
        <>
          <h2 className="text-xl font-bold mb-4 text-center">Đặt lại mật khẩu</h2>
          <input
            type="password"
            placeholder="Mật khẩu mới"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 w-full rounded mb-3"
          />
          <input
            type="password"
            placeholder="Xác nhận mật khẩu"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            className="border p-2 w-full rounded mb-3"
          />
          <button
            onClick={resetPassword}
            className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded w-full"
          >
            Đặt lại mật khẩu
          </button>
        </>
      )}
    </div>
  );
}
