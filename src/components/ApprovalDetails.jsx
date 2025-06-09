import { MdOutlineDone, MdOutlineEmail } from "react-icons/md";
import { RiShoppingBag3Line } from "react-icons/ri";
import avatar from '../assets/images/avatar.png'
import { MdOutlineCancel } from "react-icons/md";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { useDialog } from "../context/dialogContext";
import { BsFillPeopleFill } from "react-icons/bs";
import { useToast } from "../context/toastContext";
import Toast from "./toast";
function ApprovalDetails() {

    const { showDialog } = useDialog();
      const {isToast,setToast} = useToast()
 const handleOpenDialog = () => {
          showDialog({
            title: "Duyệt hồ sơ sinh viên",
            content: "Sau khi đồng ý duyệt hồ sơ sinh viên sẽ được duyệt. Hãy kiểm tra kỹ trước khi ấn",
            icon: <BsFillPeopleFill />,
            confirmText: "Có, duyệt hồ sơ",
            cancelText: "Không, tôi muốn kiểm tra lại",
            onConfirm: () => {
             setToast(true)
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
                  <p>Hồ sơ sinh viên đã được duyệt !</p>
        
        
        
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
                 className="cursor-pointer p-3 flex items-center gap-2 border border-gray-300 rounded-md">
                 <MdOutlineCancel className="text-xl" />
                  Từ chối
                </button>
                <button
                onClick={handleOpenDialog}
                className="cursor-pointer p-3 flex items-center gap-2 bg-[#34A853] rounded-md text-white">
                 <MdOutlineDone className="text-xl" />
                 Duyệt
                </button>
              </div>
            </div>
            {/* main ct */}
            <div>

             
                <div className="grid grid-cols-2 gap-6 text-sm flex-1">
                  <div className="p-2 border-b border-gray-300">
                    <p className="text-gray-400">Họ Tên</p>
                    <p className="font-medium text-lg">Phạm Văn A</p>
                  </div>
    
                  <div className="p-2 border-b border-gray-300">
                    <p className="text-gray-400">Thời Gian Thực Tập</p>
                    <p className="font-medium text-lg">3 tháng</p>
                  </div>
    
                  <div className="p-2 border-b border-gray-300">
                    <p className="text-gray-400">Mã Số Sinh Viên</p>
                    <p className="font-medium text-lg">2174802010284</p>
                  </div>
    
                  <div className="p-2 border-b border-gray-300">
                    <p className="text-gray-400">Giáo Viên Hướng Dẫn</p>
                    <p className="font-medium text-lg">Lý Thị Huyền Châu</p>
                  </div>
    
                  <div className="p-2 border-b border-gray-300">
                    <p className="text-gray-400">Trường Đại Học</p>
                    <p className="font-medium text-lg">VanLang University</p>
                  </div>
    
                  <div className="p-2 border-b border-gray-300">
                    <p className="text-gray-400">Ngày Sinh</p>
                    <p className="font-medium text-lg">01/01/2003</p>
                  </div>
    
                  <div className="p-2 border-b border-gray-300">
                    <p className="text-gray-400">Chuyên Ngành</p>
                    <p className="font-medium text-lg">Công nghệ phần mềm</p>
                  </div>
    
                  <div className="p-2 border-b border-gray-300">
                    <p className="text-gray-400">Vị Trí Ứng Tuyển</p>
                    <p className="font-medium text-lg">Graphic Designer</p>
                  </div>
    
                  <div className="p-2 border-b border-gray-300">
                    <p className="text-gray-400">Trạng Thái</p>
                    <p className="font-medium text-lg text-green-500">Đang Thực Tập</p>
                  </div>
                </div>
                <div className="mt-7">
                    <h2 className="text-lg font-semibold">CV Của Ứng Viên</h2>
                    {/* cv here */}
                </div>
            
            </div>
          </div> 
          </>
          );
}

export default ApprovalDetails;