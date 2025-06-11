import { LuShoppingBag } from "react-icons/lu";
import { FiSearch } from "react-icons/fi";
import { GoPlusCircle } from "react-icons/go";
import { AiOutlineMessage } from "react-icons/ai";
import { TfiTimer } from "react-icons/tfi";
import { FaFlag } from "react-icons/fa";
import { FaRegCalendarAlt } from "react-icons/fa";
import taskAva from '../assets/images/taskAvatar.jpg'
import { useDialog } from "../context/dialogContext";
import { useToast } from "../context/toastContext";
import TaskForm from "./taskForm";
import Toast from "./toast";
import { MdOutlineDone } from "react-icons/md";
import { BsListTask } from "react-icons/bs";
import TaskCard from "./taskCard";
function TaskPanel() {
    const { showDialog,hideDialog } = useDialog()
    const {isToast,setToast} = useToast()
    const tasks = [
  {
    id: 1,
    status: "Chưa nộp",
    statusColor: "#FCBE12",
    title: "Làm báo cáo lần 2",
    commentCount: 2,
    tagBg: "#FCBE12",
    tagText: "Chưa nộp",
    priority: "Cao",
    date: "18 April",
    avatars: [taskAva, taskAva, taskAva],
  },
  {
    id: 2,
    status: "Nộp trễ",
    statusColor: "#f87171",
    title: "Làm báo cáo lần 2",
    commentCount: 2,
    tagBg: "#fb2c36",
    tagText: "Nộp trễ",
    priority: "Cao",
    date: "18 April",
    avatars: [taskAva, taskAva, taskAva],
  },
  {
    id: 3,
    status: "Đã nộp",
    statusColor: "#4ade80",
    title: "Làm báo cáo lần 2",
    commentCount: 2,
    tagBg: "#f3f4f6",
    tagText: "xong",
    tagTextColor: "text-green-400 font-semibold",
    priority: "Cao",
    date: "18 April",
    avatars: [taskAva, taskAva, taskAva],
  },
];
          const handleOpenDialog = () => {
             showDialog({
               title: "Tạo Task",
               customContent:(<TaskForm/>),
               confirmTextV2: "Áp dụng",
               cancelText: "Xóa",
               onConfirmV2: () => {
             hideDialog(); 
      setTimeout(() => {
        handleOpenDialogConfirm();
      }, 0);

               },
             });
           };
            const handleOpenDialogConfirm = () => {
                   showDialog({
                     title: "Tạo task mới",
                     content: "Sau khi bạn ấn tạo task thì task mới sẽ được tạo và gửi đến sinh viên vui lòng kiểm tra kỹ lại trước khi ấn.",
                     icon: <BsListTask />,
                     confirmText: "Tạo task mới",
                     cancelText: "Trở về",
                     onConfirm: () => {
                      setToast(true)
                     },
                   });
                 };
               
    return ( 
        <div>
              { isToast?
                  <Toast onClose={() => setToast(false)}>
                  <div className="flex items-center gap-3">
                      <div className="w-15 aspect-square rounded-full border-2 border-green-400 flex items-center justify-center">
                        <MdOutlineDone  className="text-2xl text-green-400"/>
                      </div>
                      <p>Sinh viên mới đã được thêm vào danh sách !</p>
            
            
            
                  </div>
                </Toast>:""
                }
         <div className="p-4 w-full max-w-screen h-fit lg:h-screen mt-10 rounded-xl shadow border border-[#ECECEE]">
      {/* filter bar */}
      <div className="flex flex-col lg:flex-row gap-2 lg:gap-4 lg:h-12">
        {/* search */}
        <div className="h-full relative flex-1">
          <input
            type="text"
            placeholder="Tìm kiếm"
            className="w-full border h-full border-gray-300 pl-8 pr-4 px-4 py-4 lg:py-1 rounded-lg transition-all duration-300"
          />

          <FiSearch className="absolute top-1/2 left-2 transform -translate-y-1/2" />
        </div>
        {/* add btn */}
        <button onClick={handleOpenDialog} className="rounded-xl p-5 flex items-center gap-2 bg-green-600 text-white cursor-pointer">
          <GoPlusCircle className="text-xl" />
          Tạo task mới
        </button>
   
      
      </div>
         <div className="flex gap-2 mt-5">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
   
    
       

    </div>
        </div>
     );
}

export default TaskPanel;