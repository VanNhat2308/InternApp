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
      {isToast ? (
        <Toast onClose={() => setToast(false)}>
          <div className="flex items-center gap-3">
            <div className="w-15 aspect-square rounded-full border-2 border-green-400 flex items-center justify-center">
              <MdOutlineDone className="text-2xl text-green-400" />
            </div>
            <p>Hồ sơ sinh viên đã được duyệt !</p>
          </div>
        </Toast>
      ) : (
        ""
      )}
      {isToastV2 ? (
        <Toast onClose={() => setToast(false)}>
          <div className="flex items-center gap-3">
            <div className="w-15 aspect-square rounded-full border-2 border-green-400 flex items-center justify-center">
              <MdOutlineDone className="text-2xl text-green-400" />
            </div>
            <p>Hồ sơ sinh viên đã được xoá !</p>
          </div>
        </Toast>
      ) : (
        ""
      )}

      <div className="border border-gray-300 p-4 mt-10 rounded-md shadow">
        <div className="flex flex-col items-center pb-5 border-b border-gray-300 lg:flex-row lg:justify-between">
          {/* avartar */}
          <div className="flex gap-2 ">
            <img
              src={
                students.duLieuKhuonMat
                  ? `${apiBaseURL}/${students.duLieuKhuonMat}`
                  : avatar
              }
              alt="avartar"
              className="w-20 aspect-square rounded-md border border-gray-300 object-cover"
            />
            <div>
              <h1 className="text-xl font-bold">{students?.hoTen}</h1>
              <h4
                className="flex
                items-center gap-1 text-lg text-gray-600"
              >
                <RiShoppingBag3Line className="text-2xl" /> {students?.viTri}
              </h4>
              <h4
                className="flex
                items-center gap-1 text-lg text-gray-600"
              >
                <MdOutlineEmail className="text-2xl" />
                {students?.email}
              </h4>
            </div>
          </div>
          {students?.ho_so?.trangThai === "Đã duyệt" ? (
            <div className="p-4 rounded-lg bg-green-500 text-white text-xl font-bold">
              Đã duyệt
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleOpenDialogDel}
                className="cursor-pointer p-3 flex items-center gap-2 border border-gray-300 rounded-md"
              >
                <MdOutlineCancel className="text-xl" />
                Từ chối
              </button>
              <button
                onClick={handleOpenDialogAppr}
                className="cursor-pointer p-3 flex items-center gap-2 bg-[#34A853] rounded-md text-white"
              >
                <MdOutlineDone className="text-xl" />
                Duyệt
              </button>
            </div>
          )}
        </div>
        {/* main ct */}
        <div>
          <div className="grid grid-cols-2 gap-6 text-sm flex-1">
            <div className="p-2 border-b border-gray-300">
              <p className="text-gray-400">Họ Tên</p>
              <p className="font-medium text-lg">{students?.hoTen}</p>
            </div>

            <div className="p-2 border-b border-gray-300">
              <p className="text-gray-400">Thời Gian Thực Tập</p>
              <p className="font-medium text-lg">{students?.thoiGianTT}</p>
            </div>

            <div className="p-2 border-b border-gray-300">
              <p className="text-gray-400">Mã Số Sinh Viên</p>
              <p className="font-medium text-lg">{students?.maSV}</p>
            </div>

            <div className="p-2 border-b border-gray-300">
              <p className="text-gray-400">Giáo Viên Hướng Dẫn</p>
              <p className="font-medium text-lg">{students?.tenGiangVien}</p>
            </div>

            <div className="p-2 border-b border-gray-300">
              <p className="text-gray-400">Trường Đại Học</p>
              <p className="font-medium text-lg">
                {students?.truong?.tenTruong}
              </p>
            </div>

            <div className="p-2 border-b border-gray-300">
              <p className="text-gray-400">Ngày Sinh</p>
              <p className="font-medium text-lg">{students?.ngaySinh}</p>
            </div>

            <div className="p-2 border-b border-gray-300">
              <p className="text-gray-400">Chuyên Ngành</p>
              <p className="font-medium text-lg">{students?.nganh}</p>
            </div>

            <div className="p-2 border-b border-gray-300">
              <p className="text-gray-400">Vị Trí Ứng Tuyển</p>
              <p className="font-medium text-lg">{students?.viTri}</p>
            </div>

            <div className="p-2 border-b border-gray-300">
              <p className="text-gray-400">Trạng Thái</p>
              <p
                className={`font-medium text-lg ${getStatusColor(
                  students?.trangThai
                )}`}
              >
                {students?.trangThai || "Không rõ"}
              </p>
            </div>
          </div>
          <div className="mt-7">
            <h2 className="text-lg font-semibold">CV Của Ứng Viên</h2>
            {/* cv here */}
            {students.cV ? (
              <div className="w-full lg:w-[60%] lg:mx-auto border border-green-400 rounded-lg p-4 relative bg-green-50">
                <div className="flex items-center space-x-4">
                  <FaFileAlt className="text-orange-400" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      {students.cV.split("/").pop()}
                    </p>
                  </div>
                  <div className="flex gap-1 items-center">
                    <button
                      className="cursor-pointer text-green-500"
                      onClick={() => {
                        window.open(`${apiBaseURL}/${students.cV}`, "_blank");
                      }}
                      aria-label="Xem file"
                    >
                      <BsEyeFill className="text-2xl" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 italic mt-4">
                Không có CV
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ApprovalDetails;
