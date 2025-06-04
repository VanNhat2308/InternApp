import { BsFillPeopleFill } from "react-icons/bs";
import { useDialog } from "../context/dialogContext";
import { useToast } from "../context/toastContext";

function AddStudentDialog() {
    const {toggleDialog} = useDialog()
    const {toggleToast} = useToast()
 

    const handleAddStudent = () =>{
        // dk neu dung
        toggleDialog()
        toggleToast()

    }
 
    return ( 
    <div 
style={{
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(5px)'
}}
className="absolute top-0 left-0 w-full h-[100%] z-1000 flex justify-center">
<div className="mt-20 p-8 w-150 h-fit flex flex-col items-center bg-white shadow-xl rounded-2xl">
    <div className="bg-[#34a853] mb-5 rounded-2xl w-30 aspect-square flex items-center justify-center">
<BsFillPeopleFill  className="text-4xl text-white"/>
    </div>
    <h1 className="text-3xl font-bold mb-6">Xác nhận thêm sinh viên</h1>
    <p className="text-gray-600 text-lg mb-6">Sau khi bạn thêm sinh viên, sinh viên thực tập mới sẽ được thêm vào danh sách sinh viên. Vui lòng kiểm tra ky thông tin. 
</p>

<button onClick={handleAddStudent} className="bg-[#34a853] p-4 rounded-4xl cursor-pointer mb-4 font-bold text-xl text-white w-full">
    Có, thêm sinh viên
</button>
<button onClick={toggleDialog} className="p-4 rounded-4xl cursor-pointer mb-4 border border-gray-300 font-bold text-xl w-full">
    Không, tôi muốn kiểm tra lại
</button>

</div>


    </div> 
    );
}

export default AddStudentDialog;