import { useEffect, useState } from "react";

function Clock({ onTimeUpdate }) {
  const [time, setTime] = useState(getFormattedTime());

  function getFormattedTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes} Hrs`;
  }

  function getTimeForBackend() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`; // Laravel cần định dạng này
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const newTime = getFormattedTime();
      setTime(newTime);

      if (onTimeUpdate) {
        const backendTime = getTimeForBackend();
        onTimeUpdate(backendTime); // Truyền định dạng chuẩn về cha
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <span>{time}</span>;
}

export default Clock;
