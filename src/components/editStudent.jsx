import { useEffect, useState } from "react";
import { useDialog } from "../context/dialogContext";
import { useToast } from "../context/toastContext";
import { BsEye, BsEyeFill, BsFillPeopleFill } from "react-icons/bs";
import { MdChevronRight, MdOutlineDone } from "react-icons/md";
import Toast from "./toast";
import ResponNav from "./responsiveNav";
import Header from "./header";
import avatar from "../assets/images/avatar.png";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../service/axiosClient";
import { FaFileAlt } from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6";
import { IoCamera } from "react-icons/io5";


function EditStudent() {
       const [isMobile, setIsMobile] = useState(window.innerWidth < 1025);
       const { showDialog } = useDialog();
       const {isToast,setToast} = useToast()
       const { idSlug } = useParams();
       const navigate = useNavigate()
       const apiBaseURL = import.meta.env.VITE_API_BASE_URL
       const [avatarFile, setAvatarFile] = useState(null); // file object
       const [avatarFilePreview, setAvatarFilePreview] = useState(""); // preview path
       const [isNewAvatar, setIsNewAvatar] = useState(false); 
       const [danhSachTruong, setDanhSachTruong] = useState([]);
       const [danhSachViTri, setDanhSachViTri] = useState([]);
       const [errors, setErrors] = useState({});
        useEffect(() => {
        const fetchOptions = async () => {
          const truongRes = await axiosClient.get("/truongs");
          const viTriRes = await axiosClient.get("/vi-tris");
          setDanhSachTruong(truongRes.data);
          setDanhSachViTri(viTriRes.data);
        };

        fetchOptions();
      }, []);
       const [studentData, setStudentData] = useState({
  hoTen: "",
  truong: "",
  mssv: "",
  diaChi: "",
  soDienThoai: "",
  ngaySinh: "",
  viTri: "",
  nganh: "",
  email: "",
  cV:"",
  duLieuGuongMat:"",
  tenGiangVien:"",
  thoiGianTT:""


});

const clearForm = () => {
  setStudentData({
  hoTen: "",
  truong: "",
  diaChi: "",
  soDienThoai: "",
  ngaySinh: "",
  viTri: "",
  nganh: "",
  email: "",
  cV:"",
  duLieuGuongMat:"",
  tenGiangVien:"",
  thoiGianTT:""
  });

  setAvatarFile(null);
  setAvatarFilePreview(null);
  setCVFile(null);
  setProgress(0);
  setErrors({});
};

//  avatar logic
  const handleChangeAvatar = (e) => {
    const file = e.target.files[0];
    if (file) {
    setAvatarFile(file);
    setAvatarFilePreview(URL.createObjectURL(file));
    setIsNewAvatar(true);
    }
  };

useEffect(() => {
  axiosClient
    .get(`sinhviens/${idSlug}`)
    .then((res) => {
      const data = res.data.data;
      setStudentData({
        email: data.email || "",
        hoTen: data.hoTen || "",
        maSV: data.maSV || "",
        truong: data.truong?.tenTruong || "",
        diaChi: data.diaChi || "",
        soDienThoai: data.soDienThoai || "",
        ngaySinh: data.ngaySinh || "",
        viTri: data.viTri || "",
        nganh: data.nganh || "",
        duLieuGuongMat:  data.duLieuKhuonMat  || "",
        cV: data.cV || "",
        thoiGianTT: data.thoiGianTT || "",
        tenGiangVien: data.tenGiangVien || ""
      });
        
    if(data.duLieuKhuonMat){
        setAvatarFilePreview(data.duLieuKhuonMat); // ảnh từ server
        setIsNewAvatar(false);
    }
     
      
    })
    .catch((err) => {
      console.error("Lỗi khi lấy dữ liệu sinh viên:", err);
    });
}, [idSlug]);

const validateForm = () => {
  const newErrors = {};

  if (!studentData.hoTen.trim()) newErrors.hoTen = "Họ tên là bắt buộc";
  if (!studentData.diaChi.trim()) newErrors.diaChi = "Quê quán là bắt buộc";
  if (!studentData.email.trim()) newErrors.email = "Email là bắt buộc";
  else if (!/\S+@\S+\.\S+/.test(studentData.email)) newErrors.email = "Email không hợp lệ";

  if (!studentData.truong.trim()) newErrors.maTruong = "Mã trường là bắt buộc";

  if (!studentData.soDienThoai.trim()) newErrors.soDienThoai = "Số điện thoại là bắt buộc";
  else if (!/^[0-9]{9,11}$/.test(studentData.soDienThoai)) newErrors.soDienThoai = "SĐT không hợp lệ";

  if (!studentData.ngaySinh) newErrors.ngaySinh = "Ngày sinh là bắt buộc";

  if (!studentData.viTri.trim()) newErrors.viTri = "Vị trí thực tập là bắt buộc";

  if (!studentData.nganh.trim()) newErrors.nganh = "Chuyên ngành là bắt buộc";

  // Tùy chọn nếu bạn muốn kiểm tra thêm
  if (!studentData.thoiGianTT.trim()) newErrors.thoiGianTT = "Thời gian thực tập là bắt buộc";
  if (!studentData.tenGiangVien.trim()) newErrors.tenGiangVien = "Tên giảng viên là bắt buộc";

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


         const handleOpenDialog = () => {
           showDialog({
             title: "Cập nhật hồ sơ thành công",
             content: "Hồ sơ của sinh viên đã được cập nhật. Vui lòng kiểm tra lại danh sách sinh viên.",
             icon: <BsFillPeopleFill />,
             confirmText: "Về thông tin cá nhân",
             onConfirm: () => {
                 navigate(`/admin/list/student-details/${idSlug}`);
             },
           });
         };
       
       
    
    
      useEffect(() => {
        const handleResize = () => {
          setIsMobile(window.innerWidth < 1025);
        };
    
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
      }, []);
  
     // cv upload logic
  const [CVfile, setCVFile] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setCVFile(selectedFile);
      // Giả lập progress (bạn thay bằng logic upload thật nếu cần)
      let value = 0;
      const interval = setInterval(() => {
        value += 10;
        setProgress(value);
        if (value >= 100) clearInterval(interval);
      }, 100);
    }
  };

  const handleRemove = () => {
    setCVFile(null);
    setProgress(0);
  };
  // update student
  const handleSubmitForm = async () => {
        if (!validateForm()) {
    return; 
  }
  try {
    const formData = new FormData();
    formData.append("hoTen", studentData.hoTen);
    formData.append("email", studentData.email);
    formData.append("nganh", studentData.nganh);
    formData.append("viTri", studentData.viTri);
    formData.append("diaChi", studentData.diaChi);
    formData.append("soDienThoai", studentData.soDienThoai);
    formData.append("ngaySinh", studentData.ngaySinh);
    formData.append("maTruong", studentData.truong); 
    formData.append("thoiGianTT", studentData.thoiGianTT); 
    formData.append("tenGiangVien", studentData.tenGiangVien); 

    if (avatarFile) formData.append("avatar", avatarFile);
    if (CVfile) formData.append("cv", CVfile);

    await axiosClient.post(`/sinhviens/${idSlug}?_method=PUT`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    handleOpenDialog(); 
  } catch (err) {
    console.error("Lỗi cập nhật sinh viên:", err);
  }
};


    
     
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
 <h2 className="text-xl sm:text-2xl font-semibold mb-1">Chỉnh sửa hồ sơ</h2>

  <p className="flex flex-wrap gap-1 sm:gap-2 items-center text-sm sm:text-base text-gray-600">
    <span>Danh Sách</span>
    <MdChevronRight className="text-lg sm:text-xl" />
    <span className="font-medium">{studentData.hoTen}</span>
    <MdChevronRight className="text-lg sm:text-xl" />
    <span className="text-black font-medium">Chỉnh sửa hồ sơ</span>
  </p>
        </Header>}
      
     
     
          <div className="mt-10 p-5 bg-white rounded shadow">
    {/* Avatar */}
  {/* Avatar */}
         <div className="flex justify-start mb-6">
           <div className="flex flex-col items-center">
             <label htmlFor="avatar-upload" className="cursor-pointer relative">
               {avatarFilePreview ? (
                 <img
                   src={
    isNewAvatar
      ? avatarFilePreview // local preview
      : `${apiBaseURL}/${avatarFilePreview}` // ảnh cũ từ server
  }
                   alt="Avatar"
                   className="w-24 h-24 rounded-xl object-cover border border-gray-300 shadow"
                 />
               ) : (
                 <div className="w-24 h-24 rounded-xl bg-green-100 border border-green-300 flex items-center justify-center">
                   <IoCamera className="text-2xl" />
                 </div>
               )}
               <input
                 id="avatar-upload"
                 type="file"
                 accept="image/*"
                 className="hidden"
                 onChange={handleChangeAvatar}
               />
             </label>
           </div>
         </div>
  
    {/* Grid form fields */}
 <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
