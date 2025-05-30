// src/components/Navbar.jsx
import React from 'react';
import pizitechLogo from '../assets/images/pizitech.png'; 
import { FaTh, FaList, FaCalendarAlt, FaFileAlt, FaFolderOpen, FaClock, FaTasks, FaFlag, FaCog } from 'react-icons/fa';

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
  return (
    <div style={{background:'rgba(52, 168, 83, 0.1)'}} className="w-84  p-10 rounded-r-3xl shadow-lg flex flex-col">
      {/* Logo */}
      <div className="mb-8 flex justify-center space-x-2 px-2">
      <img className='max-w-[80px]' src={pizitechLogo} alt="pizitech"  />
      </div>

      {/* Nav items */}
      <nav className="flex-1">
        {navItems.map((item, index) => (
          <div
            key={index}
            className={`flex items-center space-x-3 px-4 py-4 rounded-tr-lg rounded-br-lg  mb-2 cursor-pointer transition
              ${item.active ? 'bg-green-200 text-green-700 font-semibold border-l-2 border-l-green-400' : ''}
              hover:bg-green-100
            `}
          >
            <span className={
                `text-lg
 ${item.danger ? "relative before:content-[''] before:bg-red-500 before:w-2 before:h-2 before:rounded-full before:absolute before:right-[-4px] before:top-[-2px]" : ''}

                `}>{item.icon}</span>
            <span className="text-lg">{item.label}</span>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Navbar;
