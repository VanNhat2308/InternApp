import { useEffect, useState } from "react";
import { FaEdit, FaListUl, FaUniversity, FaUserPlus } from "react-icons/fa";
import axiosClient from "../service/axiosClient";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { IoCamera } from "react-icons/io5";
import Pagination from "./Pagination";
import { FaTrashCan } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
function AddSchoolAndPostion() {
      const [searchTermPos, setSearchTermPos] = useState('');
      const [searchTermSchool, setSearchTermSchool] = useState('');
      const navigate = useNavigate()
      const [avatarFile, setAvatarFile] = useState(null);
      const [avatarFilePreview, setAvatarFilePreview] = useState(null);
      const [isAddingSchool, setIsAddingSchool] = useState(true); 
        const [schools, setSchools] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
const [editingId, setEditingId] = useState(null);
const [editedData, setEditedData] = useState({});
const [originalData, setOriginalData] = useState({});
  const [loading, setLoading] = useState(false)
const [logoFile, setLogoFile] = useState(null);
const [positions, setPositions] = useState([]);
  const [currentPagePos, setCurrentPagePos] = useState(1);
  const [perPagePos] = useState(10);
  const [totalPagesPos, setTotalPagesPos] = useState(1);
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
    fetchSchools()
  } catch (error) {
 let message = "Lỗi khi thêm trường."; // mặc định

  if (error.response && error.response.data) {
    // Trường hợp Laravel validate
    if (error.response.data.errors) {
      // Lấy message của field đầu tiên
      message = Object.values(error.response.data.errors)[0][0];
    }
    // Trường hợp Laravel trả về 'message' riêng
    else if (error.response.data.message) {
      message = error.response.data.message;
    }
  }

  Swal.fire("Thất bại!", message, "error");
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
          fetchPositions()
        } catch (error) {
          let message = "Lỗi khi thêm vị trí."; // mặc định

  if (error.response && error.response.data) {
    // Trường hợp Laravel validate
    if (error.response.data.errors) {
      // Lấy message của field đầu tiên
      message = Object.values(error.response.data.errors)[0][0];
    }
    // Trường hợp Laravel trả về 'message' riêng
    else if (error.response.data.message) {
      message = error.response.data.message;
    }
  }

  Swal.fire("Thất bại!", message, "error");
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


const handleLogoChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setLogoFile(file);
    setEditedData((prev) => ({ ...prev, logo: file }));
  }
};


  const fetchSchools = () => {
    setLoading(true)
    axiosClient
      .get("/truongs/ds", {
        params: {
          page: currentPage,
          per_page: perPage,
          search: searchTermSchool
        },
      })
      .then((res) => {
        setSchools(res.data.data.data);
        setTotalPages(res.data.data.last_page);
      })
      .catch((err) => console.error(err))
      .finally(()=>{
        setLoading(false)
      })
  };

  useEffect(() => {
    fetchSchools();
  }, [currentPage,searchTermSchool]);

const handleEdit = (school) => {
  setEditingId(school.id);
  setEditedData({
    maTruong: school.maTruong,
    tenTruong: school.tenTruong,
    moTa: school.moTa,
  });
  setOriginalData({
    maTruong: school.maTruong,
    tenTruong: school.tenTruong,
    moTa: school.moTa,
  });
};

  const handleChange = (field, value) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };


const handleUpdate = async () => {
  const isUnchanged = JSON.stringify(editedData) === JSON.stringify(originalData);
  if (isUnchanged && !logoFile) {
    Swal.fire("Không có thay đổi nào!", "Bạn chưa thay đổi thông tin nào.", "info");
    return;
  }

  try {
    let logoUrl = editedData.logo;

    if (logoFile) {
      const formData = new FormData();
      formData.append("logo", logoFile);

      const uploadRes = await axiosClient.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      logoUrl = uploadRes.data?.paths?.logo;
    }

    await axiosClient.put(`/truongs/${editingId}`, {
      ...editedData,
      logo: logoUrl,
    });

    Swal.fire("Cập nhật thành công!", "", "success");
    setEditingId(null);
    setEditedData({});
    setLogoFile(null);
    fetchSchools();
  } catch (err) {
    Swal.fire("Cập nhật thất bại", err?.response?.data?.message || "Lỗi không xác định", "error");
  }
};



