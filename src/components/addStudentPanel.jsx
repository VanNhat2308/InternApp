import { useEffect, useState } from "react";
import { useDialog } from "../context/dialogContext";
import { useToast } from "../context/toastContext";
import Toast from "../components/toast";
import { MdOutlineDone } from "react-icons/md";
import Header from "./header";
import { MdChevronRight } from "react-icons/md";
import ResponNav from "../components/responsiveNav";
import { BsFillPeopleFill } from "react-icons/bs";
import { FaTrashCan } from "react-icons/fa6";
import { FaFileAlt, FaFilePdf } from "react-icons/fa";
import { IoCamera } from "react-icons/io5";
import axiosClient from "../service/axiosClient";

function AddStudentPanel() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1025);
  const { showDialog } = useDialog();
  const { isToast, setToast } = useToast();
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarFilePreview, setAvatarFilePreview] = useState(null);

  //  avatar logic
  const handleChangeAvatar = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file)
      setAvatarFilePreview(URL.createObjectURL(file)); // Hiển thị ảnh
      // TODO: Bạn có thể upload `file` lên server tại đây
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

    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    if (CVfile) {
      formData.append("cv", CVfile);
    }

    try {
      const res = await axiosClient.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percent);
        },
      });
          const { avatar, cv } = res.data.paths;

    // Gán path vào form:
    setForm(prev => ({
      ...prev,
      duLieuKhuonMat: avatar,
      cV: cv,
    }));

    console.log("Gán xong path vào form")
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const handleSubmitForm = async () => {
  try {
    const res = await axiosClient.post("/sinhViens", form); // API bạn cần

    console.log("Gửi thành công:", res.data);
    setToast(true);
  } catch (err) {
    console.error("Gửi form lỗi:", err);
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
      onConfirm: async () => {
    try {
    await handleUpload();
    await handleSubmitForm();
    setToast(true);
  } catch (error) {
    console.error("Có lỗi khi upload hoặc gửi:", error);
  }
  }})
  // form submit
  const [form, setForm] = useState({
  hoTen: "",
  maTruong: "",
  maSV: "",
  diaChi: "",
  soDienThoai: "",
  ngaySinh: "",
  viTri: "",
  nganh: "",
  email: "",
  cV: "",              // ← Sẽ được gán sau khi upload
  duLieuKhuonMat: "",  // ← Sẽ được gán sau khi upload
});
const handleInputForm = (e) => {
  const { name, value } = e.target;
  setForm(prev => ({ ...prev, [name]: value }));
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

      <div className="mt-10 p-5 bg-white rounded shadow">
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
          <input
            value={form.hoTen}
            onChange={handleInputForm}
            type="text"
            placeholder="Nhập Họ Tên"
            className="input border border-gray-200 rounded-md p-4"
          />
          <input
            value={form.maTruong}
            onChange={handleInputForm}
            type="text"
            placeholder="Nhập Tên Trường"
            className="input border border-gray-200 rounded-md p-4"
          />
          <input
            value={form.maSV}
            onChange={handleInputForm}
            type="text"
            placeholder="Mã Số Sinh Viên"
            className="input border border-gray-200 rounded-md p-4"
          />
          <input
            value={form.diaChi}
            onChange={handleInputForm}
            type="text"
            placeholder="Quê Quán"
            className="input border border-gray-200 rounded-md p-4"
          />
          <input
            value={form.soDienThoai}
            onChange={handleInputForm}
            type="text"
            placeholder="Nhập Số Điện Thoại"
            className="input border border-gray-200 rounded-md p-4"
          />
          <input
            value={form.ngaySinh}
            onChange={handleInputForm}
            type="date"
            className="input border border-gray-200 rounded-md p-4"
          />
          <input
            value={form.viTri}
            onChange={handleInputForm}
            type="text"
            placeholder="Vị Trí Thực tập"
            className="input border border-gray-200 rounded-md p-4"
          />
          <input
            value={form.nganh}
            onChange={handleInputForm}
            type="text"
            placeholder="Chuyên Ngành"
            className="input border border-gray-200 rounded-md p-4"
          />
          <input
            value={form.email}
            onChange={handleInputForm}
            type="email"
            placeholder="Thêm Email"
            className="input border border-gray-200 rounded-md p-4 col-span-1"
          />
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
            <div className="w-full lg:w-[60%] lg:mx-auto border border-green-400 rounded-lg p-4 relative bg-green-50">
              <div className="flex items-center space-x-4">
                <FaFileAlt className="text-orange-400" />
                <div className="flex-1">
                  <p className="font-medium text-sm">{CVfile.name}</p>
                  <div className="w-full bg-gray-200 rounded h-2 mt-2">
                    <div
                      className="bg-green-500 h-2 rounded"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={handleRemove}
                  aria-label="Xóa file"
                >
                  <FaTrashCan className="w-5 h-5" />
                </button>
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
          <button className="px-4 py-2 border rounded text-black hover:bg-gray-100 cursor-pointer">
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
}

export default AddStudentPanel;
