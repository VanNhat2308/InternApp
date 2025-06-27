import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../header";
import ResponNav from "../../responsiveNav";
import { MdChevronRight, MdOutlineEmail } from "react-icons/md";
import avatar from "../../../assets/images/avatar.png";
import { BsSave } from "react-icons/bs";
import { RiDeleteBin6Line, RiShoppingBag3Line } from "react-icons/ri";
import { FaRegSave } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { FiPlus } from "react-icons/fi";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
function DiaryDetails() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1025);
  const { idSlug } = useParams();
  const [students, setStudent] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editTask, setEditTask] = useState({
    name: "",
    result: "",
    status: "Chưa xong",
  });
  const [taskInput, setTaskInput] = useState({
    name: "",
    result: "",
    status: "Chưa xong",
  });

  const handleAddTask = () => {
    if (!taskInput.name.trim() || !taskInput.result.trim()) {
      alert("Vui lòng nhập đầy đủ thông tin.");
      return;
    }


    setTasks((prev) => [...prev, taskInput]);
    setTaskInput({ name: "", result: "", status: "Chưa xong" });
    setShowInput(false);
  };
  
    const handleEditTask = (index) => {
      setEditIndex(index);
      setEditTask({ ...tasks[index] }); // lấy dữ liệu dòng đó để đổ vào form
    };
    const handleDeleteTask = (index) => {
      const updatedTasks = [...tasks];
      updatedTasks.splice(index, 1);
      setTasks(updatedTasks);
    };

    const handleSaveEdit = () => {
      const updatedTasks = [...tasks];
      updatedTasks[editIndex] = editTask;
      setTasks(updatedTasks);
      setEditIndex(null); // thoát chế độ chỉnh sửa
    };

  const [tasks, setTasks] = useState([
    {
      name: "Thiết kế trang đăng nhập",
      result: "Tạo được trang đăng nhập cho ứng dụng thực tập sinh",
      status: "Hoàn thành",
    },
    {
      name: "Thiết kế trang chủ cho ứng dụng",
      result: "Tạo được trang chủ cho ứng dụng quản lý thực tập sinh",
      status: "Hoàn thành",
    },
    {
      name: "Họp team lần 1",
      result: "Họp team để triển khai tiếp tục tiến độ công việc",
      status: "Hoàn thành",
    },
    {
      name: "Thiết kế giao diện thông báo",
      result: "Tạo được giao diện thông báo cho phần mềm quản lý thực tập sinh",
      status: "Chưa xong",
    },
  ]);

  const today = dayjs().format("DD/MM/YYYY"); // hôm nay
  const monday = dayjs().startOf("week").add(1, "day");

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = monday.add(i, "day");
    return {
      label: `Thứ ${i + 2}`,
      date: day.format("DD/MM"),
      full: day.format("DD/MM/YYYY"),
      isToday: day.format("DD/MM/YYYY") === today,
    };
  });

  const statusColor = (status) => {
    if (status === "Hoàn thành") return "text-green-500";
    if (status === "Chưa xong") return "text-yellow-500";
    return "text-gray-500";
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1025);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div className="flex-1">
      {isMobile ? (
        <ResponNav />
      ) : (
        <Header>
          <h2 className="text-xl font-semibold">Viết Nhật Ký</h2>
          <p className="flex gap-2 items-center">
            Danh Sách Nhật Ký <MdChevronRight className="text-xl" /> Nhật Ký
            Thực Tập Tuần
          </p>
        </Header>
      )}
      <div className="border border-gray-300 p-4 mt-10 rounded-md shadow">
        <div className="flex flex-col items-center gap-4 pb-5 border-b border-gray-300 lg:flex-row lg:justify-between">
          {/* avatar + info */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:items-start">
            <img
              src={
                // students.duLieuKhuonMat ? `${apiBaseURL}/${students.duLieuKhuonMat}` :
                avatar
              }
              alt="avartar"
              className="w-24 sm:w-20 aspect-square rounded-md border border-gray-300"
            />
            <div className="text-center sm:text-left">
              <h1 className="text-xl font-bold">
                {students.hoTen || "Nguyen Van A"}
              </h1>
              <h4 className="flex items-center gap-1 text-lg text-gray-600 justify-center sm:justify-start">
                <RiShoppingBag3Line className="text-2xl" />
                {students.viTri || "Sale mana"}
              </h4>
              <h4 className="flex items-center gap-1 text-lg text-gray-600 justify-center sm:justify-start">
                <MdOutlineEmail className="text-2xl" />
                {students.email || "ddos@gmail.com"}
              </h4>
            </div>
          </div>

          {/* buttons */}
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => {
                handleEdit(idSlug);
              }}
              className="cursor-pointer p-3 flex items-center gap-2 bg-[#34A853] rounded-md text-white justify-center"
            >
              <FaRegSave />
              Cập nhật
            </button>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-2">Nhật Ký Thực Tập Tuần 1</h2>
          <p className="text-gray-500 mb-4">Ngày 10/04 - 16/04</p>

          {/* Calendar header */}
          <div className="flex gap-2 mb-6">
            {weekDays.map((day, index) => (
              <div
                key={day.date}
                className={`text-center py-2 px-4 rounded-lg border border-gray-300 ${
                  day.isToday ? "bg-green-600 text-white" : "bg-gray-100"
                }`}
              >
                <div className="text-sm font-medium">{day.label}</div>
                <div className="text-lg font-semibold">
                  {day.date.split("/")[0]}
                </div>
              </div>
            ))}
          </div>

          {/* Table header */}
          <div className="grid grid-cols-12 text-gray-500 text-sm font-medium border-b border-gray-300  pb-2">
            <div className="col-span-3">Tên Công Việc</div>
            <div className="col-span-5">Kết Quả Thực Hiện</div>
            <div className="col-span-2">Tiến Độ</div>
            <div className="col-span-2">Hành Động</div>
          </div>

          {/* Task rows */}
          {tasks.map((task, idx) => (
            <div
              key={idx}
              className="grid grid-cols-12 py-2 items-center border-b text-sm"
            >
              {editIndex === idx ? (
                <>
                  <input
                    className="col-span-3 border rounded px-2 py-1"
                    placeholder={task.name}
                    value={editTask.name}
                    onChange={(e) =>
                      setEditTask({ ...editTask, name: e.target.value })
                    }
                  />
                  <input
                    className="col-span-5 border rounded px-2 py-1"
                    placeholder={task.result}
                    value={editTask.result}
                    onChange={(e) =>
                      setEditTask({ ...editTask, result: e.target.value })
                    }
                  />
                  <select
                    className="col-span-2 border rounded px-2 py-1"
                    value={editTask.status}
                    onChange={(e) =>
                      setEditTask({ ...editTask, status: e.target.value })
                    }
                  >
                    <option value="Hoàn thành">Hoàn thành</option>
                    <option value="Chưa xong">Chưa xong</option>
                  </select>
                  <div className="col-span-2 flex gap-2">
                    <button onClick={handleSaveEdit} className="text-green-600">
                      ✔
                    </button>
                    <button
                      onClick={() => setEditIndex(null)}
                      className="text-red-600"
                    >
                      ✖
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="col-span-3 font-medium text-gray-700">
                    {task.name}
                  </div>
                  <div className="col-span-5 text-gray-600">{task.result}</div>
                  <div
                    className={`col-span-2 font-semibold ${statusColor(
                      task.status
                    )}`}
                  >
                    {task.status}
                  </div>
                  <div className="col-span-2 flex gap-3">
                    <button onClick={() => handleEditTask(idx)}>
                      <CiEdit className="text-xl" />
                    </button>
                    <button onClick={() => handleDeleteTask(idx)}>
                      <RiDeleteBin6Line className="text-xl" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}

          {showInput && (
            <div className="grid grid-cols-12 gap-2 py-2 items-center border-b text-sm">
              <input
                type="text"
                placeholder="Nhập tên công việc"
                value={taskInput.name}
                onChange={(e) =>
                  setTaskInput({ ...taskInput, name: e.target.value })
                }
                className="col-span-3 border rounded px-2 py-1"
              />
              <input
                type="text"
                placeholder="Nhập kết quả thực hiện"
                value={taskInput.result}
                onChange={(e) =>
                  setTaskInput({ ...taskInput, result: e.target.value })
                }
                className="col-span-5 border rounded px-2 py-1"
              />
              <select
                value={taskInput.status}
                onChange={(e) =>
                  setTaskInput({ ...taskInput, status: e.target.value })
                }
                className="col-span-2 border rounded px-2 py-1 "
              >
                <option value="Hoàn thành" className="text-green-500">
                  Hoàn thành
                </option>
                <option value="Chưa xong" className="text-yellow-500">
                  Chưa xong
                </option>
              </select>
              <div className="col-span-2 flex justify-end gap-2">
                <button
                  onClick={handleAddTask}
                  className="text-green-600 font-medium"
                >
                  ✔
                </button>
                <button
                  onClick={() => setShowInput(false)}
                  className="text-red-600 font-medium"
                >
                  ✖
                </button>
              </div>
            </div>
          )}

          <div className="flex justify-center mt-6">
            <button
              onClick={() => setShowInput(true)}
              className="cursor-pointer flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-md text-sm hover:bg-gray-100"
            >
              <FiPlus className="text-2xl" /> Thêm công việc
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiaryDetails;
