import avatar from '../assets/images/avatar.png'; 
import { FiSearch } from "react-icons/fi";
import { FaChevronDown } from "react-icons/fa";
import { IoNotificationsOutline } from "react-icons/io5";
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
function Header({children}) {
  const navigate = useNavigate();
  const location = useLocation();

  const isNotifyActive = location.pathname === '/admin/notify';

  const handleNotify = () => {
    navigate('/admin/notify');
  };

   
    return (   
      <div className="w-full flex h-12 justify-between items-center">
        <div>
         {children}
        </div>
        <div className="flex h-full gap-4 items-center">
            {/* input search */}
          <div className="h-full relative">
              <input
  type="text"
  placeholder="Tìm kiếm"
  className="w-8 sm:w-20 md:w-64 border h-full border-gray-300 pl-8 pr-4 px-4 py-1 rounded-lg transition-all duration-300"
/>

              <FiSearch className="absolute top-1/2 left-2 transform -translate-y-1/2"/>
          </div>
          {/* notify */}
          <div onClick={handleNotify} className={` cursor-pointer aspect-square flex items-center justify-center rounded-md h-full text-2xl ${isNotifyActive?'bg-green-100':'bg-gray-200'}`}>
<IoNotificationsOutline className={`${isNotifyActive?'text-green-500':''}`} />
          </div>
          {/* avatar */}
          <div className="flex h-full items-center p-1 gap-2 border border-gray-300 rounded-md">
            <img src={avatar} alt="avatar" className="w-8 h-8 rounded-full" />
            <div>
              <p className="text-sm font-semibold">Nguyễn Văn A</p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
            <FaChevronDown />
          </div>

        </div>
      </div> );
}

export default Header;