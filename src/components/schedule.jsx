import { useEffect, useState } from "react";
import ResponNav from "./responsiveNav";
import Header from "./header";
import { Outlet } from "react-router-dom";

function Schedule() {
     const [isMobile, setIsMobile] = useState(window.innerWidth < 1025);
            useEffect(() => {
              const handleResize = () => {
                setIsMobile(window.innerWidth < 1025);
              };
          
              window.addEventListener('resize', handleResize);
              return () => window.removeEventListener('resize', handleResize);
            }, []);
    return ( 
    <div className="flex-1 flex flex-col">
          {isMobile ? <ResponNav /> : <Header>
       <h2 className="text-xl font-semibold">Quản Lý Lịch Thực Tập</h2>
          <p className="flex gap-2 items-center text-gray-500">Danh Sách Lịch Thực Tập Của Sinh Viên </p>
      </Header>}
    <Outlet/>

       
    </div> );
}

export default Schedule;