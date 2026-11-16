import { toCalendar } from "../../calendars/utils/calendar-utils";
import type { Event, EventResponse } from "../types";

export const parseDate = (dateString: string): Date | null => {
  const parsedDate = new Date(dateString);

  if (isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate;
};

export const toEvent = (eR: EventResponse): Event | null => {
  const startAt = parseDate(eR.startAt);
  const endAt = parseDate(eR.endAt);

  if (startAt === null || endAt === null) {
    return null;
  }

  return {
    ...eR,
    calendar: toCalendar(eR.calendar),
    startAt: startAt,
    endAt: endAt,
  };
};
