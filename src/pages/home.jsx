import Navbar from "../components/navBar";
import { Outlet } from "react-router-dom";
import { useFilter } from "../context/filteContext";
import Filter from "../components/filter";

function Home() {
    const {isFilter} = useFilter()
    return ( 
    <div className="lg:p-5 flex gap-5 relative">
       {isFilter ? <Filter/> : ""}


        <Navbar/>
         <Outlet />


    </div>
    


    );
}

export default Home;