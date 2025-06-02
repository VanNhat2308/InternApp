import { Outlet } from "react-router-dom";
import Header from "../components/header";
function List() {
    return ( 
    <div className="flex-1">
      <Header/>
      <Outlet/>
    </div>
     );
}

export default List;