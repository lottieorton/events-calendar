import { calendarVariantClasses, type Calendar } from "../../types";

interface CalendarCardProps {
  calendar: Calendar;
  selected: boolean;
}

export default function CalendarCard({
  calendar,
  selected,
}: CalendarCardProps) {
  return (
    <article
      className={`flex items-center p-3 border-2 text-d-purple gap-1.5 rounded-xl ${selected ? calendarVariantClasses[calendar.color]["selected"] : "bg-stone-50 text-pale-purple border-border"}`}
    >
      <div
        className={`${calendarVariantClasses[calendar.color]["iconColor"]} rounded-full h-1.5 w-1.5`}
      />
      <p className="font-main font-semibold text-xs 3xl:text-base">
        {calendar.name}
      </p>
    </article>
  );
}
