// src/components/Navbar.jsx
import pizitechLogo from '../assets/images/pizitech.png'; 
import { FaTh, FaList, FaCalendarAlt, FaFileAlt, FaFolderOpen, FaClock, FaTasks, FaFlag, FaCog } from 'react-icons/fa';
import { useState,useEffect } from 'react';
import { HiMiniBars3BottomRight } from "react-icons/hi2";
import { TbDotsVertical } from "react-icons/tb";
import './css/navbar.css';
import { useSidebar } from '../context/sidebarContext';
import { useRef } from 'react';
const navItems = [
  { label: 'Dashboard', icon: <FaTh />, active: true },
  { label: 'Danh sách', icon: <FaList /> },
  { label: 'Quản lý lịch thực tập', icon: <FaCalendarAlt /> },
  { label: 'Xem báo cáo', icon: <FaFileAlt /> },
  { label: 'Duyệt hồ sơ', icon: <FaFolderOpen /> },
  { label: 'Quản lý điểm danh', icon: <FaClock /> },
  { label: 'Quản lý Task', icon: <FaTasks /> },
  { label: 'Phản hồi', icon: <FaFlag />, danger: true },
  { label: 'Cài đặt', icon: <FaCog /> },
];

const Navbar = () => {
   const [isCollapsed, setIsCollapsed] = useState(false)
const { isSidebarOpen,setSidebarOpen } = useSidebar();
   const navRef = useRef();
useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setSidebarOpen(false); // Click bên ngoài => đóng
      }
    };

    if (isSidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen, setSidebarOpen]);
  const toggleSidebar = () => {
    setIsCollapsed(prev => !prev);
  };

  return (
     <div
     ref={navRef}
     id='navBar'
      // style={{ background: 'rgba(52, 168, 83, 0.1)' }}
      className={` transition-all duration-300
        ${isCollapsed ? 'w-20 p-5' : 'w-76 lg:w-84 p-10'}
        ${isSidebarOpen ? 'translate-x-full' : '-translate-x-0'}
      rounded-r-3xl shadow-lg flex flex-col
      `}
    >
     {/* Nút toggle */}
      <div className={`mb-6 flex ${!isCollapsed?'justify-end':'justify-center'}`}>
        <button onClick={toggleSidebar} className="text-gray-600 hover:text-green-600">
          {isCollapsed ?  <TbDotsVertical size={20}/>:<HiMiniBars3BottomRight size={20}/> }
        </button>
      </div>

      {/* Logo */}
      {!isCollapsed?<div className="mb-8 flex justify-center">
        <img className="max-w-[80px]" src={pizitechLogo} alt="pizitech" />
      </div>:""}

      {/* Nav items */}
      <nav className="flex-1">
        {navItems.map((item, index) => (
          <div
            key={index}
            className={`flex items-center px-4 py-3 rounded-tr-lg rounded-br-lg mb-2 cursor-pointer transition
              ${item.active ? 'bg-green-200 text-green-700 font-semibold border-l-2 border-l-green-400' : ''}
              hover:bg-green-100
              ${isCollapsed ? 'justify-center' : ''}
            `}
          >
            <span
              className={`text-lg relative ${
                item.danger
                  ? "before:content-[''] before:bg-red-500 before:w-2 before:h-2 before:rounded-full before:absolute before:right-[-4px] before:top-[-2px]"
                  : ''
              }`}
            >
              {item.icon}
            </span>
            {/* Label */}
            {!isCollapsed && <span className="text-lg ml-3">{item.label}</span>}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Navbar;
