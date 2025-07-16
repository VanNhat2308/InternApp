import { useEffect, useState } from "react";
import Header from "./header";
import ResponNav from "./responsiveNav";
import { Outlet } from "react-router-dom";
function SchoolAndPosition() {


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
             <h1 className="text-xl font-bold text-gray-800">Quản lý Trường & Vị trí</h1>
            </Header>}
    <Outlet/>
    </div>
  );
}

export default SchoolAndPosition;
