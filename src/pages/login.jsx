// src/pages/Login.jsx
import { useEffect, useState } from 'react'
import pizitechLogo from '../assets/images/pizitech.png'; // cập nhật đường dẫn phù hợp
import manImage from '../assets/images/man.png';
import axiosClient from '../service/axiosClient';
import { useNavigate } from 'react-router-dom';
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Nếu đã có token, chuyển hướng về dashboard
      navigate('/admin/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();


    try {
      const res = await axiosClient.post('/login', { email, password });

      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        alert('Đăng nhập thành công!');

        navigate('/admin/dashboard');
      } else {
        throw new Error('Không nhận được token từ server');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra email và mật khẩu.';
      setError(errorMessage);
      alert(errorMessage);
    }
  };

  return (
    <div
      className="w-full h-screen overflow-clip relative"
      style={{
        background: 'linear-gradient(296.58deg, #34A853 0.36%, #5FA471 33.41%, #FFFFFF 100%)',
      }}
    >
      {/* Các hình tròn background */}
      <div
        style={{ background: 'rgba(52, 168, 83, 0.3)' }}
        className="absolute top-0 left-0 transform -translate-x-1/2 -translate-y-1/2 w-50 h-50 rounded-full"
      ></div>

      <div
        style={{ background: 'rgba(52, 168, 83, 0.3)' }}
        className="absolute top-0 left-0 transform -translate-y-[75%] w-50 h-50 rounded-full"
      ></div>

      <div
        className="absolute bottom-0 right-0 w-50 h-50 rounded-full transform -translate-y-[-75%]"
        style={{ background: 'rgba(255,255,255,0.3)' }}
      ></div>

      <div
        className="absolute bottom-0 right-0 w-50 h-50 rounded-full transform -translate-x-[-50%] -translate-y-[-25%]"
        style={{ background: 'rgba(255,255,255,0.3)' }}
      ></div>

      {/* Nội dung chính */}
      <div className="flex items-center justify-center h-[80%] gap-8 flex-wrap px-4">
        {/* Cột trái */}
        <div className="flex flex-col items-center w-[55%] min-w-[320px]">
          <img className="max-w-[160px] mr-20" src={pizitechLogo} alt="Pizitech" />
          <div className="relative">
            <img className="max-w-[416px]" src={manImage} alt="man" />
            <div
              style={{ background: 'rgba(52, 168, 83, 0.3)' }}
              className="absolute top-0 left-0 z-[-1] rounded-full w-full aspect-square"
            ></div>
          </div>
          <div className="bg-black w-full h-[1px] mt-4"></div>
        </div>

        {/* Cột phải - form đăng nhập */}
        <div style={{ background: 'rgba(238, 238, 238, 0.6)', padding: '50px' }} className="h-[80%] flex flex-col  rounded-3xl shadow-xl lg:w-[35%] min-w-[320px]">
          <h2 className="text-3xl font-bold text-center mb-8">Đăng nhập vào Pizitech</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <form onSubmit={handleLogin}>
            {/* Tên đăng nhập */}
            <div className="mb-4">
              <label className="block font-semibold mb-1">Tên đăng nhập</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="text"
                placeholder="Nhập tên đăng nhập"
                className="w-full bg-white px-4 py-2 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            {/* Mật khẩu */}
            <div className="mb-2">
              <label className="block font-semibold mb-1">Mật khẩu</label>
              <div className="relative">
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Nhập mật khẩu"
                  className="w-full px-4 py-2 bg-white border-none rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500">
                  👁️
                </span>
              </div>
            </div>
            {/* Quên mật khẩu */}
            <div className="text-right text-sm mb-10">
              <a href="#" className="text-black font-semibold">
                Quên mật khẩu
              </a>
            </div>
            {/* Nút đăng nhập */}
            <button
              type='submit'
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition">
              ĐĂNG NHẬP
            </button>
          </form>

          {/* Đăng ký */}
          <p className="text-center text-sm mt-4">
            Chưa có tài khoản ?{' '}
            <a href="#" className="text-blue-600 font-medium">
              Đăng Ký
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
