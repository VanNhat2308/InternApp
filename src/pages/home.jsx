import AddStudentDialog from "../components/addStudentDialog";
import Navbar from "../components/navBar";
import { Outlet } from "react-router-dom";
import { useDialog } from "../context/dialogContext";

function Home() {
    const {isShowDialog} = useDialog()
    return ( 
    <div className="lg:p-5 flex gap-5 relative">
       {isShowDialog ? <AddStudentDialog/> : ""}


        <Navbar/>
         <Outlet />


    </div>
    


    );
}

export default Home;