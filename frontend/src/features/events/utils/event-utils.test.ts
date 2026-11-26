import { makeEvent } from "../../../lib/utils/test-utils";
import type { Event } from "../types";
import { addEventsToCalendar, getTimeLabels, orderEvents } from "./event-utils";

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

describe("orderEvents", () => {
  it("Should order non-allDay events chronologically", () => {
    const mockEvents = [
      makeEvent({
        id: 1,
        startAt: new Date(2026, 10, 17, 17, 0, 0),
        endAt: new Date(2026, 10, 17, 19, 0, 0),
        isAllDay: false,
      }),
      makeEvent({
        id: 2,
        startAt: new Date(2026, 10, 16, 15, 0, 0),
        endAt: new Date(2026, 10, 16, 19, 0, 0),
        isAllDay: false,
      }),
      makeEvent({
        id: 3,
        startAt: new Date(2026, 10, 17, 10, 0, 0),
        endAt: new Date(2026, 10, 17, 20, 0, 0),
        isAllDay: false,
      }),
    ];

    const result = orderEvents(mockEvents);
    expect(result.length).toBe(3);
    expect(result[0].id).toBe(2);
    expect(result[1].id).toBe(3);
    expect(result[2].id).toBe(1);
  });

  it("Should order allDay events to be at the start of the array", () => {
    const mockEvents = [
      makeEvent({
        id: 1,
        startAt: new Date(2026, 10, 16, 17, 0, 0),
        endAt: new Date(2026, 10, 17, 19, 0, 0),
        isAllDay: false,
      }),
      makeEvent({
        id: 2,
        startAt: new Date(2026, 10, 18, 23, 0, 0),
        endAt: new Date(2026, 10, 18, 23, 59, 59, 999),
        isAllDay: true,
      }),
      makeEvent({
        id: 3,
        startAt: new Date(2026, 10, 16, 15, 0, 0),
        endAt: new Date(2026, 10, 16, 19, 0, 0),
        isAllDay: false,
      }),
      makeEvent({
        id: 4,
        startAt: new Date(2026, 10, 17, 23, 0, 0),
        endAt: new Date(2026, 10, 17, 23, 59, 59, 999),
        isAllDay: true,
      }),
    ];

    const result = orderEvents(mockEvents);
    expect(result.length).toBe(4);
    expect(result[0].id).toBe(4);
    expect(result[1].id).toBe(2);
    expect(result[2].id).toBe(3);
    expect(result[3].id).toBe(1);
  });

  it("Should keep events that start at the same time in the same order", () => {
    const mockEvents = [
      makeEvent({
        id: 1,
        startAt: new Date(2026, 10, 16, 17, 0, 0),
        endAt: new Date(2026, 10, 17, 19, 0, 0),
        isAllDay: false,
      }),
      makeEvent({
        id: 2,
        startAt: new Date(2026, 10, 16, 17, 0, 0),
        endAt: new Date(2026, 10, 17, 18, 0, 0),
        isAllDay: false,
      }),
    ];

    const result = orderEvents(mockEvents);
    expect(result.length).toBe(2);
    expect(result[0].id).toBe(1);
    expect(result[1].id).toBe(2);
  });

  it("Should return an empty array when an empty array provided", () => {
    const result = orderEvents([]);
    expect(result.length).toBe(0);
  });
});

describe("getTimeLabels", () => {
  it("Should return start and end times for an event that occurs on this day only", () => {
    const mockEvent = makeEvent({
      startAt: new Date(2026, 10, 24, 8, 0, 0),
      endAt: new Date(2026, 10, 24, 17, 0, 0),
    });

    expect(getTimeLabels(mockEvent, new Date(2026, 10, 24))).toBe(
      "8:00am - 5:00pm",
    );
  });

  it("Should return All-day for an all day event", () => {
    const mockEvent = makeEvent({
      startAt: new Date(2026, 10, 24, 0, 0, 0),
      endAt: new Date(2026, 10, 24, 23, 59, 59),
      isAllDay: true,
    });

    expect(getTimeLabels(mockEvent, new Date(2026, 10, 24))).toBe("All-day");
  });

  it("Should return All-day for a non-allDay event that spans the entire given day", () => {
    const mockEvent = makeEvent({
      startAt: new Date(2026, 10, 23, 12, 0, 0),
      endAt: new Date(2026, 10, 25, 9, 0, 0),
      isAllDay: false,
    });

    expect(getTimeLabels(mockEvent, new Date(2026, 10, 24))).toBe("All-day");
  });

  it("Should return 'onwards' for a non-allDay event that ends after the given date", () => {
    const mockEvent = makeEvent({
      startAt: new Date(2026, 10, 24, 11, 0, 0),
      endAt: new Date(2026, 10, 25, 9, 0, 0),
      isAllDay: false,
    });

    expect(getTimeLabels(mockEvent, new Date(2026, 10, 24))).toBe(
      "11:00am - onwards",
    );
  });

  it("Should return 'Ends at' for a non-allDay event that starts before the given date", () => {
    const mockEvent = makeEvent({
      startAt: new Date(2026, 10, 24, 11, 0, 0),
      endAt: new Date(2026, 10, 25, 9, 0, 0),
      isAllDay: false,
    });

    expect(getTimeLabels(mockEvent, new Date(2026, 10, 25))).toBe(
      "Ends at 9:00am",
    );
  });
});
