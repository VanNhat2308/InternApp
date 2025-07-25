import React, { useEffect, useImperativeHandle, useState } from 'react';
import { BiTask } from 'react-icons/bi';
import { FaChevronDown } from 'react-icons/fa';
import { FaLayerGroup } from 'react-icons/fa6';
import { MdPeopleAlt } from 'react-icons/md';
import axiosClient from '../service/axiosClient'; 
import Select from "react-select";
import Swal from 'sweetalert2';

const priorities = ['Thấp', 'Trung bình', 'Cao'];

const TaskForm = ({ref}) => {
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState([]);
  const [selectedPriority, setSelectedPriority] = useState('');
  const [deadline, setDeadline] = useState('');
  const [studentOpen, setStudentOpen] = useState(false);
  const [priorityOpen, setPriorityOpen] = useState(false);
  const [errors, setErrors] = useState({});


  // Gọi API lấy danh sách sinh viên
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axiosClient.get('/sinhviens/lay-danh-sach-sinh-vien?all=true');
        const formatted = res.data.data.map((sv) => ({
          label: `${sv.hoTen} - ${sv.viTri} Intern`,
          value: sv.maSV,
        }));
        setStudents(formatted);
        
      } catch (error) {
        console.error('Lỗi lấy danh sách sinh viên:', error);
      }
    };

    fetchStudents();
  }, []);

useImperativeHandle(ref, () => ({
  async submitTask() {
    const newErrors = {};

    if (!taskName.trim()) newErrors.taskName = "Tên task không được để trống";
    if (!description.trim()) newErrors.description = "Mô tả không được để trống";
    if (selectedStudent.length === 0) newErrors.selectedStudent = "Chọn ít nhất 1 sinh viên";
    if (!selectedPriority) newErrors.selectedPriority = "Vui lòng chọn độ ưu tiên";
    if (!deadline) {
  newErrors.deadline = "Deadline không được bỏ trống";
} else if (new Date(deadline) < new Date()) {
  newErrors.deadline = "Deadline không được nhỏ hơn ngày hiện tại";
}


    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return false;
    }

    const payload = {
      tieuDe: taskName,
      noiDung: description,
      maSV: selectedStudent.map((s) => s.value),
      doUuTien: selectedPriority,
      hanHoanThanh: deadline,
      nguoiGiao: localStorage.getItem("user") || "Admin",
    };

    try {
      await axiosClient.post("/tasks", payload);
      return true;
    } catch (error) {
      console.error("Lỗi khi tạo task:", error);
      return false;
    }
  },
}));

  return (
    <div className="mb-3">
      {/* Tên Task */}
      <div>
        <label className="block text-sm font-medium mb-1">Tên Task</label>
        <div className="relative">
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="Nhập Tên Task"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
          />
          <div className="absolute left-3 top-[50%] transform -translate-y-1/2 text-green-500 text-2xl">
            <BiTask />
          </div>
        </div>
        {errors.taskName && <p className="text-red-500 text-sm mt-1">{errors.taskName}</p>}
      </div>

      {/* Mô tả Task */}
      <div className="my-1">
        <label className="block text-sm font-medium mb-1">Mô Tả Task</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Nhập Mô Tả"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
        ></textarea>
        {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
      </div>

      {/* Chọn Sinh Viên */}
     <div className="mb-1">
  <label className="block text-sm font-medium mb-1">Sinh Viên Thực Hiện</label>
  <Select
   classNames={{
       control: ({ isFocused }) =>
      isFocused
        ? '!outline-none !ring-2 !ring-green-300 !border !border-gray-300'
        : '!outline-none ',

    valueContainer: () => '!max-h-20 !overflow-y-auto',
  }}
  
    options={students}
    value={selectedStudent}
    onChange={(selected) => setSelectedStudent(selected)}
    isMulti 
    placeholder={
      <div className="flex items-center gap-2 text-gray-500">
        <MdPeopleAlt className="text-xl text-green-600" />
        <span>Chọn Sinh Viên</span>
      </div>
    }
    className="react-select-container"
    classNamePrefix="react-select"
  />
  {errors.selectedStudent && <p className="text-red-500 text-sm mt-1">{errors.selectedStudent}</p>}
</div>

      {/* Chọn Độ Ưu Tiên */}
      <div className="relative mb-1">
        <label className="block text-sm font-medium mb-1">Độ Ưu Tiên</label>
        <button
          type="button"
          onClick={() => setPriorityOpen(!priorityOpen)}
          className="w-full border-gray-300 flex justify-between items-center px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
        >
          <span className="text-left text-gray-700">
            {selectedPriority || (
              <div className="flex items-center gap-2">
                <FaLayerGroup className="text-xl text-green-600" />
                <span>Chọn Độ Ưu Tiên</span>
              </div>
            )}
          </span>
          <span><FaChevronDown /></span>
        </button>
        {priorityOpen && (
          <div className="absolute mt-2 w-full bg-white border p-2 border-gray-300 rounded-lg shadow z-10">
            {priorities.map((priority) => (
              <div
                key={priority}
                onClick={() => {
                  setSelectedPriority(priority);
                  setPriorityOpen(false);
                }}
                className="mb-2 rounded-md border border-gray-300 hover:bg-gray-100 cursor-pointer"
              >
                <label className="flex p-2 items-center justify-between cursor-pointer">
                  <span>{priority}</span>
                  <input
                    type="radio"
                    checked={selectedPriority === priority}
                    onChange={() => {}}
                    className="accent-green-500"
                  />
                </label>
              </div>
            ))}
          </div>
        )}
        {errors.selectedPriority && <p className="text-red-500 text-sm mt-1">{errors.selectedPriority}</p>}
      </div>

      {/* Deadline */}
      <div>
        <label className="block text-sm font-medium mb-1">Deadline</label>
        <input
          type="date"
          value={deadline}
           min={new Date().toISOString().split("T")[0]}
          onChange={(e) => setDeadline(e.target.value)}
          className="w-full border-gray-300 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
        />
        {errors.deadline && <p className="text-red-500 text-sm mt-1">{errors.deadline}</p>}
      </div>

    
    </div>
  );
};

export default TaskForm;
