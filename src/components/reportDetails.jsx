import { MdOutlineEmail } from "react-icons/md";
import { IoIosPrint } from "react-icons/io";
import avatar from "../assets/images/avatar.png";
import { RiShoppingBag3Line } from "react-icons/ri";
import { useEffect, useState } from "react";
import axiosClient from "../service/axiosClient";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import html2pdf from 'html2pdf.js';

function ReportDetails() {
  const { idSlug } = useParams();
  const [report, setReport] = useState();
  const [commentText, setCommentText] = useState("");


  useEffect(() => {
    axiosClient
      .get(`/bao-cao/${idSlug}`)
      .then((res) => {
        setReport(res.data.baoCao);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);




  const handleComment = async () => {
  if (!commentText.trim()) {
    Swal.fire({
      icon: "warning",
      title: "Chưa nhập nhận xét",
      text: "Vui lòng nhập nội dung nhận xét trước khi gửi.",
    });
    return;
  }

  try {
    const res = await axiosClient.post("/messages/conversation/find-or-create", {
      from_id: localStorage.getItem('maAdmin'),
      from_role: "admin",
      to_id: report?.sinh_vien?.maSV,
      to_role: "sinhvien",
    });

   const conversationId = res.data.conversation_id;
   const messageContent = `🔍 Nhận xét: ${report?.loai}

✍️ Nội dung:
${commentText.trim()}`;

    const message = {
      from_id: localStorage.getItem('maAdmin'),
      from_role: 'admin',
      to_id: report?.sinh_vien?.maSV,
      to_role: "sinhvien",
      type: "text",
      content: messageContent,
      conversation_id: conversationId,
    };

    await axiosClient.post("/messages", message);

    Swal.fire({
      icon: "success",
      title: "Đã gửi nhận xét",
      text: "Nhận xét đã được gửi đến sinh viên.",
    });

    setCommentText("");
  } catch (error) {
    console.error("Lỗi khi gửi nhận xét:", error);
    Swal.fire({
      icon: "error",
      title: "Gửi thất bại",
      text: "Không thể gửi nhận xét. Vui lòng thử lại.",
    });
  }
};

const handlePrintOrExport = () => {
        const sinhVienInfo = `
      <div style="margin-bottom: 20px; font-family: Arial, sans-serif;">
        <strong>Họ tên:</strong> ${report.sinh_vien.hoTen||"Nguyen Van A"}<br/>
        <strong>Mã sinh viên:</strong> ${report.sinh_vien.maSV||"123"}<br/>
        <strong>Vị trí:</strong> ${report.sinh_vien.viTri||"FE"}<br/>
      </div>
    `;
  Swal.fire({
    title: 'Bạn muốn thực hiện hành động nào?',
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: 'In báo cáo',
    denyButtonText: 'Xuất PDF',
    cancelButtonText: 'Hủy',
  }).then((result) => {
    if (result.isConfirmed) {
 
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head><title>Báo cáo</title></head>
           <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
          </style>
          <body>
          ${sinhVienInfo}
          ${report.noiDung}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    } else if (result.isDenied) {
         const tempDiv = document.createElement('div');
    tempDiv.innerHTML = `${sinhVienInfo}${report.noiDung}`;

    
    tempDiv.classList.add('pdf-content');

    document.body.appendChild(tempDiv);

    html2pdf()
      .set({
        margin: [10, 10, 10, 10], 
        filename: 'bao_cao.pdf',
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      })
      .from(tempDiv)
      .save()
      .then(() => {
        // Xóa khỏi DOM sau khi xuất
        document.body.removeChild(tempDiv);
      });
};
})}

  return (
    <div className="flex-1 border border-gray-100 p-4 sm:p-6 mt-6 sm:mt-5 rounded-md">


  {!report ? (
    <div className="text-center py-10">
      <p className="text-gray-500 text-lg">Đang tải báo cáo...</p>
    </div>
  ) : (
    <div className="">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between pb-5 border-b border-gray-300">
        {/* Avatar + Info */}
        <div className="flex gap-3 items-start sm:items-center">
          <img
            src={avatar}
            alt="avatar"
            className="w-20 aspect-square rounded-md border border-gray-300"
          />
          <div>
            <h1 className="text-xl font-bold">{report?.sinh_vien?.hoTen}</h1>
            <h4 className="flex items-center gap-1 text-base text-gray-600">
              <RiShoppingBag3Line className="text-xl" />
              {report?.sinh_vien?.viTri}
            </h4>
            <h4 className="flex items-center gap-1 text-base text-gray-600">
              <MdOutlineEmail className="text-xl" />
              {report?.sinh_vien?.email}
            </h4>
          </div>
        </div>

        {/* Print Button */}
        <div className="flex mt-4 sm:mt-0">
          <button
            onClick={handlePrintOrExport}
            className="cursor-pointer px-4 py-2 flex items-center gap-2 bg-[#34A853] rounded-md text-white"
          >
            <IoIosPrint className="text-xl" />
            In
          </button>
        </div>
      </div>

      {/* Nội dung chính */}
      <div className="max-w-[90vw] lg:max-w-screen overflow-hidden">
        <h1 className="mt-6 mb-3 text-xl font-bold sm:text-2xl">Báo Cáo Thực Tập</h1>

        <div className="">
          <div>
            <span className="font-semibold">Ngày Tạo: </span>
            <span>{new Date(report?.ngayTao).toLocaleDateString("vi-VN")}</span>
          </div>



          <span className="font-semibold mb-5 block">Nội dung
            :
          </span>
    <div className="max-w-[600px] lg:max-w-screen overflow-x-auto">
  <div
    className="min-w-[500px]"
    dangerouslySetInnerHTML={{ __html: report.noiDung }}
  ></div>
</div>


        </div>

        {/* Nhận xét */}
        <div className="mt-8">
          <h1 className="text-xl font-bold mb-4">Nhận xét</h1>
          <textarea
            className="w-full border border-gray-300 rounded-xl p-3 text-base focus:outline-0"
            name="comment"
             value={commentText}
             onChange={(e) => setCommentText(e.target.value)}
            rows="5"
            placeholder="Nhập nhận xét..."
          ></textarea>
          <div className="flex justify-end mt-3">
            <button onClick={handleComment} className="cursor-pointer px-4 py-2 bg-green-600 text-white rounded-md">
              Gửi Cho Sinh Viên
            </button>
          </div>
        </div>
      </div>
    </div>
  )}
</div>

  );
}

export default ReportDetails;
