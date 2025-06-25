import { BiQrScan } from "react-icons/bi";
import { FaCamera } from "react-icons/fa";
import { FaFileArrowUp } from "react-icons/fa6";
import { Link, Links } from "react-router-dom";

function Register() {
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
             <div className="flex flex-col items-center justify-center gap-8 px-4 py-10">
             
           
               {/* Cột phải - form đăng nhập */}
               <div
                 style={{ background: 'rgba(238, 238, 238, 0.6)' }}
                 className="relative z-10 w-full lg:max-w-[60vw] mx-auto lg:h-[80%] flex flex-col rounded-3xl shadow-xl p-6 sm:p-8 md:p-10 lg:p-[50px]"
               >
                 <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 ">Đăng ký thực tập</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* Họ tên */}
  <div className="flex flex-col gap-1">
    <label className="font-semibold">Họ tên</label>
    <input className="bg-white rounded-md p-2" type="text" placeholder="Nhập họ tên" />
  </div>

  {/* Số điện thoại */}
  <div className="flex flex-col gap-1">
    <label className="font-semibold">Số điện thoại</label>
    <input className="bg-white rounded-md p-2" type="text" placeholder="Số điện thoại" />
  </div>

  {/* Email */}
  <div className="flex flex-col gap-1">
    <label className="font-semibold">Email</label>
    <input className="bg-white rounded-md p-2" type="email" placeholder="Nhập Email" />
  </div>

  {/* Tên Trường */}
  <div className="flex flex-col gap-1">
    <label className="font-semibold">Tên Trường</label>
    <input className="bg-white rounded-md p-2" type="text" placeholder="Nhập tên trường" />
  </div>

  {/* Ngày sinh */}
  <div className="flex flex-col gap-1">
    <label className="font-semibold">Ngày sinh</label>
    <input className="bg-white rounded-md p-2" type="date" />
  </div>

  {/* Tên Ngành */}
  <div className="flex flex-col gap-1">
    <label className="font-semibold">Tên Ngành</label>
    <input className="bg-white rounded-md p-2" type="text" placeholder="Nhập tên ngành" />
  </div>

  {/* Công ty thực tập */}
  <div className="flex flex-col gap-1">
    <label className="font-semibold">Công ty thực tập</label>
    <input className="bg-white rounded-md p-2" type="text" placeholder="Công ty thực tập" />
  </div>

  {/* Địa chỉ */}
  <div className="flex flex-col gap-1">
    <label className="font-semibold">Địa chỉ</label>
    <input className="bg-white rounded-md p-2" type="text" placeholder="Nhập địa chỉ" />
  </div>

  {/* Mã sinh viên */}
  <div className="flex flex-col gap-1">
    <label className="font-semibold">Mã sinh viên</label>
    <input className="bg-white rounded-md p-2" type="text" placeholder="Mã sinh viên" />
  </div>

  {/* Giới tính */}
  <div className="flex flex-col gap-1">
    <label className="font-semibold">Giới tính</label>
    <div className="flex gap-4 items-center p-2">
      <label className="flex items-center gap-1">
        <input type="radio" name="gender" value="Nam" defaultChecked />
        Nam
      </label>
      <label className="flex items-center gap-1">
        <input type="radio" name="gender" value="Nữ" />
        Nữ
      </label>
    </div>
  </div>

  {/* Vị trí thực tập */}
  <div className="flex flex-col gap-1">
    <label className="font-semibold">Vị trí thực tập</label>
    <input className="bg-white rounded-md p-2" type="text" placeholder="Vị trí thực tập" />
  </div>

  {/* Thời gian thực tập */}
  <div className="flex flex-col gap-1">
    <label className="font-semibold">Thời gian thực tập</label>
    <input className="bg-white rounded-md p-2" type="text" placeholder="Nhập thời gian thực tập" />
  </div>

  {/* Tên đăng nhập */}
  <div className="flex flex-col gap-1">
    <label className="font-semibold">Tên đăng nhập</label>
    <input className="bg-white rounded-md p-2" type="text" placeholder="Nhập tên đăng nhập" />
  </div>

  {/* Tên giảng viên hướng dẫn */}
  <div className="flex flex-col gap-1">
    <label className="font-semibold">Tên giảng viên hướng dẫn</label>
    <input className="bg-white rounded-md p-2" type="text" placeholder="Nhập tên giảng viên hướng dẫn" />
  </div>

  {/* Mật khẩu */}
  <div className="flex flex-col gap-1">
    <label className="font-semibold">Mật khẩu</label>
    <input className="bg-white rounded-md p-2" type="password" placeholder="Nhập mật khẩu" />
  </div>

  {/* Số điện thoại giảng viên */}
  <div className="flex flex-col gap-1">
    <label className="font-semibold">Số điện thoại giảng viên</label>
    <input className="bg-white rounded-md p-2" type="text" placeholder="Nhập số điện thoại" />
  </div>

  {/* CV sinh viên */}
   <div className="flex flex-row items-center gap-2">
  <label className="mb-1 font-semibold">CV của sinh viên: </label>
  
  <label
    htmlFor="faceData"
    className="cursor-pointer"
  >
    <FaFileArrowUp  className="text-green-600" />
  </label>

  <input
    id="faceData"
    type="file"
    accept="image/*"
    className="hidden"
  />
</div>

  {/* Dữ liệu khuôn mặt */}
 <div className="flex flex-row items-center gap-2">
  <label className="mb-1 font-semibold">Dữ liệu khuôn mặt: </label>
  
  <label
    htmlFor="faceData"
    className="cursor-pointer"
  >
    <BiQrScan className="text-green-600" />
  </label>

  <input
    id="faceData"
    type="file"
    accept="image/*"
    className="hidden"
  />
</div>
     <div className="col-span-2 flex flex-col items-center justify-center gap-2">
                <button className="px-20  bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md">
  ĐĂNG KÝ
</button>
<div>
    <span className="text-gray-700 font-semibold">Đã có tài khoản ?</span>
    <Link to={'/login-sinhvien'} className='text-blue-500'> Đăng nhập</Link>
</div>

               </div>
</div>

              
              
           
               
                  
               </div>
          
               
             </div>
           </div>
     );
}

export default Register;