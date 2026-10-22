import { useEffect, useState } from "react";
import {
  eachDayOfInterval,
  endOfMonth,
  isMonday,
  isSameMonth,
  isSunday,
  nextSunday,
  previousMonday,
  startOfDay,
  startOfMonth,
} from "date-fns";
import CalendarView from "./CalendarView/CalendarView";
import CalendarControls from "./CalendarControls/CalendarControls";

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(
    startOfDay(new Date()),
  );
  const [calendarDates, setCalendarDates] = useState<Date[]>([]);

  const getCalendarDates = (date: Date): void => {
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
    setCalendarDates(dates);
  };

  const updateDates = (date: Date) => {
    if (!isSameMonth(date, selectedDate)) {
      getCalendarDates(date);
    }
    setSelectedDate(date);
  };

  useEffect(() => {
    getCalendarDates(new Date());
  }, []);

  return (
    <section className="flex flex-col gap-4 px-4 pb-4 max-w-240 sm:px-6 lg:py-4 3xl:max-w-280">
      <CalendarControls selectedDate={selectedDate} updateDates={updateDates} />
      <CalendarView
        calendarDates={calendarDates}
        selectedDate={selectedDate}
        updateDates={updateDates}
      />
    </section>
  );
}
