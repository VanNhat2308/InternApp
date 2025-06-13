import { useState } from "react";
import axiosClient from "../service/axiosClient";

function FileUpload({
  uploadPath = "/upload",
  onSuccess,
  onError,
  renderInput,       // Custom input field
  renderPreview,     // Custom preview
  renderButton,      // Custom button
  renderMessage      // Custom message
}) {
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
      const msg = "Vui lòng chọn một file.";
      setMessage(msg);
      onError?.(msg);
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

      const msg = "Tải lên thành công!";
      setMessage(msg);
      onSuccess?.(response.data);
    } catch (error) {
      const msg = "Tải lên thất bại.";
      setMessage(msg);
      onError?.(error);
    }
  };

  return (
    <div className="w-full">
      {/* Custom file input */}
      {renderInput ? (
        renderInput({ handleFileChange })
      ) : (
        <input type="file" onChange={handleFileChange} />
      )}

      {/* Preview nếu có */}
      {previewUrl &&
        (renderPreview ? renderPreview({ previewUrl }) : (
          <img src={previewUrl} alt="Preview" className="mt-2 max-h-40" />
        ))}

      {/* Nút gửi */}
      {renderButton ? (
        renderButton({ handleUpload })
      ) : (
        <button onClick={handleUpload}>Tải lên</button>
      )}

      {/* Message */}
      {message &&
        (renderMessage ? renderMessage({ message }) : (
          <p className="text-sm mt-2">{message}</p>
        ))}
    </div>
  );
}

export default FileUpload;
