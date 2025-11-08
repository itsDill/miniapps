import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  startOfWeek,
  endOfWeek,
} from "date-fns";

export const CalendarWidget = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
        >
          ←
        </button>
        <div className="font-semibold">{format(currentDate, "MMMM yyyy")}</div>
        <button
          onClick={nextMonth}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-xs flex-1">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div
            key={day}
            className="text-center font-semibold text-gray-600 dark:text-gray-400 pb-1"
          >
            {day}
          </div>
        ))}

        {days.map((day) => {
          const sameMonth = isSameMonth(day, currentDate);
          const today = isToday(day);

          return (
            <div
              key={day.toString()}
              className={`
                aspect-square flex items-center justify-center rounded text-sm
                ${sameMonth ? "" : "text-gray-400 dark:text-gray-600"}
                ${
                  today
                    ? "bg-primary-500 text-white font-bold"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }
              `}
            >
              {format(day, "d")}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const CalendarSettings = () => {
  return (
    <div className="text-sm text-gray-600 dark:text-gray-400">
      No additional settings available for Calendar widget.
    </div>
  );
};
