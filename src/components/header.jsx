import avatar from '../assets/images/avatar.png'; 
import { FiSearch } from "react-icons/fi";
import { FaChevronDown } from "react-icons/fa";
import { IoNotificationsOutline } from "react-icons/io5";
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { BiLogOut } from 'react-icons/bi';
import FeatureSearch from './FeatureSearch';
function Header({children}) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef();

  // Đóng dropdown nếu click ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

   const handleLogout = () => {
   localStorage.removeItem("email");
localStorage.removeItem("hoTen");
localStorage.removeItem("maAdmin");
localStorage.removeItem("maSV");
localStorage.removeItem("pusherTransportTLS");
localStorage.removeItem("role");
localStorage.removeItem("token");
localStorage.removeItem("user");
localStorage.removeItem("viTri");


    navigate("/")
  };

  const isNotifyActive = location.pathname === '/admin/notify';

  const handleNotify = () => {
    navigate('/admin/notify');
  };
const nameUser = localStorage.getItem('user')
const userRole = localStorage.getItem('role')
   
    return (   
      <div className="w-full flex h-12 justify-between items-center">
        <div>
         {children}
        </div>
        <div className="flex h-full gap-4 items-center">
            {/* input search */}
         <FeatureSearch/>
          {/* notify */}
          <div onClick={handleNotify} className={` cursor-pointer aspect-square flex items-center justify-center rounded-md h-full text-2xl ${isNotifyActive?'bg-green-100':'bg-gray-200'}`}>
<IoNotificationsOutline className={`${isNotifyActive?'text-green-500':''}`} />
          </div>
          {/* avatar */}
         <div className="relative" ref={dropdownRef}>
      {/* Khu vực avatar */}
      <div
        className="flex h-full items-center p-1 gap-2 border border-gray-300 rounded-md cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <img src={avatar} alt="avatar" className="w-8 h-8 rounded-full" />
        <div>
          <p className="text-sm font-semibold">{nameUser||'UnKnow'}</p>
          <p className="text-xs text-gray-500">{userRole||'Unknow'}</p>
        </div>
        <FaChevronDown />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="cursor-pointer absolute right-0 mt-2 w-40 bg-white  rounded-md shadow-lg z-50">
          <button
            onClick={handleLogout}
            className="cursor-pointer flex justify-center gap-2 items-center w-full text-left px-4 py-2 text-sm hover:bg-red-600"
          >
            <BiLogOut/>
            Đăng xuất
          </button>
        </div>
      )}
    </div>

        </div>
      </div> );
}

export default Header;