import { useEffect, useState } from "react";
import CalendarView from "./CalendarView/CalendarView";
import CalendarControls from "./CalendarControls/CalendarControls";
import {
  getCalendarDates,
  getStartOfDay,
  isMonthSame,
} from "../../lib/utils/date-utils";

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(
    getStartOfDay(new Date()),
  );
  const [calendarDates, setCalendarDates] = useState<Date[]>([]);

  const updateDates = (date: Date) => {
    if (!isMonthSame(date, selectedDate)) {
      setCalendarDates(getCalendarDates(date));
    }
    setSelectedDate(date);
  };

  useEffect(() => {
    setCalendarDates(getCalendarDates(new Date()));
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