const handleDelete = (id) => {
  Swal.fire({
    title: "Xác nhận xóa",
    text: "Bạn có chắc chắn muốn xóa trường này không?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Xóa",
    cancelButtonText: "Hủy",
  }).then((result) => {
    if (result.isConfirmed) {
      axiosClient
        .delete(`/truongs/${id}`)
        .then(() => {
          Swal.fire("Đã xóa!", "Trường đã được xóa thành công.", "success");
          fetchSchools(); // Làm mới danh sách sau khi xóa
        })
        .catch((err) => {
          Swal.fire(
            "Lỗi!",
            err?.response?.data?.message || "Xóa thất bại.",
            "error"
          );
        });
    }
  });
};

// position
  const fetchPositions = () => {
    setLoading(true)
    axiosClient
      .get("/vi-tris/ds", {
        params: { page: currentPage, per_page: perPage,search: searchTermPos },
      })
      .then((res) => {
        setPositions(res.data.data.data);
        setTotalPagesPos(res.data.data.last_page);
      })
      .catch((err) => console.error(err))
      .finally(()=>{
        setLoading(false)
      })
  };

    useEffect(() => {
    fetchPositions();
  }, [currentPagePos,searchTermPos]);

 const handleEditPos = (pos) => {
    setEditingId(pos.id);
    setEditedData({ tenViTri: pos.tenViTri });
    setOriginalData({ tenViTri: pos.tenViTri });
  };

  const handleChangePos = (value) => {
    setEditedData({ tenViTri: value });
  };

  const handleUpdatePos = async () => {
    if (editedData.tenViTri === originalData.tenViTri) {
      Swal.fire("Không có thay đổi nào!", "", "info");
      return;
    }

    try {
      await axiosClient.put(`/vi-tris/${editingId}`, editedData);
      Swal.fire("Cập nhật thành công!", "", "success");
      setEditingId(null);
      fetchPositions();
    } catch (error) {
      let message = "Lỗi khi thêm vị trí."; // mặc định

  if (error.response && error.response.data) {
    // Trường hợp Laravel validate
    if (error.response.data.errors) {
      // Lấy message của field đầu tiên
      message = Object.values(error.response.data.errors)[0][0];
    }
    // Trường hợp Laravel trả về 'message' riêng
    else if (error.response.data.message) {
      message = error.response.data.message;
    }
  }

  Swal.fire("Thất bại!", message, "error");
    }
  };

  const handleDeletePos = (id) => {
    Swal.fire({
      title: "Xác nhận xóa",
      text: "Bạn có chắc chắn muốn xóa vị trí này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosClient
          .delete(`/vi-tris/${id}`)
          .then(() => {
            Swal.fire("Đã xóa!", "", "success");
            fetchPositions();
          })
          .catch(() => Swal.fire("Xóa thất bại!", "", "error"));
      }
    });
  };


    return ( 
    <div className="flex-1 flex flex-col">
<div className=" mt-5 mb-5 lg:my-4">
  <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500">
    <li className="me-2">
      <button
        onClick={() => setIsAddingSchool(true)}
        className={`cursor-pointer inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg group ${
          isAddingSchool
            ? "text-green-600 border-green-600 dark:text-green-500 dark:border-green-500"
            : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
        }`}
      >
        <svg
          className={`w-4 h-4 me-2 ${
            isAddingSchool
              ? "text-green-600 dark:text-green-500"
              : "text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
        </svg>
        Thêm Trường
      </button>
    </li>
    <li className="me-2">
      <button
        onClick={() => setIsAddingSchool(false)}
        className={`cursor-pointer inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg group ${
          !isAddingSchool
            ? "text-green-600 border-green-600 dark:text-green-500 dark:border-green-500"
            : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
        }`}
      >
        <svg
          className={`w-4 h-4 me-2 ${
            !isAddingSchool
              ? "text-green-600 dark:text-green-500"
              : "text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"
          }`}
          fill="currentColor"
          viewBox="0 0 18 18"
        >
          <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
        </svg>
        Thêm Vị trí
      </button>
    </li>
  </ul>
</div>






    {isAddingSchool ? (
  // FORM THÊM TRƯỜNG
  <div className="h-full lg:border border-gray-100 lg:p-4 rounded-md">
        {/* Search */}
          <div className="relative flex-1 mb-5 w-full">
            <input
              value={searchTermSchool}
              onChange={(e) => setSearchTermSchool(e.target.value)}
              type="text"
              placeholder="Tìm kiếm..."
              className="w-full border border-gray-300 pl-10 pr-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-200 transition"
            />
            <FiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
          </div>
     <div className="w-full">
          
            {loading? (
                <div className="flex justify-center items-center py-10">
            <div role="status">
        <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-green-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
        <span className="sr-only">Loading...</span>
    </div>
            </div>
              )
          :(
            <div className="max-w-screen">
          <div className="relative overflow-x-auto max-h-[500px] overflow-y-auto">
       
  <table className=" min-w-[700px] w-full text-sm text-left rtl:text-right text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-200 ">
                <tr>
                  <th className="px-6 py-3 text-left">Logo</th>
                  <th className="px-6 py-3 text-left">Mã Trường</th>
                  <th className="px-6 py-3 text-left">Tên Trường</th>
                  <th className="px-6 py-3 text-left">Mô Tả</th>
                  <th className="px-6 py-3">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {schools.map((school) => (
                  <tr key={school.id} className="bg-white border-b border-gray-200 hover:bg-gray-100 transition duration-150">
    <td className="px-6 py-4">
      {editingId === school.id ? (
        <div className="flex flex-col">
          <label htmlFor="logo-upload" className="cursor-pointer relative">
            {editedData.logo ? (
              <img
                src={
                  typeof editedData.logo === "string"
                    ? import.meta.env.VITE_API_BASE_URL + "/" + editedData.logo
                    : URL.createObjectURL(editedData.logo)
                }
                alt="Logo preview"
                className="w-16 h-16 rounded-xl object-cover border border-gray-300 shadow"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-blue-100 border border-blue-300 flex items-center justify-center">
                <IoCamera className="text-2xl text-blue-600" />
              </div>
            )}
            <input
              id="logo-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoChange}
            />
          </label>
        </div>
      ) : school.logo ? (
        <img
          src={`${import.meta.env.VITE_API_BASE_URL}/${school.logo}`}
          alt="Logo"
          className="w-12 h-12 object-cover rounded"
        />
      ) : (
        <span className="text-gray-400 italic">Chưa có</span>
      )}
    </td>
    
    
    
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {editingId === school.id ? (
                        <input
                          value={editedData.maTruong}
                          onChange={(e) => handleChange("maTruong", e.target.value)}
                          className="border px-2 py-1 rounded w-full"
                        />
                      ) : (
                        school.maTruong
                      )}
                    </td>
                    <td className="px-6 py-4 ">
                      {editingId === school.id ? (
                        <input
                          value={editedData.tenTruong}
                          onChange={(e) => handleChange("tenTruong", e.target.value)}
                          className="border px-2 py-1 rounded w-full"
                        />
                      ) : (
                        school.tenTruong
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === school.id ? (
                        <input
                          value={editedData.moTa}
                          onChange={(e) => handleChange("moTa", e.target.value)}
                          className="border px-2 py-1 rounded w-full"
                        />
                      ) : (
                        school.moTa
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === school.id ? (
      <div className="flex items-center gap-2">
        <button
          onClick={handleUpdate}
          className="px-3 py-1 text-white bg-green-600 rounded hover:bg-green-700 text-sm"
        >
          Lưu
        </button>
        <button
          onClick={() => {
            setEditingId(null);
            setEditedData({});
          }}
          className="px-3 py-1 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 text-sm"
        >
          Hủy
        </button>
      </div>
    ) : (
                    <div className="flex gap-2 h-full">
      {/* Nút chỉnh sửa */}
      <button
        onClick={() => handleEdit(school)}
        className="cursor-pointer rounded hover:bg-blue-100 text-blue-600"
        title="Chỉnh sửa"
      >
        <FaEdit />
      </button>
    
      {/* Nút xóa */}
      <button
        onClick={() => handleDelete(school.id)}
        className="cursor-pointer rounded hover:bg-red-100 text-red-600"
        title="Xóa"
      >
        <FaTrashCan />
      </button>
    </div>
    
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
    
       
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
          </div>
          )}
    
        </div>
    <div className="p-2 lg:0">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-green-700">
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
      <form onSubmit={handleSchoolSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Mã Trường"
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-200 focus:shadow-md"
          value={schoolData.maTruong}
          onChange={(e) =>
            setSchoolData({ ...schoolData, maTruong: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Tên Trường"
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-200 focus:shadow-md"
          value={schoolData.tenTruong}
          onChange={(e) =>
            setSchoolData({ ...schoolData, tenTruong: e.target.value })
          }
        />
        <textarea
          placeholder="Mô tả"
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-200 focus:shadow-md"
          value={schoolData.moTa}
          onChange={(e) =>
            setSchoolData({ ...schoolData, moTa: e.target.value })
          }
        ></textarea>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Lưu Trường
        </button>
      </form>
    </div>
       
  </div>
) : (
  // FORM THÊM VỊ TRÍ
  <div className="flex-1 lg:border border-gray-100 lg:p-4 rounded-md">
     {/* Search */}
          <div className="relative flex-1 mb-5 w-full">
            <input
              value={searchTermPos}
              onChange={(e) => setSearchTermPos(e.target.value)}
              type="text"
              placeholder="Tìm kiếm..."
              className="w-full border border-gray-300 pl-10 pr-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-200 transition"
            />
            <FiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
          </div>
     <div className="w-full">
      {loading? (
            <div className="flex justify-center items-center py-10">
        <div role="status">
    <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-green-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
    <span className="sr-only">Loading...</span>
</div>
        </div>
          ):(
          <div className="max-w-screen">
      <div className="relative overflow-x-auto max-h-[500px] overflow-y-auto">
        <table className="min-w-[700px] w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">ID</th>
              <th className="px-6 py-3">Tên Vị Trí</th>
              <th className="px-6 py-3">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((pos) => (
              <tr key={pos.id} className="bg-white border-b border-gray-200 hover:bg-gray-100 transition duration-150">
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">{pos.id}</td>
                <td className="px-6 py-4">
                  {editingId === pos.id ? (
                    <input
                      value={editedData.tenViTri}
                      onChange={(e) => handleChangePos(e.target.value)}
                      className="border px-2 py-1 rounded w-full"
                    />
                  ) : (
                    pos.tenViTri
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingId === pos.id ? (
                    <div className="flex gap-2">
                      <button
                        onClick={handleUpdatePos}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        Lưu
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setEditedData({});
                        }}
                        className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300"
                      >
                        Hủy
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditPos(pos)}
                        className="cursor-pointer text-blue-600 hover:text-blue-800"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeletePos(pos.id)}
                        className="cursor-pointer text-red-600 hover:text-red-800"
                      >
                        <FaTrashCan />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPagePos}
        setCurrentPage={setCurrentPagePos}
        totalPages={totalPagesPos}
      />
      </div>)}
    </div>
   
   {/*  */}
    <div className="lg: p-2">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-green-700">
        <FaUserPlus /> Thêm Vị trí Tuyển Dụng
      </h2>
      <form onSubmit={handlePositionSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Tên Vị trí"
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-200 focus:shadow-md"
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
  </div>
)}

    </div> 
    )
}

export default AddSchoolAndPostion;