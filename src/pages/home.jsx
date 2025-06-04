import AddStudentDialog from "../components/addStudentDialog";
import Navbar from "../components/navBar";
import { Outlet } from "react-router-dom";
import { useDialog } from "../context/dialogContext";
import { useFilter } from "../context/filteContext";
import Filter from "../components/filter";

function Home() {
    const {isShowDialog} = useDialog()
    const {isFilter} = useFilter()
    return ( 
    <div className="lg:p-5 flex gap-5 relative">
       {isShowDialog ? <AddStudentDialog/> : ""}
       {isFilter ? <Filter/> : ""}


        <Navbar/>
         <Outlet />


    </div>
    


    );
}

export default Home;