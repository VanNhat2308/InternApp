import { BsDownload } from "react-icons/bs";
import { useDialog } from "../context/dialogContext";
import { useToast } from "../context/toastContext";
import Toast from "./toast";
import { MdOutlineDone, MdOutlineEmail } from "react-icons/md";
import { IoIosPrint } from "react-icons/io";
import avatar from "../assets/images/avatar.png";
import { RiShoppingBag3Line } from "react-icons/ri";
import { HiOutlineDocumentText } from "react-icons/hi2";
import PaginatedContent from "./pagenatedContent";
import { FiDownload } from "react-icons/fi";
import { useEffect, useState } from "react";
import axiosClient from "../service/axiosClient";
import { useParams } from "react-router-dom";
import FilePreviewAuto from "./FilePreviewAuto";

function ReportDetails() {
  const { showDialog } = useDialog();
  const { isToast, setToast, isToastV2, setToastV2 } = useToast();
  const { idSlug } = useParams();

  const [report, setReport] = useState();

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

  const handleOpenDialog = () => {
    showDialog({
      title: "Báo Cáo Thực Tập",
      customContent: (
        <>
          <div className="flex items-center">
            <span className="text-xl font-semibold min-w-[150px]">Ngày</span>
            <span className="text-xl">{report.ngayTao}</span>
          </div>
          <div className="flex items-center mt-2">
            <span className="text-xl font-semibold min-w-[150px]">
              Công việc
            </span>
            <span className="text-xl">{report.loai}</span>
          </div>
          <div className="flex mt-2 max-h-[60vh] overflow-y-scroll">
            <span className="text-xl font-semibold min-w-[150px]">
              Nội dung
            </span>
            <PaginatedContent text={report.noiDung} maxCharsPerPage={500} />
          </div>
        </>
      ),
      confirmPrintText: "1",

      onPrint: () => {
        const printWindow = window.open("", "_blank");
        const reportHTML = `
    <html>
      <head>
        <title>Báo Cáo Thực Tập</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { text-align: center; }
          .info { margin-bottom: 20px; }
          .label { font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>BÁO CÁO THỰC TẬP</h1>
        <div class="info"><span class="label">Họ tên:</span> ${
          report.sinh_vien.hoTen
        }</div>
        <div class="info"><span class="label">Ngày tạo:</span> ${new Date(
          report.ngayTao
        ).toLocaleDateString("vi-VN")}</div>
        <div class="info"><span class="label">Loại:</span> ${report.loai}</div>
        <div><span class="label">Nội dung:</span><br/><br/><div>${
          report.noiDung
        }</div></div>
      </body>
    </html>
  `;

        printWindow.document.write(reportHTML);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();

        setToast(true);
      },
      onDownload: () => {
        const fileUrl = `${import.meta.env.VITE_API_BASE_URL}/${
          report.tepDinhKem
        }`;
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = report.tepDinhKem.split("/").pop(); // tên file
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setToastV2(true);
      },
    });
  };
  return (
    <>
      {isToast ? (
        <Toast onClose={() => setToast(false)}>
          <div className="flex items-center gap-3">
            <div className="w-15 aspect-square rounded-full border-2 border-green-400 flex items-center justify-center">
              <MdOutlineDone className="text-2xl text-green-400" />
            </div>
            <p>Báo cáo đã được in thành công !!</p>
          </div>
        </Toast>
      ) : (
        ""
      )}
      {isToastV2 ? (
        <Toast onClose={() => setToastV2(false)}>
          <div className="flex items-center gap-3">
            <div className="w-15 aspect-square rounded-full border-2 border-green-400 flex items-center justify-center">
              <FiDownload className="text-2xl text-green-400" />
            </div>
            <p>Tải về báo cáo thành công!</p>
          </div>
        </Toast>
      ) : (
        ""
      )}

      {!report ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">Đang tải báo cáo...</p>
        </div>
      ) : (
        <div className="border border-gray-300 p-4 mt-10 rounded-md shadow">
          <div className="flex flex-col items-center pb-5 border-b border-gray-300 lg:flex-row lg:justify-between">
            {/* avartar */}
            <div className="flex gap-2 ">
              <img
                src={avatar}
                alt="avartar"
                className="w-20 aspect-square rounded-md border border-gray-300"
              />
              <div>
                <h1 className="text-xl font-bold">
                  {report?.sinh_vien?.hoTen}
                </h1>
                <h4
                  className="flex
                        items-center gap-1 text-lg text-gray-600"
                >
                  <RiShoppingBag3Line className="text-2xl" />
                  {report?.sinh_vien?.viTri}
                </h4>
                <h4
                  className="flex
                        items-center gap-1 text-lg text-gray-600"
                >
                  <MdOutlineEmail className="text-2xl" />
                  {report?.sinh_vien?.email}
                </h4>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleOpenDialog}
                className="cursor-pointer p-3 flex items-center gap-2 bg-[#34A853] rounded-md text-white"
              >
                <IoIosPrint className="text-xl" />
                In
              </button>
            </div>
          </div>
          {/* main ct */}
          <div>
            <h1 className="my-4 text-2xl font-bold">Báo Cáo Thực Tập</h1>
            <div>
              <div className="flex items-center">
                <span className="text-xl font-semibold min-w-[150px]">
                  Ngày
                </span>
                <span className="text-xl">
                  {new Date(report?.ngayTao).toLocaleDateString("vi-VN")}
                </span>
              </div>
              <div className="flex items-center mt-2">
                <span className="text-xl font-semibold min-w-[150px]">
                  Công việc
                </span>
                <span className="text-xl">{report?.loai}</span>
              </div>
              <div className="flex mt-2">
                <span className="text-xl font-semibold min-w-[150px]">
                  Nội dung
                </span>
                <PaginatedContent
                  text={report?.noiDung}
                  maxCharsPerPage={500}
                />
              </div>
            </div>

            <div className="pt-4 pb-10 border-b border-gray-300">
              <p className="font-medium text-gray-600 mb-2">Tệp tin đính kèm</p>
              <FilePreviewAuto filePath={report?.tepDinhKem} />
            </div>
            <div>
              <h1 className="text-xl font-bold mt-7">Nhận xét</h1>
              <textarea
                className="rounded-xl my-4 p-3 w-full border border-gray-300"
                name="comment"
                rows="5"
                placeholder="Nhập nhận xét..."
              ></textarea>
              <div className="flex justify-end">
                <button className="cursor-pointer px-4 py-2 bg-green-600 text-white rounded-md">
                  Gửi Cho Sinh Viên
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ReportDetails;
