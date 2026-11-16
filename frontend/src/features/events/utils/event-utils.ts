import { doesEventOverlapDate } from "../../../lib/utils/date-utils";
import type { DateWithEvents, Event } from "../types";

export const addEventsToCalendar = (
  calendarDates: Date[],
  events: Event[],
): DateWithEvents[] => {
  return calendarDates.map((c) => {
    const filteredEvents = events.filter((e) =>
      doesEventOverlapDate(e.startAt, e.endAt, c),
    );
    return { day: c, events: filteredEvents };
  });
};
