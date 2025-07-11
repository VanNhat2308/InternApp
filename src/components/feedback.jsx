import { useEffect, useState } from "react";
import Header from "./header";
import ResponNav from "./responsiveNav";
import { Outlet } from "react-router-dom";

function Feedback() {
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
         <h2 className="text-xl font-semibold">Phản hồi</h2>
            <p className="flex gap-2 items-center text-base text-gray-500">Tất Cả Tin Nhắn Phản Hồi</p>
        </Header>}
      <Outlet/>

        </div>
     );
}

export default Feedback;