import { useEffect, useState } from "react";
import axiosClient from "../service/axiosClient";
import Pagination from "./Pagination";
import Swal from "sweetalert2";
import { FaEdit, FaCheck, FaTrash, FaTrashAlt } from "react-icons/fa";
import { FaDeleteLeft, FaTrashCan } from "react-icons/fa6";
import { IoCamera } from "react-icons/io5";
import Avatar from "react-avatar";

function SchoolPanel() {
  const [schools, setSchools] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
const [editingId, setEditingId] = useState(null);
const [editedData, setEditedData] = useState({});
const [originalData, setOriginalData] = useState({});
  const [loading, setLoading] = useState(false)
const [logoFile, setLogoFile] = useState(null);
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
  }, [currentPage]);

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
  return (
    <div className="w-full mt-7">
      
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
        <>
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
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
              <tr key={school.id} className="bg-white border-b border-gray-200">
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
      </>
      )}

    </div>
  );
}

export default SchoolPanel;
