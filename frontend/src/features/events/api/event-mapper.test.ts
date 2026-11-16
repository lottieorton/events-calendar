import type { EventResponse } from "../types";
import { parseDate, toEvent } from "./event-mapper";

describe("parseDate", () => {
  it("Should parse a valid date string to a date", () => {
    expect(parseDate("2026-11-16T17:00:00Z")).toEqual(
      new Date("2026-11-16T17:00:00Z"),
    );
  });

  it("Should return null for an invalid date string", () => {
    expect(parseDate("invalid")).toBeNull();
  });
});

describe("toEvent", () => {
  const mockEventResponse: EventResponse = {
    id: 1,
    title: "Go to the gym",
    description: "Attend the HIIT Class. Remember to bring a towel.",
    calendar: {
      id: 1,
      name: "Personal",
      color: "PURPLE",
    },
    startAt: new Date(2026, 10, 16, 17, 0, 0).toISOString(),
    endAt: new Date(2026, 10, 16, 18, 0, 0).toISOString(),
    isAllDay: false,
  };

  it("Should return an event with updated calendar", () => {
    expect(toEvent(mockEventResponse)?.calendar.color).toBe("purple");
  });

  it("Should convert valid startAt string to a date object", () => {
    expect(toEvent(mockEventResponse)?.startAt).toEqual(
      new Date(2026, 10, 16, 17, 0, 0),
    );
  });

  it("Should convert valid endAt string to a date object", () => {
    expect(toEvent(mockEventResponse)?.endAt).toEqual(
      new Date(2026, 10, 16, 18, 0, 0),
    );
  });

  it("Should return unchanged properties as they are", () => {
    const result = toEvent(mockEventResponse);
    expect(result).not.toBeNull();
    expect(result?.id).toBe(1);
    expect(result?.title).toBe("Go to the gym");
    expect(result?.description).toBe(
      "Attend the HIIT Class. Remember to bring a towel.",
    );
    expect(result?.calendar.id).toBe(1);
    expect(result?.calendar.name).toBe("Personal");
    expect(result?.isAllDay).toBe(false);
  });

  it("Should return null for an invalid startAt date", () => {
    const mockInvalidEventResponse = {
      id: 1,
      title: "Go to the gym",
      description: "Attend the HIIT Class. Remember to bring a towel.",
      calendar: {
        id: 1,
        name: "Personal",
        color: "PURPLE",
      },
      startAt: "invalid",
      endAt: new Date(2026, 10, 16, 18, 0, 0).toISOString(),
      isAllDay: false,
    };

    expect(toEvent(mockInvalidEventResponse)).toBeNull();
  });

  it("Should return null for an invalid endAt date", () => {
    const mockInvalidEventResponse = {
      id: 1,
      title: "Go to the gym",
      description: "Attend the HIIT Class. Remember to bring a towel.",
      calendar: {
        id: 1,
        name: "Personal",
        color: "PURPLE",
      },
      startAt: new Date(2026, 10, 16, 17, 0, 0).toISOString(),
      endAt: "invalid",
      isAllDay: false,
    };

    expect(toEvent(mockInvalidEventResponse)).toBeNull();
  });
});
