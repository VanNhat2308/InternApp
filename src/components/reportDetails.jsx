import { BsDownload, BsFillPeopleFill } from "react-icons/bs";
import { useDialog } from "../context/dialogContext";
import { useToast } from "../context/toastContext";
import Toast from "./toast";
import { MdOutlineDone, MdOutlineEmail } from "react-icons/md";
import { IoIosPrint } from "react-icons/io";
import avatar from '../assets/images/avatar.png'
import { RiShoppingBag3Line } from "react-icons/ri";
import { HiOutlineDocumentText } from "react-icons/hi2";
import PaginatedContent from "./pagenatedContent";
import { FiDownload } from "react-icons/fi";


function ReportDetails() {
    
        const { showDialog } = useDialog();
          const {isToast,setToast,isToastV2,setToastV2} = useToast();

 const longText = `
Trong suốt 12 tuần thực tập tại công ty với vai trò Thực tập sinh Graphic Designer, tôi đã có cơ hội tham gia trực tiếp vào một dự án thực tế có tính ứng dụng cao – đó là thiết kế giao diện người dùng (UI) cho hệ thống web app và mobile app quản lý thực tập sinh.
Đây là một trải nghiệm quý giá, giúp tôi vận dụng những kiến thức được học ở trường và tiếp thu thêm nhiều kỹ năng thực tế trong môi trường làm việc chuyên nghiệp.
Tuần 1, tôi được giới thiệu tổng quan về công ty, dự án và bộ công cụ sẽ sử dụng trong suốt kỳ thực tập như Figma, Trello, Google Drive và các tiêu chuẩn thiết kế UI/UX.
Tôi đã tìm hiểu về thiết kế hệ thống (design system), nguyên tắc phối màu, typography, grid layout, cũng như được làm quen với quy trình nhận – xử lý – phản hồi task thông qua phần mềm quản lý công việc...
`;

 

     const handleOpenDialog = () => {
              showDialog({
                title: "Báo Cáo Thực Tập",
                customContent:(<>
                  <div className="flex items-center">
                <span className="text-xl font-semibold min-w-[150px]">Ngày</span>
                <span className="text-xl">05/05/2025</span>
            </div>
            <div className="flex items-center mt-2">
                <span className="text-xl font-semibold min-w-[150px]">Công việc</span>
                <span className="text-xl">Thiết giao diện ứng dụng quản lý thực tập sinh</span>
            </div>
            <div className="flex mt-2 max-h-[60vh] overflow-y-scroll">
                <span className="text-xl font-semibold min-w-[150px]">Nội dung</span>
               <PaginatedContent text={longText} maxCharsPerPage={500} />
            </div>
                
                </>),
                confirmPrintText: "1",
               
                onPrint: () => {
                 setToast(true)
                },
                onDownload: () => {
                 setToastV2(true)
                },
              });
            };
    return ( 
            <>
                    { isToast?
                      <Toast onClose={() => setToast(false)}>
                      <div className="flex items-center gap-3">
                          <div className="w-15 aspect-square rounded-full border-2 border-green-400 flex items-center justify-center">
                            <MdOutlineDone  className="text-2xl text-green-400"/>
                          </div>
                          <p>Báo cáo đã được in thành công !!</p>
                
                
                
                      </div>
                    </Toast>:""
                    }
                    { isToastV2?
                      <Toast onClose={() => setToastV2(false)}>
                      <div className="flex items-center gap-3">
                          <div className="w-15 aspect-square rounded-full border-2 border-green-400 flex items-center justify-center">
                            <FiDownload  className="text-2xl text-green-400"/>
                          </div>
                          <p>Tải về báo cáo thành công!</p>
                
                
                
                      </div>
                    </Toast>:""
                    }
        
                
                <div className="border border-gray-300 p-4 mt-10 rounded-md shadow">
                    <div className="flex flex-col items-center pb-5 border-b border-gray-300 lg:flex-row lg:justify-between">
                      {/* avartar */}
                      <div className="flex gap-2 ">
                        <img
                          src={avatar}
                          alt="avartar"
                          className="w-20 aspect-square rounded-md border border-gray-300"
                        />
                        <div>
                          <h1 className="text-xl font-bold">PHAM VAN A</h1>
                          <h4
                            className="flex
                        items-center gap-1 text-lg text-gray-600"
                          >
                            <RiShoppingBag3Line className="text-2xl" /> Graphic Designer
                          </h4>
                          <h4
                            className="flex
                        items-center gap-1 text-lg text-gray-600"
                          >
                            <MdOutlineEmail className="text-2xl" />
                            phamvana123@gmail.com
                          </h4>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                        onClick={handleOpenDialog}
                        className="cursor-pointer p-3 flex items-center gap-2 bg-[#34A853] rounded-md text-white">
                         <IoIosPrint className="text-xl" />
                         In
                        </button>
                      </div>
                    </div>
                    {/* main ct */}
                    <div>
                        <h1 className="my-4 text-2xl font-bold">Báo Cáo Thực Tập</h1>
          <div>
            <div className="flex items-center">
                <span className="text-xl font-semibold min-w-[150px]">Ngày</span>
                <span className="text-xl">05/05/2025</span>
            </div>
            <div className="flex items-center mt-2">
                <span className="text-xl font-semibold min-w-[150px]">Công việc</span>
                <span className="text-xl">Thiết giao diện ứng dụng quản lý thực tập sinh</span>
            </div>
            <div className="flex mt-2">
                <span className="text-xl font-semibold min-w-[150px]">Nội dung</span>
               <PaginatedContent text={longText} maxCharsPerPage={500} />
            </div>
           
          </div>

      <div className="pt-4 pb-10 border-b border-gray-300">
        <p className="font-medium text-gray-600 mb-2">Tệp tin đính kèm</p>
        <div className="flex max-w-xl items-center gap-3 bg-gray-50 px-4 py-3 rounded-lg border border-gray-300">
          <HiOutlineDocumentText className="text-red-500 text-2xl" />
          <div className="flex-1">
            <p className="font-medium text-sm">File.pdf</p>
            <p className="text-xs text-gray-500">120 KB</p>
          </div>
          <button className="text-xl text-gray-600 cursor-pointer">
            <BsDownload/>
          </button>
        </div>
      </div>
      <div>
        <h1 className="text-xl font-bold mt-7">Nhận xét</h1>
        <textarea className="rounded-xl my-4 p-3 w-full border border-gray-300" name="comment" rows="5" placeholder="Nhập nhận xét..."></textarea>
   <div className="flex justify-end"><button className="cursor-pointer px-4 py-2 bg-green-600 text-white rounded-md">Gửi Cho Sinh Viên</button></div>
      </div>




                    </div>
                  
                  </div> 
                  </>
     );
}

export default ReportDetails;