import { useEffect, useState } from "react";
import { BiQrScan } from "react-icons/bi";
import { FaFileArrowUp } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../../service/axiosClient";
import Swal from "sweetalert2";

function Register() {
  const [form, setForm] = useState({
    hoTen: "",
    soDienThoai: "",
    email: "",
    tenTruong: "",
    maTruong: "",
    ngaySinh: "",
    nganh: "",
    diaChi: "",
    gioiTinh: "Nam",
    viTri: "",
    thoiGianTT: "",
    tenDangNhap: "",
    tenGiangVien: "",
    password: "",
    soDTGV: "",
  });
  
  const [errors, setErrors] = useState({});
const validateForm = () => {
  const newErrors = {};

  if (!form.maTruong.trim()) newErrors.maTruong = "Mã trường là bắt buộc";

  if (!form.hoTen.trim()) newErrors.hoTen = "Họ tên là bắt buộc";

  if (!form.email.trim()) newErrors.email = "Email là bắt buộc";
  else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Email không hợp lệ";

  if (!form.soDienThoai.trim()) newErrors.soDienThoai = "Số điện thoại là bắt buộc";
  else if (!/^[0-9]{9,11}$/.test(form.soDienThoai)) newErrors.soDienThoai = "SĐT không hợp lệ";

  if (!form.ngaySinh) newErrors.ngaySinh = "Ngày sinh là bắt buộc";

  if (!form.nganh.trim()) newErrors.nganh = "Ngành là bắt buộc";

  if (!form.diaChi.trim()) newErrors.diaChi = "Địa chỉ là bắt buộc";

  if (!form.viTri.trim()) newErrors.viTri = "Vị trí là bắt buộc";

  if (!form.thoiGianTT.trim()) newErrors.thoiGianTT = "Thời gian thực tập là bắt buộc";

  if (!form.password.trim()) newErrors.password = "Mật khẩu là bắt buộc";
  else if (form.password.length < 6) newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";

  if (!form.tenGiangVien.trim()) newErrors.tenGiangVien = "Tên giảng viên là bắt buộc";

  if (!form.soDTGV.trim()) newErrors.soDTGV = "SĐT giảng viên là bắt buộc";
  else if (!/^[0-9]{9,11}$/.test(form.soDTGV)) newErrors.soDTGV = "SĐT giảng viên không hợp lệ";
 
  if (!cvFile) newErrors.cv = "Vui lòng tải lên file CV";
  if (!avatarFile) newErrors.avatarFile = "Vui lòng tải lên dữ liệu khuôn mặt";
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};




  const [cvFile, setCvFile] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [danhSachTruong, setDanhSachTruong] = useState([]);
  const [danhSachViTri, setDanhSachViTri] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const truongRes = await axiosClient.get("/truongs");
        const viTriRes = await axiosClient.get("/vi-tris");
        setDanhSachTruong(truongRes.data);
        setDanhSachViTri(viTriRes.data);
      } catch (err) {
        console.error("Lỗi khi tải danh sách trường / vị trí:", err);
      }
    };

    fetchOptions();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "email" ? { tenDangNhap: value } : {}),
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "cv") setCvFile(files[0]);
    if (name === "avatar") setAvatarFile(files[0]);
  };


