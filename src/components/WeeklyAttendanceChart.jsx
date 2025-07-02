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


export default function WeeklyAttendanceChart({chartData}) {
  const [selectedWeek, setSelectedWeek] = useState('tuanHienTai');
  const [data,setData] = useState([])
  const convertData = (weekData) => {
    let totalOnTime = 0;
    let totalLate = 0;
    let totalAbsent = 0;

Object.values(weekData).forEach(item => {
  if (Array.isArray(item)) {
    const [onTime, late, absent] = item;
    totalOnTime += onTime;
    totalLate += late;
    totalAbsent += absent;
  }
});

    // Dữ liệu là số ngày
    return [
      { name: 'Đúng giờ', days: totalOnTime, fill: '#34A853' },
      { name: 'Trễ', days: totalLate, fill: '#FBBC05' },
      { name: 'Nghỉ làm', days: totalAbsent, fill: '#EA4335' },
    ];
  };



useEffect(() => {
  if (chartData && chartData[selectedWeek]) {
    const rawData = chartData[selectedWeek];
    setData(convertData(rawData));
  } else {
    setData([]);
  }
}, [selectedWeek, chartData]);


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
          <BarChart data={data} barSize={50}>
            <XAxis dataKey="name" />
            <YAxis domain={[0, 7]} tickCount={8} />
            <Tooltip formatter={(value) => `${value} ngày`} />
            <Bar dataKey="days" radius={[8, 8, 0, 0]}>
              {
               data.map((entry, index) => (
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
