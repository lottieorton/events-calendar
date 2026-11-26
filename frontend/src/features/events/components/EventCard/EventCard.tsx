import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Event } from "../../types";
import {
  faCalendarDays,
  faPencil,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { calendarVariantClasses } from "../../../calendars/types";
import { getTimeLabels } from "../../utils/event-utils";

interface EventCardProps {
  event: Event;
  selectedDate: Date;
  onUpdate: (event: Event) => void;
}

export default function EventCard({
  event,
  selectedDate,
  onUpdate,
}: EventCardProps) {
  return (
    <article className="flex justify-between items-center bg-stone-50 py-2 px-3 rounded-xl border border-border">
      <div className="flex items-center gap-3">
        <div
          className={`flex items-center justify-center h-10 w-10 text-xl rounded-lg p-2 3xl:text-2xl ${calendarVariantClasses[event.calendar.color].iconColor}`}
        >
          <FontAwesomeIcon icon={faCalendarDays} />
        </div>
        <div className="flex flex-col gap-1">
          <div className="font-main text-xs text-pale-purple font-semibold 3xl:text-base">
            {getTimeLabels(event, selectedDate)}
          </div>
          <h3 className="text-md font-bold 3xl:text-xl">{event.title}</h3>
          <h4 className="text-sm text-pale-purple 3xl:text-lg">
            {event.description}
          </h4>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onUpdate(event)}
          className="text-green-600 cursor-pointer text-md 3xl:text-xl"
          aria-label="Update Event"
        >
          <FontAwesomeIcon icon={faPencil} />
        </button>
        <button
          onClick={() => {}}
          className="text-red-600 cursor-pointer text-md 3xl:text-xl"
          aria-label="Delete Event"
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </article>
  );
}
