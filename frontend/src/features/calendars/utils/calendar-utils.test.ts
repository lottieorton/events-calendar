import type { Calendar, CalendarResponse } from "../types";
import { parseCalendarColorVariant, toCalendar } from "./calendar-utils";

describe("parseCalendarColorVariant", () => {
  it("Should return a valid calendar color variant when provided", () => {
    expect(parseCalendarColorVariant("purple")).toBe("purple");
  });

  it("Should be case insensitive when returning a valid calendar color variant", () => {
    expect(parseCalendarColorVariant("PURPLE")).toBe("purple");
  });

  it("Should return default value for invalid inputs", () => {
    expect(parseCalendarColorVariant("hello")).toBe("blue");
  });

  it("Should return default value for empty input", () => {
    expect(parseCalendarColorVariant("")).toBe("blue");
  });
});

describe("toCalendar", () => {
  it("Should return a valid calendar with updated color", () => {
    const testCalendarResponse: CalendarResponse = {
      id: 1,
      name: "Personal",
      color: "PURPLE",
    };
    const result = toCalendar(testCalendarResponse);
    expectTypeOf(result).toEqualTypeOf<Calendar>();
    expect(result).toEqual({ id: 1, name: "Personal", color: "purple" });
  });

  it("Should return a valid calendar with default color", () => {
    const testCalendarResponse: CalendarResponse = {
      id: 1,
      name: "Personal",
      color: "hello",
    };
    const result = toCalendar(testCalendarResponse);
    expect(result).toEqual({ id: 1, name: "Personal", color: "blue" });
  });
});
