import { useEffect, useState } from "react";
import ResponNav from "./responsiveNav";
import Header from "./header";
import { Outlet } from "react-router-dom";

function Report() {
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
            <h2 className="text-xl font-semibold">Xem Báo Cáo</h2>
               <p className="flex gap-2 items-center text-base">Tất Cả Báo Cáo Của Sinh Viên</p>
           </Header>}
         <Outlet/>
     
            
         </div> );
}

export default Report;