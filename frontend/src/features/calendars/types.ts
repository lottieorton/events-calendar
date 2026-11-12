export type CalendarColorVariant = "purple" | "blue" | "pink" | "green";

export interface Calendar {
  id: number;
  name: string;
  color: CalendarColorVariant;
}

export const calendarVariantClasses: Record<
  CalendarColorVariant,
  { selected: string; iconColor: string }
> = {
  purple: {
    selected: "bg-purple-100 border-purple-400",
    iconColor: "bg-purple-400",
  },
  blue: {
    selected: "bg-blue-100 border-blue-400",
    iconColor: "bg-blue-400",
  },
  green: {
    selected: "bg-green-100 border-green-400",
    iconColor: "bg-green-400",
  },
  pink: {
    selected: "bg-rose-100 border-rose-400",
    iconColor: "bg-rose-400",
  },
};
