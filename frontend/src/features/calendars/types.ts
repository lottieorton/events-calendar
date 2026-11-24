export const CALENDAR_COLORS = ["purple", "blue", "pink", "green"] as const;

export type CalendarColorVariant = (typeof CALENDAR_COLORS)[number];

export interface Calendar {
  id: number;
  name: string;
  color: CalendarColorVariant;
}

export const calendarVariantClasses: Record<
  CalendarColorVariant,
  { selected: string; dotColor: string; iconColor: string }
> = {
  purple: {
    selected: "bg-purple-100 border-purple-400",
    dotColor: "bg-purple-400",
    iconColor: "text-purple-400 bg-purple-100",
  },
  blue: {
    selected: "bg-blue-100 border-blue-400",
    dotColor: "bg-blue-400",
    iconColor: "bg-blue-100 text-blue-400",
  },
  green: {
    selected: "bg-green-100 border-green-400",
    dotColor: "bg-green-400",
    iconColor: "bg-green-100 text-green-400",
  },
  pink: {
    selected: "bg-rose-100 border-rose-400",
    dotColor: "bg-rose-400",
    iconColor: "bg-rose-100 text-rose-400",
  },
};

export interface CalendarResponse {
  id: number;
  name: string;
  color: string;
}