const handleSubmit = async (e) => {
  e.preventDefault(); // Chặn hành vi reload mặc định

  if (!validateForm()) return;

  const formData = new FormData();
  if (avatarFile) formData.append("avatar", avatarFile);
  if (cvFile) formData.append("cv", cvFile);

  try {
    const uploadRes = await axiosClient.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const { avatar, cv } = uploadRes.data.paths || uploadRes.data;

    const finalForm = {
      ...form,
      duLieuKhuonMat: avatar,
      cV: cv,
    };

    // Đăng ký sinh viên
    const res = await axiosClient.post("/sinhviens", finalForm);
    const maSV = res.data?.data?.maSV || res.data?.maSV;

    // Gọi API tạo hồ sơ
    const today = new Date().toISOString().split("T")[0]; // yyyy-mm-dd

    await axiosClient.post("/hoso", {
      maSV,
      ngayNop: today,
      // Không cần truyền trangThai nếu mặc định trong backend là "Chờ duyệt"
    });

let secondsToGo = 3;

Swal.fire({
  icon: "success",
  title: "Đăng ký và tạo hồ sơ thành công!",
  html: `Chuyển đến trang đăng nhập sau <b>${secondsToGo}</b> giây...`,
  timer: secondsToGo * 1000,
  showConfirmButton: false,
  didOpen: () => {
    const content = Swal.getHtmlContainer().querySelector("b");
    const timerInterval = setInterval(() => {
      secondsToGo--;
      if (content) content.textContent = secondsToGo;
      if (secondsToGo <= 0) clearInterval(timerInterval);
    }, 1000);
  },
}).then(() => {
  navigate("/login-sinhvien");
});


  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Đăng ký thất bại!",
      text: err.response?.data?.message || err.message,
    });
  }
};



  return (
    <div
      className="w-full p-4 min-h-screen overflow-clip relative"
      style={{
        background:
          "linear-gradient(296.58deg, #34A853 0.36%, #5FA471 33.41%, #FFFFFF 100%)",
      }}
    >
      {/* Background hình tròn */}
      <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] md:w-[300px] md:h-[300px] rounded-full bg-green-300/30"></div>
      <div className="absolute top-0 left-0 -translate-y-[75%] w-[200px] h-[200px] md:w-[300px] md:h-[300px] rounded-full bg-green-300/30"></div>
      <div className="absolute bottom-0 right-0 translate-y-[75%] w-[200px] h-[200px] md:w-[300px] md:h-[300px] rounded-full bg-white/30"></div>
      <div className="absolute bottom-0 right-0 translate-x-[50%] translate-y-[25%] w-[200px] h-[200px] md:w-[300px] md:h-[300px] rounded-full bg-white/30"></div>

      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full lg:max-w-[65vw] mx-auto bg-white/30 rounded-3xl shadow-xl p-6 sm:p-10"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">Đăng ký thực tập</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/** Text inputs */}
          {[
            { label: "Họ tên", name: "hoTen", type: "text" },
            { label: "Số điện thoại", name: "soDienThoai", type: "text" },
            { label: "Email", name: "email", type: "email" },
            { label: "Ngày sinh", name: "ngaySinh", type: "date" },
            { label: "Ngành", name: "nganh", type: "text" },
            { label: "Địa chỉ", name: "diaChi", type: "text" },
            { label: "Thời gian thực tập", name: "thoiGianTT", type: "text" },
            { label: "Mật khẩu", name: "password", type: "password" },
            { label: "Tên giảng viên", name: "tenGiangVien", type: "text" },
            { label: "SĐT giảng viên", name: "soDTGV", type: "text" },
          ].map(({ label, name, type }) => (
            <div key={name} className="flex flex-col gap-1">
              <label className="font-semibold">{label}</label>
              <input
                type={type}
                name={name}
                value={form[name]}
                onChange={handleInputChange}
                className="bg-white rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-400 focus:shadow-md"
                placeholder={`Nhập ${label.toLowerCase()}`}
              />
                {errors[name] && (
      <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
    )}
            </div>
          ))}

          {/** Trường học */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold">Trường</label>
            <select
              name="maTruong"
              value={form.maTruong}
              onChange={handleInputChange}
              className="bg-white rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-400 focus:shadow-md"
            >
              <option value="">-- Chọn trường --</option>
              {danhSachTruong.map((truong) => (
                <option key={truong.id} value={truong.maTruong}>
                  {truong.tenTruong}
                </option>
              ))}
            </select>
          </div>

          {/** Vị trí thực tập */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold">Vị trí thực tập</label>
            <select
              name="viTri"
              value={form.viTri}
              onChange={handleInputChange}
              className="bg-white rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-400 focus:shadow-md"
            >
              <option value="">-- Chọn vị trí --</option>
              {danhSachViTri.map((vt) => (
                <option key={vt.id} value={vt.tenViTri}>
                  {vt.tenViTri}
                </option>
              ))}
            </select>
          </div>

          {/** Giới tính */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold">Giới tính</label>
            <div className="flex gap-4 items-center p-2">
              {["Nam", "Nữ"].map((gt) => (
                <label key={gt} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="gioiTinh"
                    value={gt}
                    checked={form.gioiTinh === gt}
                    onChange={handleInputChange}
                  />
                  {gt}
                </label>
              ))}
            </div>
          </div>

        {/** Upload CV */}
<div className="flex flex-col gap-1">
  <div className="flex items-center gap-2">
    <label className="font-semibold">CV sinh viên:</label>
    <label className="cursor-pointer text-green-600">
      <FaFileArrowUp size={20} />
      <input
        type="file"
        name="cv"
        accept=".pdf,.doc,.docx"
        className="hidden"
        onChange={handleFileChange}
      />
    </label>
    {cvFile && <span className="text-sm">{cvFile.name}</span>}
  </div>
  {errors.cv && <span className="text-red-500 text-sm">{errors.cv}</span>}
</div>

{/** Dữ liệu khuôn mặt */}
<div className="flex flex-col gap-1">
  <div className="flex items-center gap-2">
    <label className="font-semibold">Dữ liệu khuôn mặt:</label>
    <label className="cursor-pointer text-green-600">
      <BiQrScan size={22} />
      <input
        type="file"
        name="avatar"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </label>
    {avatarFile && <span className="text-sm">{avatarFile.name}</span>}
  </div>
  {errors.avatarFile && <span className="text-red-500 text-sm">{errors.avatarFile}</span>}
</div>

        </div>

        {/* Submit */}
        <div className="flex flex-col items-center mt-6 gap-2">
          <button
          type="submit"
            onClick={handleSubmit}
            className="px-10 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md"
          >
            ĐĂNG KÝ
          </button>
          <div>
            <span className="text-gray-700 font-semibold">Đã có tài khoản?</span>
            <Link to="/login-sinhvien" className="text-blue-500 ml-1 underline">
              Đăng nhập
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Register;
