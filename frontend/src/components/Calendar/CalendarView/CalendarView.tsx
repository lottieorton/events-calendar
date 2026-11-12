import DateCard, { type DateCardVariant } from "../../DateCard/DateCard";
import { isDaySame, isMonthSame } from "../../../lib/utils/date-utils";
import type { DateWithEvents } from "../../../features/events/types";

interface CalendarViewProps {
  calendarDates: DateWithEvents[];
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
    <article className="flex flex-col self-center w-full max-w-240 p-4 gap-2 bg-stone-50 rounded-3xl border border-border md:p-6 lg:border-0 lg:p-2">
      <div className="grid grid-cols-7 gap-2 justify-items-center">
        {days.map((d) => {
          return (
            <p
              className="font-main text-xs text-pale-purple font-semibold 3xl:text-base"
              key={d}
            >
              {d}
            </p>
          );
        })}
      </div>
      <div className="grid grid-cols-7 justify-items-center gap-1 md:gap-0 md:border md:border-border">
        {calendarDates.map((c) => {
          let variant: DateCardVariant = isMonthSame(c.day, selectedDate)
            ? "current"
            : "adjacent";
          if (isDaySame(c.day, selectedDate)) {
            variant = "selected";
          }

          return (
            <DateCard
              variant={variant}
              date={c.day}
              key={c.day.toDateString()}
              onClick={() => updateDates(c.day)}
              events={c.events}
            />
          );
        })}
      </div>
    </article>
  );
}
