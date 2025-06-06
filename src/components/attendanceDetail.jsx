import ResponNav from "../components/responsiveNav";
import Header from "../components/header";
import avatar from "../assets/images/avatar.png";
import { useEffect, useState } from "react";
import { MdChevronRight } from "react-icons/md";
import { RiShoppingBag3Line } from "react-icons/ri";
import { MdOutlineEmail } from "react-icons/md";
import { FaRegTrashCan } from "react-icons/fa6";
import { CiEdit } from "react-icons/ci";
import { GoPeople } from "react-icons/go";
import { FaRegCalendarCheck } from "react-icons/fa";
import ChartDetails from "./ChartDetails";
import { BsFillPeopleFill } from "react-icons/bs";
import { useDialog } from "../context/dialogContext";
import { useNavigate, useParams } from "react-router-dom";
function AttendanceDetails() {
   const [isMobile, setIsMobile] = useState(window.innerWidth < 1025);
  const [chuyenCan, setChuyenCan] = useState(false);
  const { showDialog } = useDialog();
  const { idSlug } = useParams();
  const navigate = useNavigate()

  

  const handleOpenDialog = () => {
    showDialog({
      title: "Xác nhận xóa thông tin",
      content: "Sau khi bạn xóa thông tin, thông tin của sinh viên thực tập sẽ được xóa khỏi danh sách sinh viên. Hãy kiểm tra kỹ.",
      icon: <BsFillPeopleFill />, 
      confirmText: "Có, xóa sinh viên",
      cancelText: "Không, tôi muốn kiểm tra lại",
      onConfirm: () => {
        console.log("Đã xóa sinh viên");
      },
    });
  };
  


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1025);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

    const handleEdit = (idSlug) => {
  navigate(`/admin/list/edit-student/${idSlug}`);
};
  return(
    <><h1>sdsds</h1></>
  )
}

export default AttendanceDetails