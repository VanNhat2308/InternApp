import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from 'recharts';

const data = [
  { day: 'Mon', onTime: 60, late: 30, absent: 10 },
  { day: 'Tue', onTime: 70, late: 20, absent: 10 },
  { day: 'Wed', onTime: 65, late: 25, absent: 10 },
  { day: 'Thu', onTime: 50, late: 30, absent: 20 },
  { day: 'Fri', onTime: 55, late: 25, absent: 20 },
];

export default function AttendanceChart() {
  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
    <BarChart barSize={15} data={data} stackOffset="expand" barGap={2}  >
  {/* Ẩn đường grid nếu muốn */}
  {/* <CartesianGrid strokeDasharray="3 3" /> */}

  {/* Ẩn trục Y (vẫn giữ nhãn bên trong biểu đồ) */}
  <YAxis
  tickFormatter={(val) => `${(val * 100).toFixed(0)}%`}
  axisLine={false}  // ❌ không vẽ trục
  tickLine={false}  // ❌ không vẽ gạch nhỏ
/>


  {/* Hiện nhãn ngày nhưng không vẽ đường trục */}
  <XAxis dataKey="day" axisLine={false} tickLine={false} />

  <Tooltip formatter={(value) => `${(value * 100).toFixed(0)}%`} />
  <Legend />

  <Bar dataKey="onTime" stackId="a" fill="#34A853" name="Đúng giờ"  radius={[8, 8, 8, 8]} />
  <Bar dataKey="late" stackId="a" fill="#FBBC05" name="Trễ giờ"   radius={[8, 8, 8, 8]}/>
  <Bar dataKey="absent" stackId="a" fill="#EA4335" name="Nghỉ"   radius={[8, 8, 8, 8]}/>
</BarChart>

      </ResponsiveContainer>
    </div>
  );
}
