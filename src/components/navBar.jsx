// src/components/Navbar.jsx
import pizitechLogo from "../assets/images/pizitech.png";
import {
  FaTh,
  FaList,
  FaCalendarAlt,
  FaFileAlt,
  FaFolderOpen,
  FaClock,
  FaTasks,
  FaFlag,
  FaCog,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { HiMiniBars3BottomRight } from "react-icons/hi2";
import { TbDotsVertical } from "react-icons/tb";
import "./css/navbar.css";
import { useSidebar } from "../context/sidebarContext";
import { useRef } from "react";
import { Link, NavLink } from "react-router-dom";
const navItems = [
  { label: "Dashboard", icon: <FaTh />, active: true, linkTo: "dashboard" },
  { label: "Danh sách", icon: <FaList />, active: false, linkTo: "list" },
  {
    label: "Quản lý lịch thực tập",
    active: false,
    icon: <FaCalendarAlt />,
    linkTo: "schedule",
  },
  {
    label: "Xem báo cáo",
    active: false,
    icon: <FaFileAlt />,
    linkTo: "report",
  },
  {
    label: "Duyệt hồ sơ",
    active: false,
    icon: <FaFolderOpen />,
    linkTo: "approval",
  },
  {
    label: "Quản lý điểm danh",
    active: false,
    icon: <FaClock />,
    linkTo: "attendance",
  },
  { label: "Quản lý Task", active: false, icon: <FaTasks />, linkTo: "task" },
  {
    label: "Phản hồi",
    active: false,
    icon: <FaFlag />,
    danger: true,
    linkTo: "feedback",
  },
  { label: "Cài đặt", active: false, icon: <FaCog />, linkTo: "settings" },
];

const Navbar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isSidebarOpen, setSidebarOpen } = useSidebar();
  const [navItemsState, setNavItemsState] = useState(navItems);

  const navRef = useRef();
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setSidebarOpen(false); // Click bên ngoài => đóng
      }
    };

    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen, setSidebarOpen]);
  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };
  const handleActive = (clickedItem) => {
    const updatedNavItems = navItemsState.map((item) => ({
      ...item,
      active: item.label === clickedItem.label,
    }));
    setNavItemsState(updatedNavItems);
  };

  return (
    <div
      ref={navRef}
      id="navBar"
      // style={{ background: 'rgba(52, 168, 83, 0.1)' }}
      className={` transition-all duration-300
        ${isCollapsed ? "w-20 p-5" : "w-76 lg:w-84 p-10"}
        ${isSidebarOpen ? "translate-x-full" : "-translate-x-0"}
      rounded-r-3xl shadow-lg flex flex-col
      `}
    >
      {/* Nút toggle */}
      <div
        className={`mb-6 flex ${
          !isCollapsed ? "justify-end" : "justify-center"
        }`}
      >
        <button
          onClick={toggleSidebar}
          className="text-gray-600 hover:text-green-600"
        >
          {isCollapsed ? (
            <TbDotsVertical size={20} />
          ) : (
            <HiMiniBars3BottomRight size={20} />
          )}
        </button>
      </div>

      {/* Logo */}
      {!isCollapsed ? (
        <div className="mb-8 flex justify-center">
          <img className="max-w-[80px]" src={pizitechLogo} alt="pizitech" />
        </div>
      ) : (
        ""
      )}

      {/* Nav items */}
      <nav className="flex-1">
        {navItemsState.map((item, index) => (
          <Link to={`/admin/${item.linkTo}`}
            key={index}
            onClick={() => handleActive(item)} // <-- thêm onClick ở đây
            className={`flex items-center px-4 py-3 rounded-tr-lg rounded-br-lg mb-2 cursor-pointer transition
      ${
        item.active
          ? "bg-green-200 text-green-700 font-semibold border-l-2 border-l-green-400"
          : ""
      }
      hover:bg-green-100
      ${isCollapsed ? "justify-center" : ""}
    `}
          >
            
              <span
                className={`text-lg relative ${
                  item.danger
                    ? "before:content-[''] before:bg-red-500 before:w-2 before:h-2 before:rounded-full before:absolute before:right-[-4px] before:top-[-2px]"
                    : ""
                }`}
              >
                {item.icon}
              </span>
              {!isCollapsed && (
                <span className="text-lg ml-3">{item.label}</span>
              )}
            
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Navbar;
