import { Outlet } from "react-router-dom";



function List() {

    return ( 
    <div className="flex-1">

      <Outlet/>
    </div>
     );
}

export default List;