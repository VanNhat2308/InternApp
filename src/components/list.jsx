import { Outlet } from "react-router-dom";



function List() {

    return ( 
    <div className="flex flex-col flex-1">

      <Outlet/>
    </div>
     );
}

export default List;