<div>
  <input
          type="text"
          placeholder="Nhập Họ Tên"
          className="input border border-gray-200 rounded-md p-4 w-full"
          value={studentData.hoTen || ""}
          onChange={(e) =>
            setStudentData({ ...studentData, hoTen: e.target.value })
          }
        />
        {errors.hoTen && <p className="text-red-500 text-sm mt-1">{errors.hoTen}</p>}
</div>
        <div>
          <select
              name="maTruong"
              value={studentData.truong || ""}
              onChange={(e) =>
            setStudentData({ ...studentData, truong: e.target.value })}
          
              className="input border border-gray-200 rounded-md p-4 w-full"
            >
              <option value="">-- Chọn trường --</option>
              {danhSachTruong.map((truong) => (
                <option key={truong.id} value={truong.maTruong}>
          {truong.maTruong}
                </option>
              ))}
            </select>
            {errors.maTruong && <p className="text-red-500 text-sm mt-1">{errors.maTruong}</p>}
        </div>


      <div>
        <input
          type="text"
          placeholder="Quê Quán"
          className="border border-gray-200 rounded-md p-4 w-full"
          value={studentData.diaChi || ""}
          onChange={(e) =>
            setStudentData({ ...studentData, diaChi: e.target.value })
          }
        />
         {errors.diaChi && <p className="text-red-500 text-sm mt-1">{errors.diaChi}</p>}
      </div>
