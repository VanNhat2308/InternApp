import { useEffect, useState } from "react";
import echo from "../service/echo";
import axios from "axios";

const ReceiverTest = () => {
  const currentUser = { id: 1, role: "admin" }; 

  const [messages, setMessages] = useState([]);

  // useEffect(() => {
  //   const fetchMessages = async () => {
  //     const res = await axios.get("http://localhost:8000/api/conversations/1/messages");
  //     setMessages(res.data);
  //   };
  //   fetchMessages();
  // }, []);

  useEffect(() => {
    const channel = echo.channel(`chat.${currentUser.id}`);
    channel.listen("NewMessage", (e) => {
    console.log("123")
      setMessages((prev) => [...prev, e.message]);
    });

    return () => {
      echo.leave(`chat.${currentUser.id}`);
    };
  }, [currentUser.id]);

  return (
    <div className="p-4 border rounded max-w-sm space-y-2">
      <h2 className="font-bold">ReceiverTest (User ID 1)</h2>
      <div className="space-y-1">
        {messages.map((msg, idx) => (
          <div key={idx} className="p-2 border rounded bg-gray-100">
            <span className="text-sm text-gray-700">{msg.content}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReceiverTest;
