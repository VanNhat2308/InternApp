import { useState } from "react";
import ScheduleGrid from "./scheduleGrid";
import ScheduleMonthGrid from "./scheduleMonthGrid";

function ViewModeCalendar() {
    const [viewMode, setViewMode] = useState("week");
    const [currentWeek, setCurrentWeek] = useState(0);

    return ( <div>
<div className="bg-green-100 p-1 rounded-2xl inline-flex mt-4">
      <button
        onClick={() => setViewMode("week")}
        className={`rounded-2xl py-1 px-5 text-lg font-bold cursor-pointer transition ${
          viewMode === "week"
            ? "bg-white shadow"
            : "bg-transparent text-gray-500"
        }`}
      >
        Tuần
      </button>
      <button
        onClick={() => setViewMode("month")}
        className={`rounded-2xl py-1 px-5 text-lg font-bold cursor-pointer transition ${
          viewMode === "month"
            ? "bg-white text-black shadow"
            : "bg-transparent text-gray-500"
        }`}
      >
        Tháng
      </button>
    </div>
    {/* Chọn tuần chỉ khi ở chế độ tuần */}
        {viewMode === "week" && (
          <select
            id="week-select"
            value={currentWeek}
            onChange={(e) => setCurrentWeek(Number(e.target.value))}
            className="px-4 py-2 bg-green-50 border border-gray-300 rounded-xl ml-5"
          >
            <option value={0}>Tuần hiện tại</option>
            <option value={-1}>Tuần trước</option>
            <option value={1}>Tuần tới</option>
          </select>
        )}
        
      {/* Hiển thị theo chế độ */}
      {viewMode === "week" ? (
        <ScheduleGrid currentWeek={currentWeek} />
      ) : (
        <ScheduleMonthGrid/>
      )}
    

    </div> );
}

export default ViewModeCalendar;