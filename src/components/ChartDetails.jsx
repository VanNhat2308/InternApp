import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";



export default function ChartDetails({attendanceData}) {
  const [selectedTab, setSelectedTab] = useState("week");


  const tabs = [
    { key: "week", label: "Tuần" },
    { key: "month", label: "Tháng" },
    { key: "semester", label: "Kỳ" },
  ];

  return (
    <>
      {/* Tab lựa chọn */}
      <div className="w-full">
                  <div className="flex bg-gray-100 rounded-3xl">
                 {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSelectedTab(tab.key)}
            className={`flex-1 py-2 cursor-pointer transition-all duration-200 rounded-3xl ${
              selectedTab === tab.key
                ? "bg-[#34A853] text-white"
                : "text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
                  </div>
                  <div className="my-5">
                    <h1 className="text-lg font-semibold">Biểu đồ thể hiện mức độ chuyên cần của sinh viên</h1>
                    <h4 className="text-gray-500 text-sm">Mức độ chuyên cần của sinh viên trong tuần này</h4>
                  </div>
                  {/* chart */}
                  


                </div>

      {/* Biểu đồ */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={attendanceData[selectedTab]}
          barSize={40}
          margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis label={{ value: selectedTab, angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Bar dataKey="value" radius={[10, 10, 0, 0]}>
            {attendanceData[selectedTab].map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}
