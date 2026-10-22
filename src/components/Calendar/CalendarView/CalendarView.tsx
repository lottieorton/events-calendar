import { isSameDay, isSameMonth } from "date-fns";
import DateCard from "../../DateCard/DateCard";

interface CalendarViewProps {
  calendarDates: Date[];
  selectedDate: Date;
  updateDates: (date: Date) => void;
}

export default function CalendarView({
  calendarDates,
  selectedDate,
  updateDates,
}: CalendarViewProps) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <article className="flex flex-col p-4 gap-2 bg-stone-50 rounded-3xl border border-border md:p-6">
      <div className="grid grid-cols-7 gap-2 justify-items-center">
        {days.map((d) => {
          return (
            <p className="text-xs text-pale-purple font-semibold 3xl:text-base">
              {d}
            </p>
          );
        })}
      </div>
      <div className="grid grid-cols-7 justify-items-center gap-1 md:gap-0 md:border md:border-border">
        {calendarDates.map((d) => {
          return (
            <DateCard
              date={d}
              isSelected={isSameDay(d, selectedDate)}
              key={d.toDateString()}
              handleClick={() => updateDates(d)}
              isCurrentMonth={isSameMonth(d, selectedDate)}
            />
          );
        })}
      </div>
    </article>
  );
}
