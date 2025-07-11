import { useEffect, useState } from "react";
import ResponNav from "./responsiveNav";
import Header from "./header";
import { Outlet } from "react-router-dom";

function Task() {
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
         <h2 className="text-xl font-semibold">Quản Lý Task</h2>
            <p className="flex gap-2 items-center text-base text-gray-500">Tất cả task</p>
        </Header>}
      <Outlet/>
  
         
      </div> );
}

export default Task;