import { useRef, useState } from "react";
import axiosClient from "../service/axiosClient";

function UploadSection({ onUploaded }) {
  const inputRef = useRef();
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
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
      setUploading(true);
      const response = await axiosClient.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage("Tải lên thành công!");
      onUploaded(response.data.path); // gửi path về form cha
    } catch (err) {
      setMessage("Tải lên thất bại.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };
  const userRole = localStorage.getItem('role')

  return (
    <div className="mt-6">
      <p className="font-semibold mb-2">{ userRole === 'Student' ? 'Tệp đính kèm':'CV Của Sinh Viên'}</p>

      {/* Label drag & click */}
      <label
        htmlFor="cv-upload"
        className="block w-full lg:w-[60%] lg:mx-auto lg:my-5 border-2 border-dashed border-green-400 rounded p-6 text-center cursor-pointer hover:bg-green-50 transition"
        onClick={() => inputRef.current?.click()}
      >
        <div className="flex justify-center mb-2">
          <div className="bg-green-700 text-white p-2 rounded-md">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h5v-2H4V5h12v10h-5v2h5a2 2 0 002-2V5a2 2 0 00-2-2H4z" />
              <path d="M9 12h2V8h3l-4-4-4 4h3v4z" />
            </svg>
          </div>
        </div>
        <p>
          Drag & Drop hoặc <span className="text-green-600 underline">chọn tệp</span> để tải lên
        </p>
        <p className="text-xs text-gray-500">Định dạng: PDF, JPG, JPEG</p>
      </label>

      <input
        id="cv-upload"
        type="file"
        ref={inputRef}
        accept=".pdf,.jpg,.jpeg"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Preview */}
      {previewUrl && (
        <div className="my-4">
          {file?.type === "application/pdf" ? (
            <iframe
              src={previewUrl}
              title="CV Preview"
              className="w-full h-64 border"
            ></iframe>
          ) : (
            <img
              src={previewUrl}
              alt="Preview"
              className="max-h-40 mx-auto rounded shadow"
            />
          )}
        </div>
      )}

      {/* <button
        onClick={handleUpload}
        disabled={uploading}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {uploading ? "Đang tải lên..." : "Gửi lên server"}
      </button> */}

      {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}
    </div>
  );
}

export default UploadSection;
