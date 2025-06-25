// src/pages/Login.jsx
import { useEffect, useState } from 'react'
import pizitechLogo from '../assets/images/pizitech.png'; 
import manImage from '../assets/images/man.png';
import axiosClient from '../service/axiosClient';
import { useNavigate } from 'react-router-dom';
import { BsEyeFill, BsEyeSlash } from 'react-icons/bs';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isShowPass,setIsShowPass] = useState(false)
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();


    try {
      const res = await axiosClient.post('/login/admin', { email, password });

      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', 'admin');
        localStorage.setItem('user',res.data.user.hoTen)

        
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
const handleShowPw = () => {
  setIsShowPass((prev) => !prev);
};

  return (
    <div
  className="w-full min-h-screen overflow-clip relative"
  style={{
    background: 'linear-gradient(296.58deg, #34A853 0.36%, #5FA471 33.41%, #FFFFFF 100%)',
  }}
>
  {/* Các hình tròn background */}
  <div
    style={{ background: 'rgba(52, 168, 83, 0.3)' }}
    className="absolute top-0 left-0 transform -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] md:w-[300px] md:h-[300px] rounded-full"
  ></div>

  <div
    style={{ background: 'rgba(52, 168, 83, 0.3)' }}
    className="absolute top-0 left-0 transform -translate-y-[75%] w-[200px] h-[200px] md:w-[300px] md:h-[300px] rounded-full"
  ></div>

  <div
    className="absolute bottom-0 right-0 w-[200px] h-[200px] md:w-[300px] md:h-[300px] rounded-full transform translate-y-[75%]"
    style={{ background: 'rgba(255,255,255,0.3)' }}
  ></div>

  <div
    className="absolute bottom-0 right-0 w-[200px] h-[200px] md:w-[300px] md:h-[300px] rounded-full transform translate-x-[50%] translate-y-[25%]"
    style={{ background: 'rgba(255,255,255,0.3)' }}
  ></div>

  {/* Nội dung chính */}
  <div className="flex flex-col lg:flex-row items-center justify-center gap-8 px-4 py-10">
    {/* Cột trái */}
    <div className="hidden lg:flex flex-col items-center lg:w-[55%] xl:w-[50%] min-w-[320px]">
      <img className="max-w-[160px] mr-20" src={pizitechLogo} alt="Pizitech" />
      <div className="relative">
        <img className="max-w-[416px] w-full" src={manImage} alt="man" />
        <div
          style={{ background: 'rgba(52, 168, 83, 0.3)' }}
          className="absolute top-0 left-0 z-[-1] rounded-full w-full aspect-square"
        ></div>
      </div>
      <div className="bg-black w-full h-[1px] mt-4"></div>
    </div>

    {/* Cột phải - form đăng nhập */}
    <div
      style={{ background: 'rgba(238, 238, 238, 0.6)' }}
      className="relative z-10 w-full max-w-[400px] mx-auto lg:h-[80%] flex flex-col rounded-3xl shadow-xl p-6 sm:p-8 md:p-10 lg:p-[50px] min-w-[280px]"
    >
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">Đăng nhập vào Pizitech</h2>
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
          {isShowPass ? (
            <div className="relative">
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="text"
              placeholder="Nhập mật khẩu"
              className="w-full px-4 py-2 bg-white border-none rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <span onClick={handleShowPw} className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500">
             <BsEyeSlash/>
            </span>
          </div>
          ):(<div className="relative">
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Nhập mật khẩu"
              className="w-full px-4 py-2 bg-white border-none rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <span onClick={handleShowPw} className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500">
             <BsEyeFill/>
            </span>
          </div>)}
        </div>
        {/* Quên mật khẩu */}
        <div className="text-right text-sm mb-10">
          <a href="#" className="text-black font-semibold">
            Quên mật khẩu
          </a>
        </div>
        {/* Nút đăng nhập */}
        <button
          type="submit"
          className="cursor-pointer w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition"
        >
          ĐĂNG NHẬP
        </button>
      </form>

    </div>
  </div>
</div>

  )
}
