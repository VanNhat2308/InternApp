import { useNavigate } from "react-router-dom";

function ChooseLogin() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-blue-600 mb-6">Chọn cách đăng nhập</h2>

        <button
          onClick={() => navigate("/login-admin")}
          className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl mb-4 transition-all"
        >
          Đăng nhập với Admin
        </button>

        <button
          onClick={() => navigate("/login-sinhvien")}
          className="w-full py-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl transition-all"
        >
          Đăng nhập với Sinh viên
        </button>
      </div>
    </div>
  );
}

export default ChooseLogin;
