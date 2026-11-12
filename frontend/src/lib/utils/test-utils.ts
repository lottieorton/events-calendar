import type { Calendar } from "../../features/calendars/types";
import type { DateWithEvents, Event } from "../../features/events/types";
import { doesEventOverlapDate } from "./date-utils";

export const makeEvent = (overrides: Partial<Event> = {}): Event => {
  return {
    id: 1,
    title: "Hair cut",
    description: "Go to the salon to get this sorted",
    calendar: {
      id: 1,
      name: "Personal",
      color: "blue",
    },
    start_at: new Date(2026, 10, 5, 10, 0, 0),
    end_at: new Date(2026, 10, 5, 10, 30, 0),
    is_all_day: false,
    ...overrides,
  };
};

export const makeDateList = (startDate: Date, endDate: Date): Date[] => {
  const dateList: Date[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dateList.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dateList;
};

export const makeDateEvents = (
  dateList: Date[],
  events: Event[],
): DateWithEvents[] => {
  return dateList.map((c) => {
    const filteredEvents = events.filter((e) =>
      doesEventOverlapDate(e.start_at, e.end_at, c),
    );
    return { day: c, events: filteredEvents };
  });
};

export const makeCalendar = (overrides: Partial<Calendar> = {}): Calendar => {
  return {
    id: 1,
    name: "Personal",
    color: "blue",
    ...overrides,
  };
};
