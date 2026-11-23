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
import Modal from "../../ui/components/Modal/Modal";
import CreateEventForm from "../../features/events/components/CreateEventForm/CreateEventForm";

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(
    getStartOfDay(new Date()),
  );
  const [calendarDates, setCalendarDates] = useState<Date[]>(
    getCalendarDates(new Date()),
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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
    setSelectedDate(getStartOfDay(date));
  };

  const openModal = () => setIsCreateModalOpen(true);
  const closeModal = () => setIsCreateModalOpen(false);

  return (
    <section className="flex flex-col gap-4 px-4 pb-4 max-w-300 sm:px-6 lg:bg-stone-50 lg:p-6 lg:border lg:border-border lg:rounded-4xl 3xl:max-w-280">
      <CalendarControls
        selectedDate={selectedDate}
        updateDates={updateDates}
        openModal={openModal}
      />
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
