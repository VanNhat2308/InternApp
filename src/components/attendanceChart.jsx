import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import axiosClient from '../service/axiosClient';
import { useEffect, useState } from 'react';

export default function AttendanceChart() {
  const [selectedWeek, setSelectedWeek] = useState('tuanHienTai'); // tuanHienTai hoặc tuanTruoc
  const [data, setData] = useState([]);

  const convertData = (weekData) => {
    const dayMap = { mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri' };

    return Object.entries(weekData).map(([key, [onTime, late, absent]]) => ({
      day: dayMap[key],
      onTime: onTime / 100, // chuyển sang tỷ lệ (stackOffset="expand" dùng phần trăm)
      late: late / 100,
      absent: absent / 100,
    }));
  };

  useEffect(() => {
    axiosClient
      .get('/diem-danh/thong-ke-tuan')
      .then((res) => {
        const rawData = res.data[selectedWeek];
        setData(convertData(rawData));
      })
      .catch((err) => console.error('Lỗi khi lấy dữ liệu thống kê:', err));
  }, [selectedWeek]);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-semibold">Tổng quan điểm danh</h4>
        <select
          className="border border-gray-300 rounded px-2 py-1 text-sm"
          value={selectedWeek}
          onChange={(e) => setSelectedWeek(e.target.value)}
        >
          <option value="tuanHienTai">Tuần này</option>
          <option value="tuanTruoc">Tuần trước</option>
        </select>
      </div>

      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart barSize={15} data={data} stackOffset="expand" barGap={2}>
            <YAxis
              tickFormatter={(val) => `${(val * 100).toFixed(0)}%`}
              axisLine={false}
              tickLine={false}
            />
            <XAxis dataKey="day" axisLine={false} tickLine={false} />
            <Tooltip formatter={(value) => `${(value * 100).toFixed(0)}%`} />
            <Legend />
            <Bar dataKey="onTime" stackId="a" fill="#34A853" name="Đúng giờ" radius={[8, 8, 8, 8]} />
            <Bar dataKey="late" stackId="a" fill="#FBBC05" name="Trễ giờ" radius={[8, 8, 8, 8]} />
            <Bar dataKey="absent" stackId="a" fill="#EA4335" name="Nghỉ" radius={[8, 8, 8, 8]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
