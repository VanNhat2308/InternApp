import { useEffect, useState } from "react";
import axiosClient from "../service/axiosClient";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";

function SwapSchedule() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const idSlug = useParams()

  const fetchRequests = async () => {
    try {
    const res = await axiosClient.get("/schedule-swaps", {
  params: {
    maSV: idSlug,
  },
});

      setRequests(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách yêu cầu:", error);
    } finally {
      setLoading(false);
    }
  };

const handleApprove = async (id) => {
  const confirm = window.confirm("Bạn có chắc chắn muốn duyệt yêu cầu này?");
  if (!confirm) return;

  try {
    await axiosClient.put(`/schedule-swaps/${id}/status`, {
      status: "approved",
    });
    fetchRequests(); // Làm mới danh sách
  } catch (error) {
    console.error("Lỗi duyệt yêu cầu:", error);
  }
};

const handleReject = async (id) => {
  const confirm = window.confirm("Bạn có chắc chắn muốn từ chối yêu cầu này?");
  if (!confirm) return;

  try {
    await axiosClient.put(`/schedule-swaps/${id}/status`, {
      status: "rejected",
    });
    fetchRequests(); // Làm mới danh sách
  } catch (error) {
    console.error("Lỗi từ chối yêu cầu:", error);
  }
};
const getStatusLabel = (status) => {
  switch (status) {
    case "pending":
      return "Chờ duyệt";
    case "approved":
      return "Đã duyệt";
    case "rejected":
      return "Từ chối";
    default:
      return "Không rõ";
  }
};


  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="flex-1">
      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <table className="w-full border border-gray-300 text-sm mt-7">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-3 py-2">STT</th>
              <th className="border px-3 py-2">Mã SV</th>
              <th className="border px-3 py-2">Ca hiện tại</th>
              <th className="border px-3 py-2">Ca muốn đổi</th>
              <th className="border px-3 py-2">Lý do</th>
              <th className="border px-3 py-2">Hình thức</th>
              <th className="border px-3 py-2">Trạng thái</th>
              <th className="border px-3 py-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  Không có yêu cầu nào.
                </td>
              </tr>
            ) : (
              requests.map((req, index) => (
                <tr key={req.id}>
                  <td className="border px-3 py-2">{index + 1}</td>
                  <td className="border px-3 py-2">{req.maSV}</td>
                  <td className="border px-3 py-2">
                    {dayjs(req.old_date).format("DD/MM/YYYY")} ({req.old_shift})
                  </td>
                  <td className="border px-3 py-2">
                    {req.change_type === "nghi"
                      ? "Nghỉ"
                      : `${dayjs(req.new_date).format("DD/MM/YYYY")} (${req.new_shift})`}
                  </td>
                  <td className="border px-3 py-2">{req.reason}</td>
                  <td className="border px-3 py-2">
                    {req.change_type === "doi" ? "Đổi ca" : "Nghỉ"}
                  </td>
                  <td className="border px-3 py-2 text-center capitalize">
                    {getStatusLabel(req.status)}
                  </td>
                  <td className="border px-3 py-2 text-center space-x-2">
                    {req.status === "pending" ? (
                      <>
                        <button
                          onClick={() => handleApprove(req.id)}
                          className="bg-green-600 text-white px-2 py-1 rounded text-xs"
                        >
                          Duyệt
                        </button>
                        <button
                          onClick={() => handleReject(req.id)}
                          className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                        >
                          Từ chối
                        </button>
                      </>
                    ) : (
                      <span className="text-gray-400 text-xs">Đã xử lý</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default SwapSchedule;
