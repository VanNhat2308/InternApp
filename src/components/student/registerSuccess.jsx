import { FaCheck } from "react-icons/fa";
import { Link } from "react-router-dom";

function RegisterSuccess() {
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
                     <div className="flex flex-col items-center justify-center px-4 py-10">
                     
                   
                       {/* Cột phải - form đăng nhập */}
                       <div
                         style={{ background: 'rgba(238, 238, 238, 0.6)' }}
                         className="relative z-10 w-full lg:max-w-[50vw] mx-auto lg:h-[80%] flex flex-col items-center gap-4 rounded-3xl shadow-xl p-6 sm:p-8 md:p-10 lg:p-[50px]"
                       >
                        <div className="flex justify-center items-center w-50 h-50 rounded-full bg-[#34A853] text-white">
                           <FaCheck className="text-7xl"/>
                        </div>
                         <h2 className="text-xl sm:text-3xl font-bold text-center">Đăng ký thực tập</h2>
                         <p className="text-lg ">Đơn đăng ký thực tập của bạn đang chờ xét duyệt</p>

                         <Link to={'/login-sinhvien'} className="text-white bg-[#34A853] px-20 py-2 rounded-md mt-6">ĐĂNG NHẬP</Link>

                         <p>Chưa có tài khoản? 
                            <Link to={'/register'} className="text-blue-600 ml-1">
                            Đăng ký
                            </Link>
                         </p>
                 
                      
                      
                   
                       
                          
                       </div>
                  
                       
                     </div>
                   </div>
     );
}

export default RegisterSuccess;