<div>
  
        <input
          type="text"
          placeholder="Nhập Số Điện Thoại"
          className="input border border-gray-200 rounded-md p-4 w-full"
          value={studentData.soDienThoai || ""}
          onChange={(e) =>
            setStudentData({ ...studentData, soDienThoai: e.target.value })
          }
        />
        {errors.soDienThoai && <p className="text-red-500 text-sm mt-1">{errors.soDienThoai}</p>}
</div>

      <div>
        <input
          type="date"
          className="input border border-gray-200 rounded-md p-4 w-full"
          value={studentData.ngaySinh || ""}
          onChange={(e) =>
            setStudentData({ ...studentData, ngaySinh: e.target.value })
          }
        />
        {errors.ngaySinh && <p className="text-red-500 text-sm mt-1">{errors.ngaySinh}</p>}
      </div>

         <div>
           <select
               name="viTri"
               value={studentData.viTri || ""}
               onChange={(e) =>
            setStudentData({ ...studentData, viTri: e.target.value })
                   }
               className="input border border-gray-200 rounded-md p-4 w-full"
             >
               <option value="">-- Chọn vị trí --</option>
               {danhSachViTri.map((viTri) => (
                 <option key={viTri.id} value={viTri.tenViTri}>
                   {viTri.tenViTri}
                 </option>
               ))}
             </select>
             {errors.viTri && <p className="text-red-500 text-sm mt-1">{errors.viTri}</p>}
         </div>


      <div>
        <input
          type="text"
          placeholder="Chuyên Ngành"
          className="input border border-gray-200 rounded-md p-4 w-full"
          value={studentData.nganh || ""}
          onChange={(e) =>
            setStudentData({ ...studentData, nganh: e.target.value })
          }
        />
         {errors.nganh && <p className="text-red-500 text-sm mt-1">{errors.nganh}</p>}
      </div>

      <div>
        <input
          type="email"
          placeholder="Thêm Email"
          className="input border border-gray-200 rounded-md p-4 col-span-1 w-full"
          value={studentData.email || ""}
          onChange={(e) =>
            setStudentData({ ...studentData, email: e.target.value })
          }
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>

        <div>
        <input
          type="text"
          placeholder="Thời gian thực tập"
          className="input border border-gray-200 rounded-md p-4 w-full"
          value={studentData.thoiGianTT || ""}
          onChange={(e) =>
            setStudentData({ ...studentData, thoiGianTT: e.target.value })
          }
        />
         {errors.thoiGianTT && <p className="text-red-500 text-sm mt-1">{errors.thoiGianTT}</p>}
      </div>
        <div>
        <input
          type="text"
          placeholder="Giảng viên hướng dẫn"
          className="input border border-gray-200 rounded-md p-4 w-full"
          value={studentData.tenGiangVien || ""}
          onChange={(e) =>
            setStudentData({ ...studentData, tenGiangVien: e.target.value })
          }
        />
        {errors.tenGiangVien && <p className="text-red-500 text-sm mt-1">{errors.tenGiangVien}</p>}
      </div>
