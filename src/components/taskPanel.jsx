import { FiAlertCircle, FiAlertTriangle, FiCheckCircle, FiSearch } from "react-icons/fi";
import { GoPlusCircle } from "react-icons/go";
import taskAva from '../assets/images/taskAvatar.jpg'
import { useDialog } from "../context/dialogContext";
import { useToast } from "../context/toastContext";
import TaskForm from "./taskForm";
import Toast from "./toast";
import { MdOutlineDone } from "react-icons/md";
import { BsListTask } from "react-icons/bs";
import TaskCard from "./taskCard";
import { useEffect, useRef, useState } from "react";
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
    const userRole = localStorage.getItem('role')
    const [activeTab, setActiveTab] = useState("Chưa nộp");

 const fetchStudents = () => {
      setLoading(true);
      axiosClient.get('student/tasks',{
        params:{
            page: currentPage,
            search: searchTerm,
            status: activeTab || 'Chưa nộp'
        }
      }).then((res)=>{
        setTasks(res.data.data)
        setTotalPages(res.data.last_page);
        
      }).catch((err) => console.log(err))
    .finally(() => setLoading(false))
    }

const formRef = useRef();

  const handleOpenDialog = () => {
      showDialog({
        title: "Tạo Task",
        customContent:(<TaskForm ref={formRef}/>),
        confirmTextV2: "Áp dụng",
        cancelText: "Xóa",
      onConfirmV2: async () => {
    const confirmed = window.confirm("Sau khi bạn ấn tạo task thì task mới sẽ được tạo và gửi đến sinh viên. Bạn có chắc?");
    if (!confirmed) return;

  const success = await formRef.current?.submitTask();
  if (success) {
    hideDialog();
    setToast(true);
    fetchStudents(); 
  }
},

             });
           };
    
            
useEffect(() => {
  const delayDebounce = setTimeout(() => {
    fetchStudents();
  }, 500); // debounce 500ms

  return () => clearTimeout(delayDebounce);
}, [searchTerm, currentPage,activeTab]);
               
    return ( 
        <div>

            <div className="mt-5">
                {/* Tabs */}
                <div className="border-b border-gray-200 dark:border-gray-700">
                <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
            <li className="me-2">
              <button
                onClick={() => setActiveTab("Chưa nộp")}
                className={`cursor-pointer inline-flex items-center gap-1 p-4 border-b-2 rounded-t-lg ${
                  activeTab === "Chưa nộp"
                    ? "text-green-600 border-green-600 dark:text-green-500 dark:border-green-500"
                    : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                }`}
              >
                <FiAlertCircle  className="text-base" />
                Chưa nộp
              </button>
            </li>
            <li className="me-2">
              <button
                onClick={() => setActiveTab("Đã nộp")}
                className={`cursor-pointer inline-flex items-center gap-1 p-4 border-b-2 rounded-t-lg ${
                  activeTab === "Đã nộp"
                    ? "text-green-600 border-green-600 dark:text-green-500 dark:border-green-500"
                    : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                }`}
              >
                <FiCheckCircle className="text-base" />
                Đã nộp
              </button>
            </li>
            <li className="me-2">
              <button
                onClick={() => setActiveTab("Nộp trễ")}
                className={`cursor-pointer inline-flex items-center gap-1 p-4 border-b-2 rounded-t-lg ${
                  activeTab === "Nộp trễ"
                    ? "text-green-600 border-green-600 dark:text-green-500 dark:border-green-500"
                    : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                }`}
              >
                <FiAlertTriangle className="text-base" />
                Nộp trễ
              </button>
            </li>
          </ul>
                </div>
          
                {/* Nội dung tương ứng tab */}
                <div className="mt-6">
                  {activeTab === "Chưa nộp" && (
                   <div className="p-4 w-full h-fit mt-5 rounded-md shadow border border-[#ECECEE]">
  {/* filter bar */}
  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center">
    {/* Search box */}
    <div className="relative flex-1 w-full">
      <input
        onChange={(e) => setSearchTerm(e.target.value)}
        type="text"
        placeholder="Tìm kiếm"
        className="w-full border border-gray-300 pl-10 pr-4 py-2 rounded-lg transition-all duration-300 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-200 focus:shadow-md"
      />
      <FiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500 text-base" />
    </div>

    {/* Add Task button */}
    <button
      onClick={handleOpenDialog}
      className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm sm:text-base"
    >
      <GoPlusCircle className="text-xl" />
      Tạo task mới
    </button>
</div>

         {loading ? (
        <div className="flex justify-center items-center py-10">
        <div role="status">
    <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-green-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
    <span className="sr-only">Loading...</span>
</div>
        </div>
      ):(<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-4 mt-5">
      {
      tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>)}
        <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
   
    
       

    </div>
                  )}
                  {activeTab === "Đã nộp" && (
                               <div className="p-4 w-full h-fit mt-5 rounded-md shadow border border-[#ECECEE]">
  {/* filter bar */}
  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center">
    {/* Search box */}
    <div className="relative flex-1 w-full">
      <input
        onChange={(e) => setSearchTerm(e.target.value)}
        type="text"
        placeholder="Tìm kiếm"
        className="w-full border border-gray-300 pl-10 pr-4 py-2 rounded-lg transition-all duration-300 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-200 focus:shadow-md"
      />
      <FiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500 text-base" />
    </div>
</div>

         {loading ? (
        <div className="flex justify-center items-center py-10">
        <div role="status">
    <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-green-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
    <span className="sr-only">Loading...</span>
</div>
        </div>
      ):(<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-4 mt-5">
      {
      tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>)}
        <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
   
    
       

    </div>
                  )}
                  {activeTab === "Nộp trễ" && (
                             <div className="p-4 w-full h-fit mt-5 rounded-md shadow border border-[#ECECEE]">
  {/* filter bar */}
  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center">
    {/* Search box */}
    <div className="relative flex-1 w-full">
      <input
        onChange={(e) => setSearchTerm(e.target.value)}
        type="text"
        placeholder="Tìm kiếm"
        className="w-full border border-gray-300 pl-10 pr-4 py-2 rounded-lg transition-all duration-300 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-200 focus:shadow-md"
      />
      <FiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500 text-base" />
    </div>

   
</div>

         {loading ? (
        <div className="flex justify-center items-center py-10">
        <div role="status">
    <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-green-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
    <span className="sr-only">Loading...</span>
</div>
        </div>
      ):(<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-4 mt-5">
      {
      tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>)}
        <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
   
    
       

    </div>
                  )}
                </div>
              </div>
              {/* { isToast?
                  <Toast onClose={() => setToast(false)}>
                  <div className="flex items-center gap-3">
                      <div className="w-15 aspect-square rounded-full border-2 border-green-400 flex items-center justify-center">
                        <MdOutlineDone  className="text-2xl text-green-400"/>
                      </div>
                      <p>Sinh viên mới đã được thêm vào danh sách !</p>
            
            
            
                  </div>
                </Toast>:""
                } */}
  
        </div>
     );
}

export default TaskPanel;