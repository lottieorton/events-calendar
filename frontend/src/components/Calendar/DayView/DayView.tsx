import { faPlus } from "@fortawesome/free-solid-svg-icons";
import EventCard from "../../../features/events/components/EventCard/EventCard";
import type { Event } from "../../../features/events/types";
import { toDayOfWeekDate } from "../../../lib/utils/date-utils";
import IconButton from "../../../ui/components/IconButton/IconButton";

interface DayViewProps {
  events: Event[];
  selectedDate: Date;
  openModal: () => void;
}

export default function DayView({
  events,
  selectedDate,
  openModal,
}: DayViewProps) {
  return (
    <section className="flex flex-col gap-4 p-4 sm:p-6 lg:px-0 max-w-300 3xl:max-w-280">
      <div className="flex items-center justify-between">
        <h2 className="text-d-purple text-xl font-extrabold 3xl:text-2xl">
          {toDayOfWeekDate(selectedDate)}
        </h2>
        <IconButton
          icon={faPlus}
          label="Add event"
          onClick={openModal}
          variant="secondary"
        />
      </div>
      {events.length === 0 ? (
        <h3 className="text-pale-purple text-sm font-semibold 3xl:text-lg">
          No events
        </h3>
      ) : (
        events.map((e) => {
          return <EventCard event={e} selectedDate={selectedDate} key={e.id} />;
        })
      )}
    </section>
  );
}