</form>

  
    {/* Upload CV */}
         {/* Upload CV */}
        <div className="mt-6">
          <p className="font-semibold mb-2">CV Của Sinh Viên</p>

          {
          !CVfile && !studentData.cV ? (
            <label
              htmlFor="cv-upload"
              className="block w-full lg:w-[60%] lg:mx-auto lg:my-5 border-2 border-dashed border-green-400 rounded p-6 text-center cursor-pointer hover:bg-green-50 transition"
            >
              <div className="flex justify-center mb-2">
                <div className="bg-green-700 text-white p-2 rounded-md">
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h5v-2H4V5h12v10h-5v2h5a2 2 0 002-2V5a2 2 0 00-2-2H4z" />
                    <path d="M9 12h2V8h3l-4-4-4 4h3v4z" />
                  </svg>
                </div>
              </div>
              <p>
                Drag & Drop or{" "}
                <span className="text-green-600 underline">choose file</span> to
                upload
              </p>
              <p className="text-xs text-gray-500">
                supported formats: .jpeg, .pdf
              </p>
            </label>
          ) : (
            <div className="w-full lg:w-[60%] lg:mx-auto border border-green-400 rounded-lg p-4 relative bg-green-50">
              <div className="flex items-center space-x-4">
                <FaFileAlt className="text-orange-400" />
                <div className="flex-1">
                  <p className="font-medium text-sm">{CVfile?.name || studentData.cV.split("/").pop()}</p>
                   {/* Nếu là file mới thì có progress */}
        {CVfile && (
          <div className="w-full bg-gray-200 rounded h-2 mt-2">
            <div
              className="bg-green-500 h-2 rounded"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
                </div>
                <div className="flex gap-1 items-center">
                  <button
                            className="cursor-pointer text-green-500"
                           onClick={() => {
            if (CVfile) {
         
            
              window.open(URL.createObjectURL(CVfile), "_blank");
            
            } else {
              
              window.open(`${apiBaseURL}/${studentData.cV}`, "_blank");
            }
          }}
                          >
                           <BsEyeFill className="text-2xl"/>
                          </button>
                  <button
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                        onClick={() => {
            setCVFile(null);
            setProgress(0);
            setStudentData({ ...studentData, cV: "" }); 
          }}
                    aria-label="Xóa file"
                  >
                    <FaTrashCan className="w-5 h-5" />
                  </button>
                </div>
                   
              </div>
            </div>
          )}

          <input
            id="cv-upload"
            name="cv"
            type="file"
            accept=".pdf,.jpeg,.jpg"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
  
    {/* Buttons */}
    <div className="flex justify-end gap-4 mt-6">
      <button onClick={clearForm} className="px-4 py-2 border rounded text-black hover:bg-gray-100 cursor-pointer">Hủy Bỏ</button>
      <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer" onClick={handleSubmitForm}>Cập nhật</button>
    </div>
  </div>
   </>
  
      );
}

export default EditStudent;