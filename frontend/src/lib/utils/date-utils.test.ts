import {
  getCalendarDates,
  getStartOfDay,
  getStartOfNextMonth,
  getStartOfPrevMonth,
  isDaySame,
  isMonthSame,
  stringToDate,
  toISODateString,
  toMonthYear,
} from "./date-utils";

describe("stringToDate", () => {
  it("Should convert a valid date string to a Date object", () => {
    const result = stringToDate("2026-11-05");
    expect(result).toBeInstanceOf(Date);
    expect(result.getFullYear()).toBe(2026);
    expect(result.getMonth()).toBe(10);
    expect(result.getDate()).toBe(5);
  });

  it("Should convert an invalid date string to an invalid Date object", () => {
    const result = stringToDate("invalid date");
    expect(result).toBeInstanceOf(Date);
    expect(result.getDate()).toBeNaN();
  });

  it("Should convert an empty string to an invalid Date object", () => {
    const result = stringToDate("");
    expect(result).toBeInstanceOf(Date);
    expect(result.getDate()).toBeNaN();
  });
});

describe("toISODateString", () => {
  it("Should format a date as yyyy-MM-dd", () => {
    const testDate = new Date(2026, 10, 5);
    const result = toISODateString(testDate);
    expect(result).toBe("2026-11-05");
  });
});

describe("toMonthYear", () => {
  it("Should format a date as MMMM yyyy", () => {
    const testDate = new Date(2026, 10, 5);
    const result = toMonthYear(testDate);
    expect(result).toBe("November 2026");
  });
});

describe("isDaySame", () => {
  it("Should return true if both dates are on the exact same day", () => {
    const testDate1 = new Date(2026, 10, 5, 10, 0, 0);
    const testDate2 = new Date(2026, 10, 5, 15, 0, 0);
    expect(isDaySame(testDate1, testDate2)).toBe(true);
  });

  it("Should return false if both dates are different days", () => {
    const testDate1 = new Date(2026, 10, 5);
    const testDate2 = new Date(2026, 10, 6);
    expect(isDaySame(testDate1, testDate2)).toBe(false);
  });
});

describe("isMonthSame", () => {
  it("Should return true if both dates are in the same month", () => {
    const testDate1 = new Date(2026, 10, 5);
    const testDate2 = new Date(2026, 10, 7);
    expect(isMonthSame(testDate1, testDate2)).toBe(true);
  });

  it("Should return false if both dates are in different month", () => {
    const testDate1 = new Date(2026, 10, 5);
    const testDate2 = new Date(2026, 11, 5);
    expect(isMonthSame(testDate1, testDate2)).toBe(false);
  });
});

describe("getStartOfDay", () => {
  it("Should return the start of the day for a given date", () => {
    const testDate = new Date(2026, 10, 5, 13, 5, 30);
    const result = getStartOfDay(testDate);

    expect(result.getFullYear()).toBe(2026);
    expect(result.getMonth()).toBe(10);
    expect(result.getDate()).toBe(5);
    expect(result.getHours()).toBe(0);
    expect(result.getSeconds()).toBe(0);
    expect(result.getMilliseconds()).toBe(0);
  });

  it("Should return the same value if the day provided is the start of the day", () => {
    const testDate = new Date(2026, 10, 5, 0, 0, 0);
    const result = getStartOfDay(testDate);
    expect(result).toEqual(testDate);
  });
});

