import { useEffect, useState } from "react";
import Header from "./header";
import ResponNav from "./responsiveNav";
import { Outlet } from "react-router-dom";

function Approval() {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1025);
            useEffect(() => {
              const handleResize = () => {
                setIsMobile(window.innerWidth < 1025);
              };
          
              window.addEventListener('resize', handleResize);
              return () => window.removeEventListener('resize', handleResize);
            }, []);
    return ( 
    <div className="flex-1">
    {isMobile ? <ResponNav /> : <Header>
       <h2 className="text-xl font-semibold">Duyệt Hồ Sơ</h2>
          <p className="flex gap-2 items-center">Danh Sách Hồ Sơ Của Sinh Viên</p>
      </Header>}
      <Outlet/>
      
    </div>

     );
}

export default Approval;