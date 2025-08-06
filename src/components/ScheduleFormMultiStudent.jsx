import React, { useEffect, useImperativeHandle, useState } from 'react';
import { BiTask } from 'react-icons/bi';
import { FaChevronDown } from 'react-icons/fa';
import { FaLayerGroup } from 'react-icons/fa6';
import { MdPeopleAlt } from 'react-icons/md';
import axiosClient from '../service/axiosClient'; 
import Select from "react-select";
import Swal from 'sweetalert2';


const ScheduleFormMultiStudent = ({ref}) => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState([]);
  const [errors, setErrors] = useState({});
  const [selectedDate,setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [selectedCa, setSelectedCa] = useState("8:00-12:00")
  const [errorSV,setErrorSV] = useState('')
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
  async submitSchedule() {
    const newErrors = {};
    if (selectedStudent.length === 0) newErrors.selectedStudent = "Chọn ít nhất 1 sinh viên";
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return false;
    }

    const payload = {
    maSV: selectedStudent.map((s) => s.value),
    ngay: selectedDate,
    ca: selectedCa,
    };

    try {
      await axiosClient.post("/lich/nhieuSinhVien", payload);
      return true;
    } catch (error) {
       if (error.response && error.response.data) {
    const message = error.response.data.message || "Lỗi không xác định";
    setErrorSV(message);
  } else {
    setErrorSV("Lỗi kết nối đến server");
  }
      return false;
    }
  },
}));

  return (
    <div className="mb-3">
   

      {/* Chọn Sinh Viên */}
     <div className="mb-1">
  <label className="font-semibold text-xl">Chọn sinh viên</label>
  <div className='my-2'>
      <Select
       classNames={{
           control: ({ isFocused }) =>
          isFocused
            ? '!outline-none !ring-2 !ring-green-300 !border !border-gray-300'
            : '!outline-none ',
        valueContainer: () => '!max-h-20 !overflow-y-auto m-1',
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
  </div>
  {errors.selectedStudent && <p className="text-red-500 text-sm mt-1">{errors.selectedStudent}</p>}
</div>

      {/* Chọn ngày */}
       <div className="flex flex-col">
          <label className="font-semibold text-xl" htmlFor="ngay">
            Ngày thực tập
          </label>
          <input
            type="date"
            min={new Date().toISOString().split('T')[0]}
            defaultValue={new Date().toISOString().split('T')[0]}
            className="border border-gray-300 p-3 rounded-md mt-2"
            onChange={(e) =>setSelectedDate(e.target.value)}
          />
        </div>

      {/* Chọn ca */}
 <div className="flex flex-col">
          <label className="font-semibold text-xl mt-2" htmlFor="ca">
            Ca
          </label>
          <select
            className="mb-10 border border-gray-300 p-3 rounded-md mt-2"
            id="ca"
            onChange={(e) => {
              setSelectedCa(e.target.value)
            }}
          >
            <option value="8:00-12:00">Ca sáng: 8:00 - 12:00</option>
            <option value="13:00-17:00">Ca chiều: 13:00 - 17:00</option>
          </select>
        </div>
        {/* error */}
        {errorSV && <p className="text-red-500 text-sm mt-1">{errorSV}</p>}

    
    </div>
  );
};

export default ScheduleFormMultiStudent;
