import { useState } from "react";
import axiosClient from "../service/axiosClient"; // hoặc đúng đường dẫn bạn lưu axiosClient

function FileUpload({ uploadPath = "/upload", onSuccess, onError }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setMessage("");
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Vui lòng chọn một file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axiosClient.post(uploadPath, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("Tải lên thành công!");
      onSuccess?.(response.data);
    } catch (error) {
      console.error(error);
      setMessage("Tải lên thất bại.");
      onError?.(error);
    }
  };

  return (
    <div className="p-4 border rounded w-full max-w-md">
      {/* Ô chọn file cải tiến */}
      <label className="block mb-2 text-sm font-medium text-gray-700">
        Chọn tệp để tải lên
      </label>
      <div className="flex items-center space-x-2 mb-3">
        <input
          type="file"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>

      {file && (
        <p className="text-sm text-gray-600 mb-2">
          Tệp đã chọn: <span className="font-medium">{file.name}</span>
        </p>
      )}

      {previewUrl && (
        <div className="mb-3">
          <p className="text-sm text-gray-600">Xem trước:</p>
          <img src={previewUrl} alt="preview" className="max-h-40 rounded" />
        </div>
      )}

      <button
        onClick={handleUpload}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
      >
        Gửi lên server
      </button>

      {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}
    </div>
  );
}

export default FileUpload;
