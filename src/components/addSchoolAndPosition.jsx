import { useEffect, useState } from "react";
import { FaListUl, FaUniversity, FaUserPlus } from "react-icons/fa";
import axiosClient from "../service/axiosClient";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { IoCamera } from "react-icons/io5";
function AddSchoolAndPostion() {
      const navigate = useNavigate()
        const [avatarFile, setAvatarFile] = useState(null);
  const [avatarFilePreview, setAvatarFilePreview] = useState(null);

      const [schoolData, setSchoolData] = useState({
        maTruong: "",
        tenTruong: "",
        moTa: "",
      });
    
      // Form thêm Vị trí
    const [position, setPosition] = useState("");
    
    const validateSchoolData = (data) => {
      const errors = [];
    
      if (!data.maTruong.trim()) {
        errors.push("Mã trường không được để trống.");
      }
    
      if (!data.tenTruong.trim()) {
        errors.push("Tên trường không được để trống.");
      }
    
      // moTa có thể nullable, không cần kiểm tra
    
      return errors;
    };
    
    
    const validatePosition = (position) => {
      if (!position.trim()) {
        return ["Tên vị trí không được để trống."];
      }
    
      return [];
    };
    
    
    // const handleSchoolSubmit = async (e) => {
    //   e.preventDefault();
    
    //   const errors = validateSchoolData(schoolData);
    //   if (errors.length > 0) {
    //     Swal.fire("Lỗi dữ liệu", errors.join("<br>"), "warning");
    //     return;
    //   }
    
    //   const confirm = await Swal.fire({
    //     title: "Xác nhận thêm trường?",
    //     text: "Bạn có chắc chắn muốn thêm trường này không?",
    //     icon: "question",
    //     showCancelButton: true,
    //     confirmButtonText: "Thêm",
    //     cancelButtonText: "Hủy",
    //   });
    
    //   if (confirm.isConfirmed) {
    //     try {
    //       await axiosClient.post("/truongs", schoolData);
    //       Swal.fire("Thành công!", "Đã thêm trường.", "success");
    //       setSchoolData({ maTruong: "", tenTruong: "", moTa: "" });
    //     } catch (error) {
    //       Swal.fire("Thất bại!", "Lỗi khi thêm trường.", "error");
    //     }
    //   }
    // };
    

  const handleSchoolSubmit = async (e) => {
  e.preventDefault();

  const errors = validateSchoolData(schoolData);
  if (errors.length > 0) {
    Swal.fire("Lỗi dữ liệu", errors.join("<br>"), "warning");
    return;
  }

  const confirm = await Swal.fire({
    title: "Xác nhận thêm trường?",
    text: "Bạn có chắc chắn muốn thêm trường này không?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Thêm",
    cancelButtonText: "Hủy",
  });

  if (!confirm.isConfirmed) return;

  try {
    let logoPath = null;

    if (avatarFile) {
      const { logo } = await handleUpload(); // 👈 Upload logo trước
      logoPath = logo;
    }

    const dataToSubmit = {
      ...schoolData,
      logo: logoPath, 
    };

    await axiosClient.post("/truongs", dataToSubmit);
    Swal.fire("Thành công!", "Đã thêm trường.", "success");
    setSchoolData({ maTruong: "", tenTruong: "", moTa: "" });
    setAvatarFile(null);
    setAvatarFilePreview(null);
  } catch (error) {
    Swal.fire("Thất bại!", "Lỗi khi thêm trường.", "error");
  }
};

    const handlePositionSubmit = async (e) => {
      e.preventDefault();
    
      const errors = validatePosition(position);
      if (errors.length > 0) {
        Swal.fire("Lỗi dữ liệu", errors.join("<br>"), "warning");
        return;
      }
    
      const confirm = await Swal.fire({
        title: "Xác nhận thêm vị trí?",
        text: "Bạn có chắc chắn muốn thêm vị trí này không?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Thêm",
        cancelButtonText: "Hủy",
      });
    
      if (confirm.isConfirmed) {
        try {
          await axiosClient.post("/vi-tris", { tenViTri: position });
          Swal.fire("Thành công!", "Đã thêm vị trí.", "success");
          setPosition("");
        } catch (error) {
          Swal.fire("Thất bại!", "Lỗi khi thêm vị trí.", "error");
        }
      }
    };



      //  avatar logic
  const handleChangeAvatar = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file)
      setAvatarFilePreview(URL.createObjectURL(file)); // Hiển thị ảnh
      
    }
  };


  const handleUpload = async () => {
  const formData = new FormData();

  if (avatarFile) formData.append("logo", avatarFile);

  try {
    const res = await axiosClient.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (e) => {
        const percent = Math.round((e.loaded * 100) / e.total);
        setProgress(percent);
      },
    });

    console.log("Response data upload:", res.data);
    const { logo } = res.data.paths || res.data;

    return { logo };
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.errors?.logo?.[0] ||
      error.message ||
      "Đã xảy ra lỗi khi upload.";

    alert("Lỗi upload: " + message);
    throw error;
  }
};


    return ( 
    <>

  <div className="flex gap-4 justify-end my-8">
    <button
      onClick={() => navigate("/admin/addInfo/list-schools")}
      className="cursor-pointer flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
    >
      <FaUniversity />
      Danh sách Trường
    </button>
    <button
      onClick={() => navigate("/admin/addInfo/list-positions")}
      className="cursor-pointer flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
    >
      <FaListUl />
      Danh sách Vị trí
    </button>
  </div>


         {/* Form Thêm Trường */}
      <div className="mb-8 border border-gray-300 p-4 rounded-md shadow">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-700">
          <FaUniversity /> Thêm Trường
        </h2>
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
                <div className="w-24 h-24 rounded-xl bg-blue-100 border border-blue-300 flex items-center justify-center">
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
        <form onSubmit={handleSchoolSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Mã Trường"
            className="w-full p-2 border border-gray-300 rounded"
            value={schoolData.maTruong}
            onChange={(e) =>
              setSchoolData({ ...schoolData, maTruong: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Tên Trường"
            className="w-full p-2 border border-gray-300 rounded"
            value={schoolData.tenTruong}
            onChange={(e) =>
              setSchoolData({ ...schoolData, tenTruong: e.target.value })
            }
          />
          <textarea
            placeholder="Mô tả"
            className="w-full p-2 border border-gray-300 rounded"
            value={schoolData.moTa}
            onChange={(e) =>
              setSchoolData({ ...schoolData, moTa: e.target.value })
            }
          ></textarea>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Lưu Trường
          </button>
        </form>
      </div>

      {/* Form Thêm Vị trí */}
      <div className="border border-gray-300 p-4 rounded-md shadow">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-green-700">
          <FaUserPlus /> Thêm Vị trí Tuyển Dụng
        </h2>
        <form onSubmit={handlePositionSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Tên Vị trí"
            className="w-full p-2 border border-gray-300 rounded"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Lưu Vị trí
          </button>
        </form>
      </div>
    </> 
    )
}

export default AddSchoolAndPostion;