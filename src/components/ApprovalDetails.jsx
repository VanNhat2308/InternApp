import { MdOutlineDone, MdOutlineEmail } from "react-icons/md";
import { RiShoppingBag3Line } from "react-icons/ri";
import avatar from "../assets/images/avatar.png";
import { MdOutlineCancel } from "react-icons/md";
import { useDialog } from "../context/dialogContext";
import { BsEyeFill, BsFillPeopleFill } from "react-icons/bs";
import { useToast } from "../context/toastContext";
import Toast from "./toast";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../service/axiosClient";
import { FaFileAlt } from "react-icons/fa";
import dayjs from "dayjs";
import "dayjs/locale/vi"; 
dayjs.locale("vi");

function ApprovalDetails() {
  const { showDialog } = useDialog();
  const { isToast, setToast, isToastV2, setToastV2 } = useToast();
  const { idSlug } = useParams();
  const [students, setStudent] = useState({});
  const apiBaseURL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const handleOpenDialogAppr = () => {
    showDialog({
      title: "Duyệt hồ sơ sinh viên",
      content:
        "Sau khi đồng ý duyệt hồ sơ sinh viên sẽ được duyệt. Hãy kiểm tra kỹ trước khi ấn",
      icon: <BsFillPeopleFill />,
      confirmText: "Có, duyệt hồ sơ",
      cancelText: "Không, tôi muốn kiểm tra lại",
      onConfirm: () => {
        handleApprove();
      },
    });
  };
  const handleOpenDialogDel = () => {
    showDialog({
      title: "Xóa hồ sơ sinh viên",
      content:
        "Sau khi xóa hồ sơ, dữ liệu sinh viên sẽ xóa khỏi hệ thống. Hãy kiểm tra kỹ trước khi ấn",
      icon: <BsFillPeopleFill />,
      confirmText: "xóa",
      cancelText: "Không, tôi muốn kiểm tra lại",
      onConfirm: () => {
        handleReject();
      },
    });
  };
  const fetchData = async () => {
    try {
      const studentRes = await axiosClient.get(
        `sinhviens/lay-thong-tin-ho-so/${idSlug}`
      );
      setStudent(studentRes.data.data);
    } catch (err) {
      console.log("Lỗi khi fetch dữ liệu:", err);
    }
  };
  useEffect(() => {
    if (idSlug) fetchData();
  }, [idSlug]);

  const getStatusColor = (status) => {
    if (!status) return "text-gray-500";

    const normalized = status.trim().toLowerCase();

    if (normalized === "đang thực tập") {
      return "text-green-500";
    }

    return "text-red-500";
  };
  // update
  const handleApprove = async () => {
    try {
      await axiosClient.post(`sinhviens/duyet-ho-so/${students.maSV}`);
      await fetchData(); // reload data mới nhất từ server
      setToast(true);
    } catch (error) {
      console.error("Lỗi khi duyệt hồ sơ:", error);
    }
  };

  const handleReject = async () => {
    try {
      await axiosClient.delete(`sinhviens/${students.maSV}`);
      setToastV2(true);
      // Option: navigate sau delay
      setTimeout(() => navigate("/admin/approval/approval-list"), 1000);
    } catch (error) {
      console.error("Lỗi khi từ chối (xoá sinh viên):", error);
    }
  };

  return (
<>
  {/* Toasts */}
  {isToast && (
    <Toast onClose={() => setToast(false)}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-green-400 flex items-center justify-center">
          <MdOutlineDone className="text-2xl text-green-400" />
        </div>
        <p>Hồ sơ sinh viên đã được duyệt!</p>
      </div>
    </Toast>
  )}

  {isToastV2 && (
    <Toast onClose={() => setToast(false)}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-green-400 flex items-center justify-center">
          <MdOutlineDone className="text-2xl text-green-400" />
        </div>
        <p>Hồ sơ sinh viên đã được xoá!</p>
      </div>
    </Toast>
  )}

  {/* Main Card */}
  <div className="border border-gray-300 p-4 mt-10 rounded-md shadow">
    {/* Header: avatar + buttons */}
    <div className="flex flex-col lg:flex-row items-center lg:justify-between gap-4 pb-5 border-b border-gray-300">
      <div className="flex items-start gap-4 w-full lg:w-auto">
        <img
          src={
            students.duLieuKhuonMat
              ? `${apiBaseURL}/${students.duLieuKhuonMat}`
              : avatar
          }
          alt="avatar"
          className="w-20 h-20 object-cover rounded-md border border-gray-300"
        />
        <div>
          <h1 className="text-xl font-bold">{students?.hoTen}</h1>
          <div className="flex items-center gap-2 text-gray-600">
            <RiShoppingBag3Line className="text-xl" />
            <span>{students?.viTri}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <MdOutlineEmail className="text-xl" />
            <span>{students?.email}</span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      {students?.ho_so?.trangThai === "Đã duyệt" ? (
        <div className="p-3 rounded-lg bg-green-500 text-white text-center text-lg font-bold">
          Đã duyệt
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={handleOpenDialogDel}
            className="flex items-center gap-2 border border-gray-300 rounded-md px-4 py-2"
          >
            <MdOutlineCancel className="text-xl" />
            Từ chối
          </button>
          <button
            onClick={handleOpenDialogAppr}
            className="flex items-center gap-2 bg-[#34A853] text-white rounded-md px-4 py-2"
          >
            <MdOutlineDone className="text-xl" />
            Duyệt
          </button>
        </div>
      )}
    </div>

    {/* Info Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      {[
        ["Họ Tên", students?.hoTen],
        ["Thời Gian Thực Tập", students?.thoiGianTT],
        ["Mã Số Sinh Viên", students?.maSV],
        ["Giáo Viên Hướng Dẫn", students?.tenGiangVien],
        ["Trường Đại Học", students?.truong?.tenTruong],
        ["Ngày Sinh",dayjs(students?.ngaySinh).format('DD/MM/YYYY')],
        ["Chuyên Ngành", students?.nganh],
        ["Vị Trí Ứng Tuyển", students?.viTri],
        [
          "Trạng Thái",
          <span className={getStatusColor(students?.trangThai)}>
            {students?.trangThai || "Không rõ"}
          </span>,
        ],
      ].map(([label, value], idx) => (
        <div key={idx} className="p-2 border-b border-gray-200">
          <p className="text-gray-400 text-sm">{label}</p>
          <p className="font-medium text-base">{value}</p>
        </div>
      ))}
    </div>

    {/* CV Section */}
    <div className="mt-8">
      <h2 className="text-lg font-semibold mb-3">CV Của Ứng Viên</h2>
      {students.cV ? (
        <div className="w-full lg:w-[60%] border border-green-400 rounded-lg p-4 bg-green-50">
          <div className="flex items-center gap-4">
            <FaFileAlt className="text-orange-400 text-2xl" />
            <span className="flex-1 text-sm font-medium truncate">
              {students.cV.split("/").pop()}
            </span>
            <button
              onClick={() =>
                window.open(`${apiBaseURL}/${students.cV}`, "_blank")
              }
              className="text-green-600"
            >
              <BsEyeFill className="text-xl" />
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500 italic">Không có CV</div>
      )}
    </div>
  </div>
</>

  );
}

export default ApprovalDetails;
