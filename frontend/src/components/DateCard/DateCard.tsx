import { calendarVariantClasses } from "../../features/calendars/types";
import type { Event } from "../../features/events/types";

export type DateCardVariant = "selected" | "current" | "adjacent";

const variantClasses: Record<DateCardVariant, { card: string; fade: string }> =
  {
    selected: {
      card: "bg-bright-pink md:border md:border-secondary",
      fade: "from-bright-pink",
    },
    current: {
      card: "text-d-purple md:bg-stone-50",
      fade: "from-stone-50",
    },
    adjacent: {
      card: "text-pale-purple/90 md:bg-[#f4f3f3]",
      fade: "from-[#f4f3f3]",
    },
  };

interface DateCardProps {
  variant?: DateCardVariant;
  date: Date;
  onClick: () => void;
  events: Event[];
}

export default function DateCard({
  variant = "current",
  date,
  onClick,
  events,
}: DateCardProps) {
  const selectedNum = "bg-secondary text-white";

  return (
    <button
      onClick={() => onClick()}
      type="button"
      className={`font-main flex flex-col relative group items-center md:border md:border-border p-2 text-sm text-center gap-2 ${variantClasses[variant].card} rounded-xl cursor-pointer hover:bg-bright-pink md:rounded-none md:items-start md:w-full md:aspect-square md:text-left lg:aspect-card 3xl:text-xl overflow-hidden`}
    >
      <p
        className={`flex items-center justify-center rounded-full w-7 h-7 3xl:w-9 3xl:h-9 ${variant === "selected" ? selectedNum : ""}`}
      >
        {date.getDate()}
      </p>
      <div className="flex h-1.5 gap-0.5 md:hidden">
        {events.slice(0, 3).map((e) => {
          return (
            <div
              className={`${calendarVariantClasses[e.calendar.color].iconColor} rounded-full h-1.5 w-1.5`}
              key={e.id}
              aria-label="event-icon"
            />
          );
        })}
      </div>
      <div className="hidden md:flex h-1.5 gap-0.5 md:h-auto md:flex-col w-full">
        {events.map((e) => {
          return (
            <div
              className={`${calendarVariantClasses[e.calendar.color].selected} rounded-full h-1.5 w-1.5 text-[10px] md:h-auto md:w-auto md:p-1 md:rounded-md md:flex-1 leading-none`}
              aria-label="event-label"
              key={e.id}
            >
              {e.title}
            </div>
          );
        })}
      </div>
      <div
        className={`hidden md:block absolute bottom-0 left-0 right-0 h-8 bg-linear-to-t ${variantClasses[variant].fade} to-transparent group-hover:hidden`}
      />
    </button>
  );
}
