import Dashboard from "../components/dashboard";
import Navbar from "../components/navBar";

function Home() {
    return ( 
    <div className="p-5 flex gap-5">

        <Navbar/>
        <Dashboard/>


    </div>
    


    );
}

export default Home;