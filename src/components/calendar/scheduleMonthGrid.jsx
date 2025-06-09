import React, { useState } from "react";
import { BiTrash } from "react-icons/bi";
import { MdTimer } from "react-icons/md";

const daysShort = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Dữ liệu mẫu
const initialEvents = [
  { id: 1, day: "Tue", time: "08:00", duration: 4, week: 1 },
  { id: 2, day: "Fri", time: "13:00", duration: 4, week: 2 },
  { id: 3, day: "Mon", time: "13:00", duration: 4, week: 3 },
];

// Card hiển thị mỗi event
const ScheduleCard = ({ event, onDelete }) => {
  const startHour = parseInt(event.time);
  const endHour = startHour + event.duration;

  return (
    <div className="bg-white border border-gray-300 border-l-4 border-l-green-600 rounded-md p-2 shadow-sm relative h-full text-sm">
      <div className="font-semibold">
        {event.time} - {endHour}:00
      </div>
      <div className="text-gray-500 mt-1 flex items-center gap-1">
        <MdTimer className="text-base" />
        {event.duration}h
      </div>
      <button
        onClick={() => onDelete(event.id)}
        className="absolute bottom-1 right-1 text-xl text-orange-500 hover:text-red-600"
      >
        <BiTrash />
      </button>
    </div>
  );
};

// Lịch dạng tháng: trục X là ngày, Y là tuần
const ScheduleMonthGrid = () => {
  const [events, setEvents] = useState(initialEvents);
  const weeks = [1, 2, 3, 4];

  const handleDelete = (id) => {
    setEvents(events.filter((e) => e.id !== id));
  };

  return (
    <div className="p-4">
      <table className="w-full border-collapse table-fixed">
        <thead>
          <tr>
            <th className="w-20 border border-gray-300 bg-gray-100 text-center font-bold">
              Tuần
            </th>
            {daysShort.map((day) => (
              <th
                key={day}
                className="border border-gray-300 bg-gray-100 text-center font-bold"
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week) => (
            <tr key={week}>
              <td className="text-center font-bold bg-gray-50 border border-gray-300">
                Tuần {week}
              </td>
              {daysShort.map((day) => {
                const event = events.find(
                  (e) => e.day === day && e.week === week
                );

                return (
                  <td
                    key={`${day}-${week}`}
                    className="border border-gray-200 h-24 p-1 align-top"
                  >
                    {event && (
                      <ScheduleCard event={event} onDelete={handleDelete} />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduleMonthGrid;
