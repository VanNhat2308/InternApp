import { useEffect, useState } from "react";
import { useDialog } from "../context/dialogContext";
import { useToast } from "../context/toastContext";
import Toast from "../components/toast";
import { MdOutlineDone } from "react-icons/md";
import Header from "./header";
import { MdChevronRight } from "react-icons/md";
import ResponNav from "../components/responsiveNav";
import { BsEyeFill, BsFillPeopleFill } from "react-icons/bs";
import { FaTrashCan } from "react-icons/fa6";
import { FaFileAlt, FaFilePdf } from "react-icons/fa";
import { IoCamera } from "react-icons/io5";
import axiosClient from "../service/axiosClient";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
function AddStudentPanel() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1025);
  const { showDialog } = useDialog();
  const { isToast, setToast } = useToast();
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarFilePreview, setAvatarFilePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [danhSachTruong, setDanhSachTruong] = useState([]);
  const [danhSachViTri, setDanhSachViTri] = useState([]);
  useEffect(() => {
  const fetchOptions = async () => {
    const truongRes = await axiosClient.get("/truongs");
    const viTriRes = await axiosClient.get("/vi-tris");
    setDanhSachTruong(truongRes.data);
    setDanhSachViTri(viTriRes.data);
  };

  fetchOptions();
}, []);
  const [form, setForm] = useState({
  hoTen: "",
  tenDangNhap:"",
  password:"pwd123",
  maTruong: "",
  maSV: "",
  diaChi: "",
  soDienThoai: "",
  ngaySinh: "",
  viTri: "",
  nganh: "",
  email: "",
  thoiGianTT: "",
  tenGiangVien:"",
  cV: "",              // ← Sẽ được gán sau khi upload
  duLieuKhuonMat: "",  // ← Sẽ được gán sau khi upload
});

  //  avatar logic
  const handleChangeAvatar = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file)
      setAvatarFilePreview(URL.createObjectURL(file)); // Hiển thị ảnh
      
    }
  };



  // responsive nav
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1025);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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

  //
  // handle upload file

 const handleUpload = async () => {
  const formData = new FormData();

  if (avatarFile) formData.append("avatar", avatarFile);
  if (CVfile) formData.append("cv", CVfile);

  try {
    const res = await axiosClient.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (e) => {
        const percent = Math.round((e.loaded * 100) / e.total);
        setProgress(percent);
      },
    });

    console.log("Response data upload:", res.data);

    const { avatar, cv } = res.data.paths || res.data;

    return { avatar, cv };
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.errors?.avatar?.[0] ||
      error.response?.data?.errors?.cv?.[0] ||
      error.message ||
      "Đã xảy ra lỗi không xác định.";

    alert("Lỗi upload: " + message);
    throw error;
  }
};


const handleSubmitForm = async () => {
  try {
    const res = await axiosClient.post("/sinhviens", form); // API bạn cần

    console.log("Gửi thành công:", res.data);
    setToast(true);
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.errors?.avatar?.[0] ||
      error.response?.data?.errors?.cv?.[0] ||
      error.message ||
      "Đã xảy ra lỗi không xác định.";

    alert("Lỗi upload: " + message);
    throw error; // để xử lý tiếp ở hàm cha nếu cần
  }
  
};
const clearForm = () => {
  setForm({
    hoTen: "",
    tenDangNhap: "",
    password: "pwd123",
    maTruong: "",
    maSV: "",
    diaChi: "",
    soDienThoai: "",
    ngaySinh: "",
    viTri: "",
    nganh: "",
    email: "",
    thoiGianTT: "",
    tenGiangVien: "",
    cV: "",
    duLieuKhuonMat: "",
  });

  setAvatarFile(null);
  setAvatarFilePreview(null);
  setCVFile(null);
  setProgress(0);
  setErrors({});
};

