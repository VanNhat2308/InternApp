import { Outlet } from "react-router-dom";

function Attendance() {
  return ( 
    <div className="flex-1 flex flex-col">
      <Outlet/>
    </div>
   );
}

export default Attendance;