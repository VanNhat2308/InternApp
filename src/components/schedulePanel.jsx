import { RiShoppingBag3Line } from 'react-icons/ri';
import avatar from '../assets/images/avatar.png'
import { MdOutlineDone, MdOutlineEmail } from 'react-icons/md';
import { useDialog } from '../context/dialogContext';
import { useToast } from '../context/toastContext';
import { BiEdit, BiTrash } from 'react-icons/bi';
import ViewModeCalendar from './calendar/viewModeCalendar';
import Toast from './toast';
import { BsFillPeopleFill } from 'react-icons/bs';
function SchedulePanel() {
         const { showDialog } = useDialog();
         const {isToast,setToast} = useToast()
          const handleOpenDialogDelete = () => {
                   showDialog({
                     title: "Xác nhận xóa lịch thực tập",
                     content: "Sau khi xóa lịch thực tập thì lịch thực tập của sinh viên sẽ được xóa khỏi danh sách.",
                     icon: <BsFillPeopleFill />,
                     confirmText: "Xóa",
                     cancelText: "Không, tôi muốn kiểm tra lại",
                     onConfirm: () => {
                      setToast(true)
                     },
                   });
                 };
     const handleOpenDialog = () => {
              showDialog({
                title: "Thêm lịch",
                customContent:(
                  <div className='flex flex-col mt-5'>
                    <label className='font-semibold text-xl' htmlFor="thu">Thứ</label>
                    <select className='border border-gray-300 p-3 rounded-md' name="thu" id="thu">
                     <option value="Mon">Thứ 2</option>
                      <option value="Tue">Thứ 3</option>
                      <option value="Wed">Thứ 4</option>
                      <option value="Thu">Thứ 5</option>
                      <option value="Fri">Thứ 6</option>
                    </select>
                    <label className='font-semibold text-xl mt-3' htmlFor="ca">Ca</label>
                    <select className='mb-20 border border-gray-300 p-3 rounded-md' name="ca" id="ca">
                      <option value="8:00-12:00">Ca sáng: 8:00 - 12:00</option>
                      <option value="13:00-17:00">Ca chiều: 13:00 - 17:00</option>
                    </select>
                  </div>

                ),
        
                confirmText: "Áp dụng",
                cancelText: "Đặt lại",
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
                        <p>Lịch thực tập đã được thêm vào !</p>
              
              
              
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
                     onClick={handleOpenDialogDelete}
                     className="cursor-pointer p-3 flex items-center gap-2 border border-gray-300 rounded-md">
                     <BiTrash className="text-xl" />
                      Xóa
                    </button>
                    <button
                    onClick={handleOpenDialog}
                    className="cursor-pointer p-3 flex items-center gap-2 bg-[#34A853] rounded-md text-white">
                     <BiEdit className="text-xl" />
                     Thêm
                    </button>
                  </div>
                </div>

                {/* lịch */}
              <ViewModeCalendar/>
                 


    </div> 
    </>
    );
}

export default SchedulePanel;