const validateForm = () => {
  const newErrors = {};

  if (!form.hoTen.trim()) newErrors.hoTen = "Họ tên là bắt buộc";
  if (!form.diaChi.trim()) newErrors.diaChi = "Quê quán là bắt buộc";
  if (!form.email.trim()) newErrors.email = "Email là bắt buộc";
  else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Email không hợp lệ";

  if (!form.maTruong.trim()) newErrors.maTruong = "Mã trường là bắt buộc";

  if (!form.soDienThoai.trim()) newErrors.soDienThoai = "Số điện thoại là bắt buộc";
  else if (!/^[0-9]{9,11}$/.test(form.soDienThoai)) newErrors.soDienThoai = "SĐT không hợp lệ";

  if (!form.ngaySinh) newErrors.ngaySinh = "Ngày sinh là bắt buộc";

  if (!form.viTri.trim()) newErrors.viTri = "Vị trí thực tập là bắt buộc";

  if (!form.nganh.trim()) newErrors.nganh = "Chuyên ngành là bắt buộc";

  // Tùy chọn nếu bạn muốn kiểm tra thêm
  if (!form.thoiGianTT.trim()) newErrors.thoiGianTT = "Thời gian thực tập là bắt buộc";
  if (!form.tenGiangVien.trim()) newErrors.tenGiangVien = "Tên giảng viên là bắt buộc";

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


const handleConfirmAddStudent = async () => {
  if (!validateForm()) return;

  try {
    // 1. Hiển thị trạng thái "Đang thêm"
    Swal.fire({
      title: "Đang thêm sinh viên...",
      text: "Vui lòng đợi trong giây lát",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const { avatar, cv } = await handleUpload();

    const formToSend = {
      ...form,
      duLieuKhuonMat: avatar?.path || null,
      cV: cv?.path || null,
    };
    setErrors({});

    const resStudent = await axiosClient.post("/sinhviens", formToSend);
    const newMaSV = resStudent.data.data.maSV;

    // Gọi API tạo hồ sơ
    const hoSoData = {
      maSV: newMaSV,
      ngayNop: new Date().toISOString().split("T")[0],
      trangThai: "Đã duyệt"
    };

    await axiosClient.post("/hoso", hoSoData);

    // 2. Hiển thị thành công + đếm ngược
    Swal.fire({
      icon: "success",
      title: "Thêm thành công!",
      text: "Sẽ quay lại danh sách sau 3 giây...",
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false
    });

    // 3. Sau 5s chuyển trang
    setTimeout(() => {
      navigate("/admin/list/student-list");
    }, 5000);

  } catch (error) {
    Swal.close(); // Đóng trạng thái loading nếu lỗi
    if (error.response?.status === 422) {
      setErrors(error.response.data.errors || {});
    } else {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: error.message || "Có lỗi xảy ra"
      });
    }
  }
};


    //  dialog
  const handleOpenDialog = () => {
    showDialog({
      title: "Xác nhận thêm sinh viên",
      content:
        "Sau khi bạn thêm sinh viên, sinh viên thực tập mới sẽ được thêm vào danh sách sinh viên. Vui lòng kiểm tra ky thông tin. ",
      icon: <BsFillPeopleFill />,
      confirmText: "Có, thêm sinh viên",
      cancelText: "Không, tôi muốn kiểm tra lại",
      onConfirm: handleConfirmAddStudent
  })}

const handleInputForm = (e) => {
  const { name, value } = e.target;
  setForm((prev) => ({
    ...prev,
    [name]: value,
    ...(name === "email" ? { tenDangNhap: value } : {}),
  }));
};



  return (

    <>
      {isToast ? (
        <Toast onClose={() => setToast(false)}>
          <div className="flex items-center gap-3">
            <div className="w-15 aspect-square rounded-full border-2 border-green-400 flex items-center justify-center">
              <MdOutlineDone className="text-2xl text-green-400" />
            </div>
            <p>Sinh viên mới đã được thêm vào danh sách !</p>
          </div>
        </Toast>
      ) : (
        ""
      )}
      {isMobile ? (
        <ResponNav />
      ) : (
        <Header>
          <h2 className="text-xl font-semibold">Thêm Sinh Viên</h2>
          <p className="flex gap-2 items-center">
            Danh Sách <MdChevronRight className="text-xl" /> Thêm sinh viên{" "}
          </p>
        </Header>
      )}

      <div className="flex-1 mt-5 p-5 border border-gray-50  bg-white rounded-md">
        {/* Avatar */}
        <div className="flex justify-start mb-6">
          <div className="flex flex-col items-center">
            <label htmlFor="avatar-upload" className="cursor-pointer relative">
              {avatarFile ? (
                <img
                  src={avatarFilePreview}
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
  {/* Họ tên */}
  <div>
    <input
      name="hoTen"
      value={form.hoTen}
      onChange={handleInputForm}
      type="text"
      placeholder="Nhập Họ Tên"
 className="input border border-gray-200 rounded-md p-4 w-full focus:outline-none focus:ring-2 focus:ring-green-200 focus:shadow-md"

    />
    {errors.hoTen && <p className="text-red-500 text-sm mt-1">{errors.hoTen}</p>}
  </div>

  {/* Mã trường */}
  <div>

  <select
    name="maTruong"
    value={form.maTruong}
    onChange={handleInputForm}
    className="input border border-gray-200 rounded-md p-4 w-full focus:outline-none focus:ring-2 focus:ring-green-200 focus:shadow-md"
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

  {/* Địa chỉ */}
  <div>
    <input
      name="diaChi"
      value={form.diaChi}
      onChange={handleInputForm}
      type="text"
      placeholder="Quê Quán"
      className="input border border-gray-200 rounded-md p-4 w-full focus:outline-none focus:ring-2 focus:ring-green-200 focus:shadow-md"
    />
    {errors.diaChi && <p className="text-red-500 text-sm mt-1">{errors.diaChi}</p>}
  </div>

  {/* SĐT */}
  <div>
    <input
      name="soDienThoai"
      value={form.soDienThoai}
      onChange={handleInputForm}
      type="text"
      placeholder="Nhập Số Điện Thoại"
      className="input border border-gray-200 rounded-md p-4 w-full focus:outline-none focus:ring-2 focus:ring-green-200 focus:shadow-md"
    />
    {errors.soDienThoai && <p className="text-red-500 text-sm mt-1">{errors.soDienThoai}</p>}
  </div>

  {/* Ngày sinh */}
  <div>
    <input
      name="ngaySinh"
      value={form.ngaySinh}
      onChange={handleInputForm}
      // onKeyDown={(e) => e.preventDefault()}
      type="date"
      className="input border border-gray-200 rounded-md p-4 w-full focus:outline-none focus:ring-2 focus:ring-green-200 focus:shadow-md"
    />
    {errors.ngaySinh && <p className="text-red-500 text-sm mt-1">{errors.ngaySinh}</p>}
  </div>

  {/* Vị trí */}
  <div>
   <select
    name="viTri"
    value={form.viTri}
    onChange={handleInputForm}
    className="input border border-gray-200 rounded-md p-4 w-full focus:outline-none focus:ring-2 focus:ring-green-200 focus:shadow-md"
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

  {/* Ngành */}
  <div>
    <input
      name="nganh"
      value={form.nganh}
      onChange={handleInputForm}
      type="text"
      placeholder="Chuyên Ngành"
      className="input border border-gray-200 rounded-md p-4 w-full focus:outline-none focus:ring-2 focus:ring-green-200 focus:shadow-md"
    />
    {errors.nganh && <p className="text-red-500 text-sm mt-1">{errors.nganh}</p>}
  </div>

  {/* Email */}
  <div>
    <input
      name="email"
      value={form.email}
      onChange={handleInputForm}
      type="email"
      placeholder="Thêm Email"
      className="input border border-gray-200 rounded-md p-4 w-full focus:outline-none focus:ring-2 focus:ring-green-200 focus:shadow-md"
    />
    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
  </div>

  {/* Thời gian TT */}
  <div>
    <input
      name="thoiGianTT"
      value={form.thoiGianTT}
      onChange={handleInputForm}
      type="text"
      placeholder="Thời gian thực tập"
      className="input border border-gray-200 rounded-md p-4 w-full focus:outline-none focus:ring-2 focus:ring-green-200 focus:shadow-md"
    />
    {errors.thoiGianTT && <p className="text-red-500 text-sm mt-1">{errors.thoiGianTT}</p>}
  </div>

  {/* Tên giảng viên */}
  <div>
    <input
      name="tenGiangVien"
      value={form.tenGiangVien}
      onChange={handleInputForm}
      type="text"
      placeholder="Giảng Viên Hướng Dẫn"
      className="input border border-gray-200 rounded-md p-4 w-full focus:outline-none focus:ring-2 focus:ring-green-200 focus:shadow-md"
    />
    {errors.tenGiangVien && <p className="text-red-500 text-sm mt-1">{errors.tenGiangVien}</p>}
  </div>
</form>


        {/* Upload CV */}
        <div className="mt-6">
          <p className="font-semibold mb-2">CV Của Sinh Viên</p>

          {!CVfile ? (
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
            <div className="w-full lg:w-[60%] lg:mx-auto border border-gray-300 rounded-md p-4 relative bg-gray-50">
              <div className="flex items-center space-x-4">
                <FaFileAlt className="text-orange-400 text-2xl" />
                <div className="flex-1">
                  <p className="font-medium text-sm">{CVfile.name}</p>
                  <div className="w-full bg-gray-200 rounded h-2 mt-2">
                    <div
                      className="bg-green-400 h-2 rounded"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <div className="flex gap-1 items-center">
  {/* Nút xem */}
  <button
    className="cursor-pointer p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200 hover:text-green-700 transition"
    onClick={() => window.open(URL.createObjectURL(CVfile), '_blank')}
    title="Xem CV"
  >
    <BsEyeFill className="text-base" />
  </button>

  {/* Nút xóa */}
  <button
    className="cursor-pointer p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 transition"
    onClick={handleRemove}
    aria-label="Xóa file"
    title="Xóa file"
  >
    <FaTrashCan className="text-base" />
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
        <div className="flex justify-end gap-4 mt-10">
          <button onClick={clearForm} className="px-4 py-2 border rounded text-black hover:bg-gray-100 cursor-pointer">
            Hủy Bỏ
          </button>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer"
            onClick={handleOpenDialog}
          >
            Thêm
          </button>
        </div>
      </div>
    </>
  );
}

// }

export default AddStudentPanel;
