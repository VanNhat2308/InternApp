import { useState } from "react";
import axios from "axios";

const SenderTest = () => {
  const [message, setMessage] = useState("");
  const from_id = 2; // user A
  const to_id = 1;   // user B (người đang lắng nghe)

  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      await axios.post("http://localhost:8000/api/messages", {
        from_id,
        from_role: "sinhvien",
        to_id,
        to_role: "admin",
        conversation_id: 1,
        content: message,
        type: "text"
      });

      setMessage("");
    } catch (err) {
      console.error("Lỗi gửi:", err);
    }
  };

  return (
    <div className="p-4 border rounded max-w-sm space-y-2">
      <h2 className="font-bold">SenderTest (User ID 2)</h2>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full p-2 border rounded"
        placeholder="Nhập tin nhắn"
      />
      <button
        onClick={sendMessage}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Gửi
      </button>
    </div>
  );
};

export default SenderTest;
