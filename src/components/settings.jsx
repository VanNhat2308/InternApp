import { useEffect, useState } from "react";
import { FaCog } from "react-icons/fa";
import ResponNav from "./responsiveNav";
import Header from "./header";
import { Outlet } from "react-router-dom";

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
 <Outlet/>
    </div>
  );
}

export default Settings;
