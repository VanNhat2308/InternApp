import Dashboard from "../components/dashboard";
import Navbar from "../components/navBar";

function Home() {
    return ( 
    <div className="lg:p-5 flex gap-5 relative">


        <Navbar/>
        <Dashboard/>


    </div>
    


    );
}

export default Home;