describe("getCalendarDates", () => {
  it("Should return list including the given date", () => {
    const testDate = new Date(2026, 10, 5);
    const result = getCalendarDates(testDate);
    const currentDateIndex = result.findIndex(
      (d) => d.toDateString() == testDate.toDateString(),
    );

    expect(currentDateIndex).toBeGreaterThan(-1);
  });

  it("Should return a sequential list of dates including the given date", () => {
    const testDate = new Date(2026, 10, 5);
    const result = getCalendarDates(testDate);

    expect(result).toHaveLength(42);
    for (let i = 1; i < result.length; i++) {
      const expectedNextDay = new Date(result[i - 1]);
      expectedNextDay.setDate(expectedNextDay.getDate() + 1);
      expect(result[i]).toEqual(expectedNextDay);
    }
  });

  it("Should have the first value returned being the Monday before the start of the month if the first day of the month is not a Monday", () => {
    const testDate = new Date(2026, 10, 5);
    const result = getCalendarDates(testDate);
    const firstDayOfSelectedMonth = result.find((d) => d.getDate() === 1);

    expect(result[0].getDay()).toBe(1);
    expect(firstDayOfSelectedMonth?.getDay()).not.toBe(1);
    expect(firstDayOfSelectedMonth).toBeDefined();
    expect(result[0].getTime()).toBeLessThan(
      firstDayOfSelectedMonth!.getTime(),
    );
    expect(
      Math.abs(firstDayOfSelectedMonth!.getTime() - result[0].getTime()),
    ).toBeLessThan(1000 * 60 * 60 * 24 * 7);
  });

  it("Should have the first value returned being the start of the month if the first day of the month is a Monday", () => {
    const testDate = new Date(2027, 1, 1);
    const result = getCalendarDates(testDate);

    expect(result[0].getDate()).toBe(1);
    expect(result[0].getDay()).toBe(1);
  });

  it("Should have the last value returned being the Sunday after the end of the month if the last day of the month is not a Sunday", () => {
    const testDate = new Date(2026, 10, 5);
    const result = getCalendarDates(testDate);
    const lastDayOfSelectedMonth =
      result[result.findLastIndex((d) => d.getDate() === 1) - 1];
    const lastDate = result[result.length - 1];

    expect(lastDate.getDay()).toBe(0);
    expect(lastDayOfSelectedMonth?.getDay()).not.toBe(0);
    expect(lastDayOfSelectedMonth).toBeDefined();
    expect(lastDate.getTime()).toBeGreaterThan(
      lastDayOfSelectedMonth!.getTime(),
    );
    expect(
      Math.abs(lastDayOfSelectedMonth!.getTime() - lastDate.getTime()),
    ).toBeLessThan(1000 * 60 * 60 * 24 * 7);
  });

  it("Should have the last value returned being the end of the month if the last day of the month is a Sunday", () => {
    const testDate = new Date(2027, 1, 1);
    const result = getCalendarDates(testDate);
    const lastDay = result[result.length - 1];

    expect(lastDay.getDate()).toBeGreaterThanOrEqual(28);
    expect(lastDay.getDay()).toBe(0);
  });
});

describe("getStartOfPrevMonth", () => {
  it("Should return first day of a month", () => {
    const testDate = new Date(2026, 10, 5);
    const result = getStartOfPrevMonth(testDate);

    expect(result.getDate()).toBe(1);
  });

  it("Should return a date from the previous month", () => {
    const testDate = new Date(2026, 10, 5);
    const result = getStartOfPrevMonth(testDate);

    expect(result.getMonth()).toBe(9);
  });

  it("Should return the previous month start when given the start of a month", () => {
    const testDate = new Date(2026, 10, 1);
    const result = getStartOfPrevMonth(testDate);

    expect(result.getDate()).toBe(1);
    expect(result.getMonth()).toBe(9);
  });

  it("Should return the first day of the last month of the previous year if given a date in the first month of a year", () => {
    const testDate = new Date(2027, 0, 5);
    const result = getStartOfPrevMonth(testDate);

    expect(result.getFullYear()).toBe(2026);
    expect(result.getMonth()).toBe(11);
    expect(result.getDate()).toBe(1);
  });
});

describe("getStartOfNextMonth", () => {
  it("Should return first day of a month", () => {
    const testDate = new Date(2026, 10, 5);
    const result = getStartOfNextMonth(testDate);

    expect(result.getDate()).toBe(1);
  });

  it("Should return a date from the next month", () => {
    const testDate = new Date(2026, 10, 5);
    const result = getStartOfNextMonth(testDate);

    expect(result.getMonth()).toBe(11);
  });

  it("Should return the next month start when given the start of a month", () => {
    const testDate = new Date(2026, 10, 1);
    const result = getStartOfNextMonth(testDate);

    expect(result.getDate()).toBe(1);
    expect(result.getMonth()).toBe(11);
  });

  it("Should return the first day of the first month of the next year if given a date in the last month of a year", () => {
    const testDate = new Date(2026, 11, 5);
    const result = getStartOfNextMonth(testDate);

    expect(result.getFullYear()).toBe(2027);
    expect(result.getMonth()).toBe(0);
    expect(result.getDate()).toBe(1);
  });
});
