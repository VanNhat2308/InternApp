import { useEffect, useState } from "react";
import AvatarUpload from "./avatarUpload";
import { useDialog } from "../context/dialogContext";
import { useToast } from "../context/toastContext";
import Toast from "../components/toast";
import { MdOutlineDone } from "react-icons/md";
import Header from "./header";
import { MdChevronRight } from "react-icons/md";
import ResponNav from "../components/responsiveNav";


function AddStudentPanel() {
     const [isMobile, setIsMobile] = useState(window.innerWidth < 1025);
     
  
  
    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth < 1025);
      };
  
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);
    const {toggleDialog} = useDialog()
    const {isToast,setToast} = useToast()
    const handleAdd = () =>{
      toggleDialog()
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  
   
    return (<>
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
       {isMobile ? <ResponNav /> : <Header>
       <h2 className="text-xl font-semibold">Thêm Sinh Viên</h2>
          <p className="flex gap-2 items-center">Danh Sách <MdChevronRight  className="text-xl"/> Thêm sinh viên  </p>
      </Header>}
    
   
   
        <div className="mt-10 p-5 bg-white rounded shadow">
  {/* Avatar */}
  <div className="flex justify-start mb-6">
    <AvatarUpload/>
  </div>

  {/* Grid form fields */}
  <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <input type="text" placeholder="Nhập Họ Tên" className="input border border-gray-200 rounded-md p-4" />
    <input type="text" placeholder="Nhập Tên Trường" className="input border border-gray-200 rounded-md p-4" />
    <input type="text" placeholder="Mã Số Sinh Viên" className="input border border-gray-200 rounded-md p-4" />
    <input type="text" placeholder="Quê Quán" className="input border border-gray-200 rounded-md p-4" />
    <input type="text" placeholder="Nhập Số Điện Thoại" className="input border border-gray-200 rounded-md p-4" />
    <input type="date" className="input border border-gray-200 rounded-md p-4" />
    <input type="text" placeholder="Vị Trí Thực tập" className="input border border-gray-200 rounded-md p-4" />
    <input type="text" placeholder="Chuyên Ngành" className="input border border-gray-200 rounded-md p-4" />
    <input type="email" placeholder="Thêm Email" className="input border border-gray-200 rounded-md p-4 col-span-1" />
  </form>

  {/* Upload CV */}
  <div className="mt-6">
    <p className="font-semibold mb-2">CV Của Sinh Viên</p>
    <label
      htmlFor="cv-upload"
      className="block w-full lg:w-[60%] lg:mx-auto lg:my-5 border-2 border-dashed border-green-400 rounded p-6 text-center cursor-pointer hover:bg-green-50 transition"
    >
      <div className="flex justify-center mb-2">
        <div className="bg-green-700 text-white p-2 rounded-md">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h5v-2H4V5h12v10h-5v2h5a2 2 0 002-2V5a2 2 0 00-2-2H4z" />
            <path d="M9 12h2V8h3l-4-4-4 4h3v4z" />
          </svg>
        </div>
      </div>
      <p>
        Drag & Drop or <span className="text-green-600 underline">choose file</span> to upload
      </p>
      <p className="text-xs text-gray-500">supported formats: .jpeg, .pdf</p>
    </label>
    <input
      id="cv-upload"
      name="cv"
      type="file"
      accept=".pdf,.jpeg,.jpg"
      className="hidden"
      onChange={(e) => console.log(e.target.files[0])}
    />
  </div>

  {/* Buttons */}
  <div className="flex justify-end gap-4 mt-6">
    <button className="px-4 py-2 border rounded text-black hover:bg-gray-100 cursor-pointer">Hủy Bỏ</button>
    <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer" onClick={handleAdd}>Thêm</button>
  </div>
</div>
 </>

    );
}

export default AddStudentPanel;