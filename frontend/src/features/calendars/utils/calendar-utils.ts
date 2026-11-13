import {
  CALENDAR_COLORS,
  type Calendar,
  type CalendarColorVariant,
  type CalendarResponse,
} from "../types";

export const parseCalendarColorVariant = (
  color: string,
): CalendarColorVariant => {
  const normalizedColor = color.toLowerCase();
  if (CALENDAR_COLORS.includes(normalizedColor as CalendarColorVariant)) {
    return normalizedColor as CalendarColorVariant;
  }
  // If color is not recognised return default color
  return "blue";
};

export const toCalendar = (calResponse: CalendarResponse): Calendar => {
  return {
    ...calResponse,
    color: parseCalendarColorVariant(calResponse.color),
  };
};
