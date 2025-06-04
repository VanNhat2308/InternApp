// Toast.js
import { useEffect } from "react";

export default function Toast({ children, onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed lg:w-60 top-20 right-5  px-4 py-2 rounded shadow-xl z-50 animate-slideIn">
      {children}
    </div>
  );
}
