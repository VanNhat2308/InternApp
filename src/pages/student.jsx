import Navbar from "../components/student/navbar";
import { Outlet } from "react-router-dom";


function Student() {
  
    return ( 
    <div className="lg:p-5 flex gap-5 relative">

        <Navbar/>
         <Outlet />


    </div>
    


    );
}

export default Student;