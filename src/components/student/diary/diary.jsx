import { Outlet } from "react-router-dom";



function Diary() {

    return ( 
    <div className="flex-1">

      <Outlet/>
    </div>
     );
}

export default Diary;