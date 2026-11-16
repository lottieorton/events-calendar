import { makeEvent } from "../../../lib/utils/test-utils";
import type { Event } from "../types";
import { addEventsToCalendar } from "./event-utils";

describe("addEventsToCalendar", () => {
  const mockCalendarDates = [
    new Date(2026, 10, 15),
    new Date(2026, 10, 16),
    new Date(2026, 10, 17),
    new Date(2026, 10, 18),
  ];
  const mockEvents = [
    makeEvent({
      id: 1,
      startAt: new Date(2026, 10, 16, 15, 0, 0),
      endAt: new Date(2026, 10, 16, 19, 0, 0),
    }),
    makeEvent({
      id: 2,
      startAt: new Date(2026, 10, 17, 17, 0, 0),
      endAt: new Date(2026, 10, 17, 19, 0, 0),
    }),
  ];

  it("Should return all of the calendar dates provided", () => {
    const result = addEventsToCalendar(mockCalendarDates, mockEvents);

    expect(result.length).toBe(4);
    expect(result[0].day).toEqual(mockCalendarDates[0]);
    expect(result[1].day).toEqual(mockCalendarDates[1]);
    expect(result[2].day).toEqual(mockCalendarDates[2]);
    expect(result[3].day).toEqual(mockCalendarDates[3]);
  });

  it("Should add multiple events to the associated days", () => {
    const result = addEventsToCalendar(mockCalendarDates, mockEvents);

    expect(result.length).toBe(4);
    expect(result[0].events.length).toBe(0);
    expect(result[1].events.length).toBe(1);
    expect(result[1].events[0]).toEqual(mockEvents[0]);
    expect(result[2].events.length).toBe(1);
    expect(result[2].events[0]).toEqual(mockEvents[1]);
    expect(result[3].events.length).toBe(0);
  });

  it("Should add multi day events to all of the overlapping days", () => {
    const mockEvents = [
      makeEvent({
        id: 1,
        startAt: new Date(2026, 10, 16, 15, 0, 0),
        endAt: new Date(2026, 10, 18, 19, 0, 0),
      }),
    ];

    const result = addEventsToCalendar(mockCalendarDates, mockEvents);

    expect(result[0].events.length).toBe(0);
    expect(result[1].events.length).toBe(1);
    expect(result[1].events[0]).toEqual(mockEvents[0]);
    expect(result[2].events.length).toBe(1);
    expect(result[2].events[0]).toEqual(mockEvents[0]);
    expect(result[3].events.length).toBe(1);
    expect(result[3].events[0]).toEqual(mockEvents[0]);
  });

  it("Should return empty event arrays when dates don't overlap match", () => {
    const mockEvents = [
      makeEvent({
        id: 1,
        startAt: new Date(2026, 11, 16, 15, 0, 0),
        endAt: new Date(2026, 11, 18, 19, 0, 0),
      }),
    ];

    const result = addEventsToCalendar(mockCalendarDates, mockEvents);

    result.forEach((r) => {
      expect(r.events.length).toBe(0);
    });
  });

  it("Should return empty array for empty calendar dates array", () => {
    const mockCalendarDates: Date[] = [];

    const result = addEventsToCalendar(mockCalendarDates, mockEvents);

    expect(result.length).toBe(0);
  });

  it("Should return empty event arrays for empty event list", () => {
    const mockEvents: Event[] = [];

    const result = addEventsToCalendar(mockCalendarDates, mockEvents);

    expect(result.length).toBe(4);
    result.forEach((r) => {
      expect(r.events.length).toBe(0);
    });
  });
});
