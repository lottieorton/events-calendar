import type {
  Calendar,
  CalendarResponse,
} from "../../features/calendars/types";
import type {
  DateWithEvents,
  Event,
  EventResponse,
} from "../../features/events/types";
import { doesEventOverlapDate } from "./date-utils";

export const makeEvent = (overrides: Partial<Event> = {}): Event => {
  return {
    id: 1,
    title: "Hair cut",
    description: "Go to the salon for a cut and blowdry",
    calendar: {
      id: 1,
      name: "Personal",
      color: "blue",
    },
    startAt: new Date(2026, 10, 5, 10, 0, 0),
    endAt: new Date(2026, 10, 5, 10, 30, 0),
    isAllDay: false,
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
      doesEventOverlapDate(e.startAt, e.endAt, c),
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

export const makeCalendarResponse = (
  overrides: Partial<CalendarResponse> = {},
): CalendarResponse => {
  return {
    id: 1,
    name: "Personal",
    color: "BLUE",
    ...overrides,
  };
};

export const makeEventResponse = (
  overrides: Partial<EventResponse> = {},
): EventResponse => {
  return {
    id: 1,
    title: "Hair cut",
    description: "Go to the salon for a cut and blowdry",
    calendar: {
      id: 1,
      name: "Personal",
      color: "BLUE",
    },
    startAt: new Date(2026, 10, 13, 17, 0, 0).toISOString(),
    endAt: new Date(2026, 10, 13, 18, 0, 0).toISOString(),
    isAllDay: false,
    ...overrides,
  };
};
