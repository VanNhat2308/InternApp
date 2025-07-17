import { useEffect, useState } from "react";
import axiosClient from "../service/axiosClient";
import Pagination from "./Pagination";
import Swal from "sweetalert2";
import { FaEdit } from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6";

function ViTriPanel() {
  const [positions, setPositions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [loading, setLoading] = useState(false)

  const fetchPositions = () => {
    setLoading(true)
    axiosClient
      .get("/vi-tris/ds", {
        params: { page: currentPage, per_page: perPage },
      })
      .then((res) => {
        setPositions(res.data.data.data);
        setTotalPages(res.data.data.last_page);
      })
      .catch((err) => console.error(err))
      .finally(()=>{
        setLoading(false)
      })
  };

  useEffect(() => {
    fetchPositions();
  }, [currentPage]);

  const handleEdit = (pos) => {
    setEditingId(pos.id);
    setEditedData({ tenViTri: pos.tenViTri });
    setOriginalData({ tenViTri: pos.tenViTri });
  };

  const handleChange = (value) => {
    setEditedData({ tenViTri: value });
  };

  const handleUpdate = async () => {
    if (editedData.tenViTri === originalData.tenViTri) {
      Swal.fire("Không có thay đổi nào!", "", "info");
      return;
    }

    try {
      await axiosClient.put(`/vi-tris/${editingId}`, editedData);
      Swal.fire("Cập nhật thành công!", "", "success");
      setEditingId(null);
      fetchPositions();
    } catch (err) {
      Swal.fire("Cập nhật thất bại", "", "error");
    }
  };

  const handleDelete = (id) => {
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
          ):(<>
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">ID</th>
              <th className="px-6 py-3">Tên Vị Trí</th>
              <th className="px-6 py-3">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((pos) => (
              <tr key={pos.id} className="bg-white border-b border-gray-200">
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">{pos.id}</td>
                <td className="px-6 py-4">
                  {editingId === pos.id ? (
                    <input
                      value={editedData.tenViTri}
                      onChange={(e) => handleChange(e.target.value)}
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
                        onClick={handleUpdate}
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
                        onClick={() => handleEdit(pos)}
                        className="cursor-pointer text-blue-600 hover:text-blue-800"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(pos.id)}
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
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />
      </>)}
    </div>
  );
}

export default ViTriPanel;
