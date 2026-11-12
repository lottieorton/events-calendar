import {
  addDays,
  areIntervalsOverlapping,
  eachDayOfInterval,
  endOfDay,
  endOfMonth,
  format,
  isMonday,
  isSameDay,
  isSameMonth,
  isSunday,
  nextSunday,
  parse,
  previousMonday,
  startOfDay,
  startOfMonth,
  subDays,
} from "date-fns";

export const stringToDate = (d: string): Date => {
  return parse(d, "yyyy-MM-dd", new Date());
};

export const toISODateString = (date: Date): string => {
  return format(date, "yyyy-MM-dd");
};

export const toMonthYear = (date: Date): string => {
  return format(date, "MMMM yyyy");
};

export const isDaySame = (date: Date, selectedDate: Date): boolean => {
  return isSameDay(date, selectedDate);
};

export const isMonthSame = (date: Date, selectedDate: Date): boolean => {
  return isSameMonth(date, selectedDate);
};

export const getStartOfDay = (date: Date): Date => {
  return startOfDay(date);
};

export const getCalendarDates = (date: Date): Date[] => {
  let startOfCalendar = startOfMonth(date);
  let endOfCalendar = endOfMonth(date);
  if (!isMonday(startOfCalendar)) {
    startOfCalendar = previousMonday(startOfCalendar);
  }
  if (!isSunday(endOfCalendar)) {
    endOfCalendar = nextSunday(endOfCalendar);
  }
  const dates = eachDayOfInterval({
    start: startOfCalendar,
    end: endOfCalendar,
  });

  return dates;
};

export const getStartOfPrevMonth = (date: Date): Date => {
  return startOfMonth(subDays(startOfMonth(date), 1));
};

export const getStartOfNextMonth = (date: Date): Date => {
  return addDays(endOfMonth(date), 1);
};

export const doesEventOverlapDate = (
  eventStart: Date,
  eventEnd: Date,
  calendarDate: Date,
): boolean => {
  return areIntervalsOverlapping(
    { start: eventStart, end: eventEnd },
    { start: startOfDay(calendarDate), end: endOfDay(calendarDate) },
  );
};
