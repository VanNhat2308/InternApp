import { Outlet } from "react-router-dom";

function Attendance() {
  return ( 
    <div className="flex-1">
      <Outlet/>
    </div>
   );
}

export default Attendance;