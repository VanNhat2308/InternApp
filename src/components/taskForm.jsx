import React, { useEffect, useImperativeHandle, useState } from 'react';
import { BiTask } from 'react-icons/bi';
import { FaChevronDown } from 'react-icons/fa';
import { FaLayerGroup } from 'react-icons/fa6';
import { MdPeopleAlt } from 'react-icons/md';
import axiosClient from '../service/axiosClient'; 

const priorities = ['Thấp', 'Trung bình', 'Cao'];

const TaskForm = ({ref}) => {
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState('');
  const [deadline, setDeadline] = useState('');
  const [studentOpen, setStudentOpen] = useState(false);
  const [priorityOpen, setPriorityOpen] = useState(false);

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
      if (!taskName || !description || !selectedStudent || !selectedPriority || !deadline) {
        alert('Vui lòng nhập đầy đủ thông tin!');
        return false;
      }

      const payload = {
        tieuDe: taskName,
        noiDung: description,
        maSV: selectedStudent.value,
        doUuTien: selectedPriority,
        hanHoanThanh:deadline,
      };

      try {
        await axiosClient.post('/tasks', payload);
        alert('Tạo task thành công!');
        return true;
      } catch (error) {
        console.error('Lỗi khi tạo task:', error);
        alert('Tạo task thất bại!');
        return false;
      }
    }
  }));

  return (
    <div className="mb-10">
      {/* Tên Task */}
      <div>
        <label className="block text-sm font-medium mb-1">Tên Task</label>
        <div className="relative">
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="Nhập Tên Task"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="absolute left-3 top-[50%] transform -translate-y-1/2 text-green-500 text-2xl">
            <BiTask />
          </div>
        </div>
      </div>

      {/* Mô tả Task */}
      <div className="mt-2">
        <label className="block text-sm font-medium mb-1">Mô Tả Task</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Nhập Mô Tả"
          className="w-full mb-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
      </div>

      {/* Chọn Sinh Viên */}
      <div className="relative mb-2">
        <label className="block text-sm font-medium mb-1">Sinh Viên Thực Hiện</label>
        <button
          type="button"
          onClick={() => setStudentOpen(!studentOpen)}
          className="w-full flex justify-between border-gray-300 items-center px-4 py-2 border rounded-lg focus:outline-none"
        >
          <span className="text-left text-gray-700">
            {selectedStudent?.label || (
              <div className="flex items-center gap-2">
                <MdPeopleAlt className="text-xl text-green-600" />
                <span>Chọn Sinh Viên</span>
              </div>
            )}
          </span>
          <span><FaChevronDown /></span>
        </button>
        {studentOpen && (
          <div className="absolute mt-2 w-full bg-white border border-gray-300 rounded-lg p-2 shadow z-10 max-h-60 overflow-auto">
            {students.map((student) => (
              <div
                key={student.value}
                onClick={() => {
                  setSelectedStudent(student);
                  setStudentOpen(false);
                }}
                className="mb-2 hover:bg-gray-100 cursor-pointer"
              >
                <label className="flex items-center justify-between p-2 border border-gray-300 rounded-md cursor-pointer">
                  <span>{student.label}</span>
                  <input
                    type="radio"
                    checked={selectedStudent?.value === student.value}
                    onChange={() => {}}
                    className="accent-green-500"
                  />
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chọn Độ Ưu Tiên */}
      <div className="relative mb-2">
        <label className="block text-sm font-medium mb-1">Độ Ưu Tiên</label>
        <button
          type="button"
          onClick={() => setPriorityOpen(!priorityOpen)}
          className="w-full border-gray-300 flex justify-between items-center px-4 py-2 border rounded-lg focus:outline-none"
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
      </div>

      {/* Deadline */}
      <div>
        <label className="block text-sm font-medium mb-1">Deadline</label>
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="w-full border-gray-300 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

    
    </div>
  );
};

export default TaskForm;
