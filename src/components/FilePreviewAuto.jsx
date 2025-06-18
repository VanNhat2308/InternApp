import { useEffect, useState } from "react";
import axiosClient from "../service/axiosClient";
import { HiOutlineDocumentText } from "react-icons/hi2";
import { BsDownload } from "react-icons/bs";

function FilePreviewAuto({ filePath }) {
  const [fileSize, setFileSize] = useState(null);

  const fileName = filePath?.split("/").pop();
  const fileUrl = `${import.meta.env.VITE_API_BASE_URL}/${filePath}`;


  return (
    <div className="flex max-w-xl items-center gap-3 bg-white px-4 py-3 rounded-xl border border-gray-300 shadow-sm">
      <HiOutlineDocumentText
       className="text-red-500 text-2xl" />
      <div className="flex-1">
        <p className="font-medium text-sm truncate">{fileName}</p>
      </div>
      <a href={fileUrl} download className="text-xl text-gray-600 hover:text-blue-600 cursor-pointer">
        <BsDownload />
      </a>
    </div>
  );
}

export default FilePreviewAuto;
