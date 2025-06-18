import { FiSearch } from "react-icons/fi";
import { GoPlusCircle } from "react-icons/go";
import taskAva from '../assets/images/taskAvatar.jpg'
import { useDialog } from "../context/dialogContext";
import { useToast } from "../context/toastContext";
import TaskForm from "./taskForm";
import Toast from "./toast";
import { MdOutlineDone } from "react-icons/md";
import { BsListTask } from "react-icons/bs";
import TaskCard from "./taskCard";
import { useEffect, useState } from "react";
import axiosClient from "../service/axiosClient";
import Pagination from "./pagination";
function TaskPanel() {
    const { showDialog,hideDialog } = useDialog()
    const {isToast,setToast} = useToast()
    const [tasks, setTasks] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

 const fetchStudents = () => {
      setLoading(true);
      axiosClient.get('student/tasks',{
        params:{
            page: currentPage,
            search: searchTerm
        }
      }).then((res)=>{
        setTasks(res.data.data)
        setTotalPages(res.data.last_page);
        
      }).catch((err) => console.log(err))
    .finally(() => setLoading(false))
    }



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
            
useEffect(() => {
  const delayDebounce = setTimeout(() => {
    fetchStudents();
  }, 500); // debounce 500ms

  return () => clearTimeout(delayDebounce);
}, [searchTerm, currentPage]);
               
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
         <div className="p-4 w-full max-w-screen h-fit  mt-10 rounded-xl shadow border border-[#ECECEE]">
      {/* filter bar */}
      <div className="flex flex-col lg:flex-row gap-2 lg:gap-4 lg:h-12">
        {/* search */}
        <div className="h-full relative flex-1">
          <input
            onChange={(e)=>setSearchTerm(e.target.value)}
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
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-4 mt-5">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
        <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
   
    
       

    </div>
        </div>
     );
}

export default TaskPanel;