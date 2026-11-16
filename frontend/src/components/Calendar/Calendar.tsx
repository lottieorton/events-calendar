import { useState } from "react";
import CalendarView from "./CalendarView/CalendarView";
import CalendarControls from "./CalendarControls/CalendarControls";
import {
  getCalendarDates,
  getStartOfDay,
  isMonthSame,
} from "../../lib/utils/date-utils";
import { toast } from "react-toastify";
import { useEvents } from "../../features/events/hooks/event-hooks";
import { addEventsToCalendar } from "../../features/events/utils/event-utils";
import Alert from "../../ui/components/Alert/Alert";
import Spinner from "../../ui/components/Spinner/Spinner";

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(
    getStartOfDay(new Date()),
  );
  const [calendarDates, setCalendarDates] = useState<Date[]>(
    getCalendarDates(new Date()),
  );

  const { data: events = [], isLoading, isError } = useEvents();

  const calendarWithEvents = addEventsToCalendar(calendarDates, events);

  const updateDates = (date: Date) => {
    if (Number.isNaN(date.getTime())) {
      toast.error("Invalid date entered");
      return;
    }

    if (!isMonthSame(date, selectedDate)) {
      setCalendarDates(getCalendarDates(date));
    }
    setSelectedDate(date);
  };

  return (
    <section className="flex flex-col gap-4 px-4 pb-4 max-w-300 sm:px-6 lg:bg-stone-50 lg:py-4 lg:border lg:border-border lg:rounded-4xl 3xl:max-w-280">
      <CalendarControls selectedDate={selectedDate} updateDates={updateDates} />
      {isError && (
        <Alert variant="error" title="Failed to fetch events">
          Issue fetching calendar events. Please try refreshing the page.
        </Alert>
      )}
      {isLoading && <Spinner />}
      <CalendarView
        calendarDates={calendarWithEvents}
        selectedDate={selectedDate}
        updateDates={updateDates}
      />
    </section>
  );
}
