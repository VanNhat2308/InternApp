import pizitechLogo from '../assets/images/pizitech.png'; 
import { HiMiniBars3BottomRight } from "react-icons/hi2";
import { TbDotsVertical } from "react-icons/tb";
import { useSidebar } from '../context/sidebarContext';
import { FiSearch } from "react-icons/fi";
import { IoNotificationsOutline } from "react-icons/io5";
import avatar from '../assets/images/avatar.png'; 
import { useRef,useEffect } from 'react';

function ResponNav() {
     const { toggleSidebar, toggleMiniBar,isMiniBar,setMiniBar } = useSidebar();
     const MiniRef = useRef()
     useEffect(() => {
         const handleClickOutside = (e) => {
           if (MiniRef.current && !MiniRef.current.contains(e.target)) {
             setMiniBar(false); 
           }
         };
     
         if (isMiniBar) {
           document.addEventListener('mousedown', handleClickOutside);
         } else {
           document.removeEventListener('mousedown', handleClickOutside);
         }
     
         return () => {
           document.removeEventListener('mousedown', handleClickOutside);
         };
       }, [isMiniBar, setMiniBar]);
    return ( 
        <>
        <div className="h-[56px]" />
    <div  style={{ background: 'rgba(34, 141, 63, 1)' }} className='fixed top-0 left-0 w-full z-1000'>
    <div className='flex items-center justify-between py-2 px-3'>
        <HiMiniBars3BottomRight onClick={toggleSidebar}/>
        <img src={pizitechLogo} className='w-15' alt="pizitech" />
            <TbDotsVertical onClick={toggleMiniBar}/>
    </div>
        <div ref={MiniRef} className={`flex justify-center gap-3 bg-gray-100 w-full h-10 p-1
            ${isMiniBar?"":"hidden"}
            `}>
          <div className="bg-gray-200 aspect-square flex items-center justify-center rounded-md h-full text-2xl">
        <FiSearch/>
                  </div>
          <div className="bg-gray-200 aspect-square flex items-center justify-center rounded-md h-full text-2xl">
        <IoNotificationsOutline />
                  </div>
          <div className="bg-gray-200 aspect-square flex items-center justify-center rounded-md h-full text-2xl">
        <img  src={avatar} alt="ava" />
                  </div>

        </div>
    </div>
        
        </>
    );
}

export default ResponNav;