import { useEffect, useState } from "react";

function Clock({ onTimeUpdate }) {
  const [time, setTime] = useState(getFormattedTime());

  function getFormattedTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes} Hrs`;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const newTime = getFormattedTime();
      setTime(newTime);
      if (onTimeUpdate) {
        onTimeUpdate(newTime); // Gửi thời gian về cha
      }
    }, 1000); // cập nhật mỗi giây

    // Cleanup khi unmount
    return () => clearInterval(interval);
  }, []);

  return <span>{time}</span>;
}

export default Clock;
