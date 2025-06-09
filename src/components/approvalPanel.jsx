import { FiSearch } from "react-icons/fi";
import { useFilter } from "../context/filteContext";
import { FaSlidersH } from "react-icons/fa";
import avatar from "../assets/images/avatar.png"
import { RiDeleteBin6Line, RiEyeLine } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import Pagination from "./pagination";
import { BsFillPeopleFill } from "react-icons/bs";
import { useDialog } from "../context/dialogContext";
import { useNavigate } from "react-router-dom";

function ApprovalPanel() {
      const {toggleFilter} = useFilter()
      const { showDialog } = useDialog();
      const navigate = useNavigate()
      const applications = [
  {
    avatar: avatar,
    mssv:21117081,
    name: 'Phạm Văn A',
    date: '05/05/2025',
    position: 'Graphic Designer',
    university: 'VLU',
    status: 'Đã Duyệt'
  },
  {
    avatar: avatar,
    mssv:21117081,
    name: 'Lê Thị B',
    date: '05/05/2025',
    position: 'Business Analyst',
    university: 'UEF',
    status: 'Chưa Duyệt'
  },
  {
    avatar: avatar,
    mssv:21117081,
    name: 'Trần Văn C',
    date: '05/05/2025',
    position: 'Tester',
    university: 'UEF',
    status: 'Chưa Duyệt'
  },
  {
    avatar: avatar,
    mssv:21117081,
    name: 'Lê Văn D',
    date: '04/04/2025',
    position: 'Front-end Developer',
    university: 'VLU',
    status: 'Chưa Duyệt'
  },
  {
    avatar: avatar,
    mssv:21117081,
    name: 'Nguyễn Văn Z',
    date: '04/04/2025',
    position: 'Back-end Developer',
    university: 'UEH',
    status: 'Chưa Duyệt'
  },
  {
    avatar: avatar,
    mssv:21117081,
    name: 'Trần Văn Q',
    date: '04/04/2025',
    position: 'Back-end Developer',
    university: 'UEH',
    status: 'Đã Duyệt'
  },
  {
    avatar: avatar,
    mssv:21117081,
    name: 'Trần Văn B',
    date: '02/02/2025',
    position: 'Digital Marketing',
    university: 'VLU',
    status: 'Chưa Duyệt'
  },
  {
    avatar: avatar,
    mssv:21117081,
    name: 'Phạm Văn ABC',
    date: '02/02/2025',
    position: 'Graphic Designer',
    university: 'UEL',
    status: 'Chưa Duyệt'
  },
  {
    avatar: avatar,
    mssv:21117081,
    name: 'Phạm Văn A',
    date: '28/04/2025',
    position: 'Graphic Designer',
    university: 'VLU',
    status: 'Chưa Duyệt'
  },
  {
    avatar: avatar,
    mssv:21117081,
    name: 'Phạm Văn A',
    date: '28/04/2025',
    position: 'Graphic Designer',
    university: 'VLU',
    status: 'Chưa Duyệt'
  },
  {
    avatar: avatar,
    mssv:21117081,
    name: 'Phạm Văn A',
    date: '28/04/2025',
    position: 'Graphic Designer',
    university: 'VLU',
    status: 'Đã Duyệt'
  },
];
  
        const handleOpenDialog = () => {
          showDialog({
            title: "Xác nhận xóa thông tin",
            content: "Sau khi bạn xóa thông tin, thông tin của sinh viên thực tập sẽ được xóa khỏi danh sách sinh viên. Hãy kiểm tra kỹ.",
            icon: <BsFillPeopleFill />, // ✅ Truyền icon tại đây
            confirmText: "Có, xóa sinh viên",
            cancelText: "Không, tôi muốn kiểm tra lại",
            onConfirm: () => {
              console.log("Đã xóa sinh viên");
            },
          });
        };
          const handleView = (id) => {
  navigate(`/admin/approval/approval-details/${id}`);
};
  const statusStyle = (status) =>
    status === "Đã Duyệt"
      ? "text-green-600 bg-green-100"
      : "text-red-600 bg-red-100";

    return ( 

            <div className="p-4 w-full max-w-screen h-fit mt-10 rounded-xl shadow border border-[#ECECEE]">
              {/* filter bar */}
              <div className="flex flex-col lg:flex-row gap-2 lg:gap-4 lg:h-12">
                {/* search */}
                <div className="h-full relative flex-1">
                  <input
                    type="text"
                    placeholder="Tìm kiếm"
                    className="w-full border h-full border-gray-300 pl-8 pr-4 px-4 py-4 lg:py-1 rounded-lg transition-all duration-300"
                  />
        
                  <FiSearch className="absolute top-1/2 left-2 transform -translate-y-1/2" />
                </div>
               
                {/* filter btn */}
                <button onClick={toggleFilter} className="rounded-xl p-5 flex items-center gap-2 border border-gray-200 cursor-pointer">
                  <FaSlidersH/>
                  Lọc
                </button>
              </div>
              {/* table */}
            
               <div className="overflow-x-auto mt-10">
                 <table className="lg:w-full min-w-[800px] text-sm table-auto">
                    <thead className="text-left text-gray-500 border-b border-b-gray-300">
                      <tr>
                        <th className="py-2 ">Tên sinh viên</th>
                        <th>Ngày gửi</th>
                        <th>Vị trí ứng tuyển</th>
                        <th>Trường</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map((a, idx) => {
                        return (
                          <tr key={idx} className="border-b border-b-gray-300">
                            <td className="py-2 flex gap-2 items-center">
                              <img src={avatar} className="w-7" alt="ava" />
                              {a.name}
                            </td>
                            <td>{a.date}</td>
                            <td>{a.position}</td>
                            <td>{a.university}</td>
                            <td>
                              {" "}
                              <span
                                className={`px-2 py-1 rounded-sm text-xs font-medium ${statusStyle(
                                  a.status
                                )}`}
                              >
                                {a.status}
                              </span>
                            </td>
                            <td className="flex gap-2">
                              <button onClick={() => handleView(a.mssv)} className="text-xl cursor-pointer">
                                  <RiEyeLine />
                              </button>
    
                              <button 
                              onClick={handleOpenDialog}
                              className="text-xl cursor-pointer">
                                 <RiDeleteBin6Line />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              <Pagination totalPages={5} />
        
            </div>
     );
}

export default ApprovalPanel;