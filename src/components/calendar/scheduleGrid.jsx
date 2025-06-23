import { BiTimer, BiTrash } from "react-icons/bi";
import { MdTimer } from "react-icons/md";
import React, { useEffect, useState } from "react";
import axiosClient from "../../service/axiosClient";

const daysShort = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = Array.from(
  { length: 11 },
  (_, i) => `${8 + i}`.padStart(2, "0") + ":00"
);

const initialEvents = [
  { id: 1, day: "Tue", time: "08:00", duration: 4, week: 0 },
  { id: 2, day: "Tue", time: "13:00", duration: 4, week: 0 },
  { id: 3, day: "Mon", time: "13:00", duration: 4, week: 0 },
];

const getWeekDates = (weekOffset = 0) => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const mondayOffset = (dayOfWeek + 6) % 7;
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - mondayOffset + weekOffset * 7);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return {
      thu: daysShort[d.getDay() === 0 ? 6 : d.getDay() - 1],
      date: d.getDate(),
      month: d.getMonth() + 1,
      year: d.getFullYear(),
    };
  });
};

const ScheduleCard = ({ event, onDelete }) => (
  <div className="bg-white border border-gray-300 border-t-4 border-t-green-600 rounded-md p-2 shadow-md relative z-[-1] h-full w-full overflow-hidden">
    <div className="text-sm font-medium truncate">
      {event.time} - {parseInt(event.time) + event.duration}:00
    </div>
    <div className="text-xs text-gray-500 mt-1 flex gap-1 items-center">
      <MdTimer className="text-base" /> {event.duration}h
    </div>
    <button
      onClick={() => onDelete(event.id)}
      className="absolute bottom-2 right-2 text-lg cursor-pointer text-orange-500 hover:text-red-600"
    >
      <BiTrash />
    </button>
  </div>
);


const ScheduleGrid = ({ currentWeek, events,loading,onDeleteById }) => {
 






  const weekDays = getWeekDates(currentWeek);
  const filteredEvents = events;


  const today = new Date();
  const todayIndex = weekDays.findIndex(
    (d) =>
      d.date === today.getDate() &&
      d.month === today.getMonth() + 1 &&
      d.year === today.getFullYear()
  );

  const occupiedCells = new Set();

  return (

<div className="mt-4 lg:mt-0 lg:p-4 w-full max-w-[90vw]">
  {/* Table Layout */}
  {loading ? (
    <p className="text-center p-4">Đang tải dữ liệu...</p>
  ) : events.length === 0 ? (
    <p className="text-center p-4">Không có lịch trong tuần này.</p>
  ) : (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[800px] table-fixed text-sm sm:text-base ">
        <thead>
          <tr>
            {/* Empty top-left corner */}
            <th className="border border-gray-300 p-2 bg-gray-100 font-bold"></th>
            {/* Day headers */}
            {weekDays.map((day, i) => (
              <th
                key={i}
                className={`border border-gray-300 p-2 pb-10 text-left ${
                  i === todayIndex ? "bg-green-500 text-white" : "bg-gray-100"
                }`}
              >
                <div className="flex flex-col justify-start">
                  <span className="text-base font-bold">{day.thu}</span>
                  <span className="text-3xl font-bold">{day.date}</span>
                  <span className="text-gray-200 sm:text-gray-500">4h</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {hours.map((hour) => (
            <tr key={hour}>
              {/* Hour column */}
              <td className="text-base font-bold text-right px-2 bg-gray-50 border border-gray-300 h-20">
                {hour}
              </td>
              {/* Day cells */}
              {weekDays.map((day, colIndex) => {
                const isToday = colIndex === todayIndex;
                const cellKey = `${day.thu}-${hour}`;

                if (occupiedCells.has(cellKey)) {
                  return null;
                }

                const hourIndex = hours.indexOf(hour);
                const event = filteredEvents.find(
                  (e) => e.day === day.thu && e.time === hour
                );

                if (event) {
                  for (let i = 0; i < event.duration; i++) {
                    const nextHour = hours[hourIndex + i];
                    if (nextHour) {
                      occupiedCells.add(`${day.thu}-${nextHour}`);
                    }
                  }

                  return (
                    <td
                      key={cellKey}
                      rowSpan={event.duration}
                      className={`border border-gray-200 relative overflow-hidden h-20 p-1 ${
                        isToday ? "bg-green-50" : ""
                      }`}
                    >
                      <ScheduleCard event={event} onDelete={onDeleteById} />
                    </td>
                  );
                }

                return (
                  <td
                    key={cellKey}
                    className={`border border-gray-200 h-20 ${
                      isToday ? "bg-green-50" : ""
                    }`}
                  ></td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>

  );
};

export default ScheduleGrid;
