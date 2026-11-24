import { useState } from "react";
import CalendarView from "./CalendarView/CalendarView";
import CalendarControls from "./CalendarControls/CalendarControls";
import {
  getCalendarDates,
  getStartOfDay,
  getWeekDates,
  isDaySame,
  isMonthSame,
} from "../../lib/utils/date-utils";
import { toast } from "react-toastify";
import { useEvents } from "../../features/events/hooks/event-hooks";
import {
  addEventsToCalendar,
  orderEvents,
} from "../../features/events/utils/event-utils";
import Alert from "../../ui/components/Alert/Alert";
import Spinner from "../../ui/components/Spinner/Spinner";
import Modal from "../../ui/components/Modal/Modal";
import CreateEventForm from "../../features/events/components/CreateEventForm/CreateEventForm";
import DayView from "./DayView/DayView";
import WeekCalendarControls from "./WeekCalendarControls/WeekCalendarControls";

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(
    getStartOfDay(new Date()),
  );
  const [calendarDates, setCalendarDates] = useState<Date[]>(
    getCalendarDates(new Date()),
  );
  const [isWeekView, setIsWeekView] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: events = [], isLoading, isError } = useEvents();

  const calendarWithEvents = addEventsToCalendar(
    calendarDates,
    orderEvents(events),
  );

  const updateDates = (date: Date, updateView?: "week" | "month") => {
    if (Number.isNaN(date.getTime())) {
      toast.error("Invalid date entered");
      return;
    }

    if (updateView === "month") {
      setCalendarDates(getCalendarDates(date));
      if (isWeekView) {
        setIsWeekView(false);
      }
    } else if (isWeekView || updateView === "week") {
      setCalendarDates(getWeekDates(date));
      if (updateView === "week" && !isWeekView) {
        setIsWeekView(true);
      }
    } else if (!isMonthSame(date, selectedDate)) {
      setCalendarDates(getCalendarDates(date));
    }

    setSelectedDate(getStartOfDay(date));
  };

  const selectedDateEvents =
    calendarWithEvents.filter((cE) => {
      return isDaySame(cE.day, selectedDate);
    })[0]?.events || [];

  const openModal = () => setIsCreateModalOpen(true);
  const closeModal = () => setIsCreateModalOpen(false);

  return (
    <section>
      <div className="flex flex-col gap-4 px-4 max-w-300 sm:px-6 lg:bg-stone-50 lg:p-6 lg:border lg:border-border lg:rounded-4xl 3xl:max-w-280">
        {isWeekView ? (
          <WeekCalendarControls
            selectedDate={selectedDate}
            updateDates={updateDates}
            openModal={openModal}
          />
        ) : (
          <CalendarControls
            selectedDate={selectedDate}
            updateDates={updateDates}
            openModal={openModal}
          />
        )}
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
      </div>
      {isWeekView && (
        <DayView
          events={selectedDateEvents}
          selectedDate={selectedDate}
          openModal={openModal}
        />
      )}
      <Modal open={isCreateModalOpen} title="Create Event" onClose={closeModal}>
        {isCreateModalOpen && (
          <CreateEventForm
            onSuccess={closeModal}
            onCancel={closeModal}
            selectedDate={selectedDate}
          />
        )}
      </Modal>
    </section>
  );
}
