import React, { useState } from "react";
import { BiTrash } from "react-icons/bi";
import { MdTimer } from "react-icons/md";

const daysShort = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Dữ liệu mẫu
const initialEvents = [
  { id: 1, day: "Tue", time: "08:00", duration: 4, week: 1 },
  { id: 2, day: "Tue", time: "13:00", duration: 4, week: 1 },
  { id: 3, day: "Mon", time: "13:00", duration: 4, week: 3 },
];

const ScheduleCard = ({ event, onDelete }) => {
  const startHour = parseInt(event.time);
  const endHour = startHour + event.duration;

  return (
    <div className="bg-white border border-gray-300 border-l-4 border-l-green-600 rounded-md p-2 shadow-sm relative h-full text-sm mb-1">
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

const ScheduleMonthGrid = ({events,onDeleteById,loading}) => {
  const weeks = [1, 2, 3, 4];

  const handleDelete = (id) => {
    setEvents(events.filter((e) => e.id !== id));
  };

  return (
    <div className="mt-4 lg:mt-0 lg:p-4 w-full max-w-[90vw]">
      {loading ? (
        <p className="text-center p-4">Đang tải dữ liệu...</p>
      ) : events.length === 0 ? (
        <p className="text-center p-4">Không có lịch trong tháng này.</p>
      ) : (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] table-fixed">
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
                  const eventsInCell = events.filter(
                    (e) => e.day === day && e.week === week
                  );
                  return (
                    <td
                      key={`${day}-${week}`}
                      className="border border-gray-200 h-28 p-1 align-top"
                    >
                      {eventsInCell.length > 0 ? (
                        <div className="space-y-2">
                          {eventsInCell.map((event) => (
                            <ScheduleCard
                              key={event.id}
                              event={event}
                              onDelete={onDeleteById}
                            />
                          ))}
                        </div>
                      ) : null}
                    </td>
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

export default ScheduleMonthGrid;
