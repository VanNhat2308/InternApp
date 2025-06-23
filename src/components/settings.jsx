import { useEffect, useState } from "react";
import { FaCog } from "react-icons/fa";
import ResponNav from "./responsiveNav";
import Header from "./header";

function Settings() {
        const [isMobile, setIsMobile] = useState(window.innerWidth < 1025);
                  useEffect(() => {
                    const handleResize = () => {
                      setIsMobile(window.innerWidth < 1025);
                    };
                
                    window.addEventListener('resize', handleResize);
                    return () => window.removeEventListener('resize', handleResize);
                  }, []);

  return (
    <div className="flex flex-col flex-1">
       {isMobile ? <ResponNav /> : <Header>
         <h2 className="text-xl font-semibold">Settings</h2>
        </Header>}
    <div className="p-6 bg-white rounded-xl shadow border border-gray-200 mt-10">
      <div className="flex items-center gap-3 mb-4">
        <FaCog className="text-2xl text-green-500" />
        <h1 className="text-2xl font-bold">Cài đặt</h1>
      </div>
      <p className="text-gray-600">Đây là trang cài đặt của bạn. Tính năng sẽ được cập nhật sau.</p>
    </div>
    </div>
  );
}

export default Settings;
