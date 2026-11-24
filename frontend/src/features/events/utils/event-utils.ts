import { isSameDay } from "date-fns";
import { doesEventOverlapDate, toTime } from "../../../lib/utils/date-utils";
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

export const orderEvents = (events: Event[]): Event[] => {
  const allDayEvents = events
    .filter((e) => e.isAllDay)
    .sort((a, b) => a.startAt.getTime() - b.startAt.getTime());
  const notAllDayEvents = events
    .filter((e) => !e.isAllDay)
    .sort((a, b) => a.startAt.getTime() - b.startAt.getTime());
  return [...allDayEvents, ...notAllDayEvents];
};

export const getTimeLabels = (event: Event, selectedDate: Date): string => {
  if (event.isAllDay) {
    return "All-day";
  }

  if (
    !isSameDay(event.startAt, selectedDate) &&
    !isSameDay(event.endAt, selectedDate)
  ) {
    return "All-day";
  }

  let timeLabel = "";

  if (isSameDay(event.startAt, selectedDate)) {
    timeLabel += `${toTime(event.startAt)} - `;
  } else {
    timeLabel += "Ends at ";
  }

  if (isSameDay(event.endAt, selectedDate)) {
    timeLabel += `${toTime(event.endAt)}`;
  } else {
    timeLabel += "onwards";
  }

  return timeLabel;
};
