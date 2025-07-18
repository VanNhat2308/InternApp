import React, { useEffect, useState } from "react";
import { BiChevronLeft, BiChevronRight, BiTrash } from "react-icons/bi";
import { MdTimer } from "react-icons/md";
import dayjs from "dayjs";

const generateCalendar = (year, month) => {
  const daysInMonth = new Date(year, month, 0).getDate(); // Tổng số ngày trong tháng
  const firstDay = new Date(year, month - 1, 1).getDay(); // Ngày đầu tháng: 0 = Chủ Nhật
  const adjustedFirstDay = (firstDay + 6) % 7; // Tuần bắt đầu từ Thứ Hai

  const calendar = [];
  let dayCounter = 1;

  for (let i = 0; i < 6; i++) {
    const week = new Array(7).fill(null);
    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < adjustedFirstDay) continue;
      if (dayCounter > daysInMonth) break;
      week[j] = dayCounter++;
    }
    calendar.push(week);
    if (dayCounter > daysInMonth) break;
  }

  return calendar;
};




const ScheduleCard = ({ event, onDelete }) => {
  const startTime = dayjs(`2025-07-01T${event.time}`);
  const endTime = startTime.add(event.duration, "hour");
  const role = localStorage.getItem("role")

  return (
    <div className="bg-white border border-gray-300 border-l-4 border-l-green-600 rounded-md p-2 shadow-sm relative text-sm mb-1">
      <div className="font-semibold">
        {startTime.format("HH:mm")} - {endTime.format("HH:mm")}
      </div>
       <div className="text-gray-500 mt-1 flex items-center gap-1">
        <MdTimer className="text-base" />
        {event.duration}h
      </div>
      { role === "Student" ? '':(<>
     
      <button
        onClick={() => onDelete(event.id)}
        className="absolute bottom-1 right-1 text-xl text-orange-500 hover:text-red-600"
      >
        <BiTrash />
      </button>
      </>)}
    </div>
  );
};

const ScheduleMonthGrid = ({ events = [], onDeleteById = () => {}, loading = false,  onMonthYearChange = () => {} }) => {
  // const [year, month] = [2025, 7]; 
  const today = dayjs();
  const [currentMonth, setCurrentMonth] = useState(today.month()); // 0-indexed
  const [currentYear, setCurrentYear] = useState(today.year());
  const calendar = generateCalendar(currentYear, currentMonth + 1); 

  useEffect(() => {
    onMonthYearChange(currentMonth, currentYear);
  }, [currentMonth, currentYear]);
  return (
    <>
<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4 mb-4 mt-4 px-2">
  <div className="flex justify-between sm:justify-start gap-2 sm:gap-4">
    <button
      onClick={() => {
        if (currentMonth === 0) {
          setCurrentMonth(11);
          setCurrentYear(currentYear - 1);
        } else {
          setCurrentMonth(currentMonth - 1);
        }
      }}
      className="cursor-pointer p-2 rounded-full bg-white shadow-lg hover:bg-gray-100 transition duration-200 text-xl"
      title="Tháng trước"
    >
      <BiChevronLeft />
    </button>

    <button
      onClick={() => {
        if (currentMonth === 11) {
          setCurrentMonth(0);
          setCurrentYear(currentYear + 1);
        } else {
          setCurrentMonth(currentMonth + 1);
        }
      }}
      className="cursor-pointer p-2 rounded-full bg-white shadow-lg hover:bg-gray-100 transition duration-200 text-xl"
      title="Tháng sau"
    >
      <BiChevronRight />
    </button>
  </div>

  <div className="text-lg sm:text-xl font-semibold text-center sm:text-left text-gray-800">
    {dayjs().month(currentMonth).format("MMMM")} {currentYear}
  </div>
</div>

    <div className="mt-4 lg:mt-0  w-full max-w-[95vw] overflow-x-auto">
      {loading ? (
        <p className="text-center p-4">Đang tải dữ liệu...</p>
      ) : (
        <table className="w-full min-w-[800px] table-fixed border border-gray-300">
          <thead>
            <tr>
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <th key={day} className="text-center bg-gray-100 p-2">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {calendar.map((week, i) => (
              <tr key={i}>
                {week.map((day, index) => {
                  const dateStr = day
                    ? `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                    : null;
                  const dayEvents = events.filter((e) => e.date === dateStr);

                  return (
                    <td
                      key={index}
                      className="align-top border border-gray-200 h-32 p-1"
                    >
                      {day && (
                        <div>
                          <div className="text-sm font-bold text-gray-700 mb-1">{day}</div>
                          <div className="space-y-1">
                            {dayEvents.map((event) => (
                              <ScheduleCard key={event.id} event={event} onDelete={onDeleteById} />
                            ))}
                          </div>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  </>
  );
};


export default ScheduleMonthGrid;
