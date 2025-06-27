import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';
import { useEffect, useState } from 'react';
import axiosClient from '../service/axiosClient';


export default function WeeklyAttendanceChart() {
  const [selectedWeek, setSelectedWeek] = useState('tuanHienTai');
  const [chartData, setChartData] = useState([]);

  const convertData = (weekData) => {
    let totalOnTime = 0;
    let totalLate = 0;
    let totalAbsent = 0;

    Object.values(weekData).forEach(([onTime, late, absent]) => {
      totalOnTime += onTime;
      totalLate += late;
      totalAbsent += absent;
    });

    // Dữ liệu là số ngày
    return [
      { name: 'Đúng giờ', days: totalOnTime, fill: '#34A853' },
      { name: 'Trễ', days: totalLate, fill: '#FBBC05' },
      { name: 'Nghỉ làm', days: totalAbsent, fill: '#EA4335' },
    ];
  };



//   useEffect(() => {
//     axiosClient
//       .get('/diem-danh/thong-ke-tuan')
//       .then((res) => {
//         const rawData = res.data[selectedWeek];
//         setChartData(convertData(rawData));
//       })
//       .catch((err) => console.error('Lỗi khi lấy dữ liệu:', err));
//   }, [selectedWeek]);
useEffect(() => {
  // Giả lập API
  const mockApiResponse = {
    tuanHienTai: {
      mon: [1, 0, 0],
      tue: [1, 0, 0],
      wed: [1, 0, 0],
      thu: [0, 1, 0],
      fri: [1, 1, 1],
    },
    tuanTruoc: {
      mon: [1, 0, 0],
      tue: [0, 1, 0],
      wed: [0, 1, 0],
      thu: [0, 0, 1],
      fri: [0, 1, 0],
    }
  };

  const rawData = mockApiResponse[selectedWeek];
  setChartData(convertData(rawData));
}, [selectedWeek]);


  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className='font-bold text-lg'>Chuyên Cần</h1>
        <select
          className="border rounded px-2 py-1 text-sm"
          value={selectedWeek}
          onChange={(e) => setSelectedWeek(e.target.value)}
        >
          <option value="tuanHienTai">Tuần này</option>
          <option value="tuanTruoc">Tuần trước</option>
        </select>
      </div>

      <div className="w-full h-fit bg-white rounded-xl shadow p-2 border border-[#ECECEE] ">
        <div className='mb-5'>
            <h1 className='text-lg font-semibold'>Biểu đồ thể hiện mức đồ chuyên cần của sinh viên</h1>
            <h5 className='text-sm'>Mức độ chuyên cần của sinh viên trong tuần này</h5>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData} barSize={50}>
            <XAxis dataKey="name" />
            <YAxis domain={[0, 7]} tickCount={8} />
            <Tooltip formatter={(value) => `${value} ngày`} />
            <Bar dataKey="days" radius={[8, 8, 0, 0]}>
              {
                chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))
              }
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
