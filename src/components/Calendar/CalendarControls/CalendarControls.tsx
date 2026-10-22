import {
  addDays,
  endOfMonth,
  format,
  startOfMonth,
  subDays,
  toDate,
} from "date-fns";
import Button from "../../Buttons/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

interface CalendarControlsProps {
  selectedDate: Date;
  updateDates: (date: Date) => void;
}

export default function CalendarControls({
  selectedDate,
  updateDates,
}: CalendarControlsProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between">
        <h1 className="font-sans text-d-purple text-2xl font-extrabold 3xl:text-3xl">
          {format(selectedDate, "MMMM yyyy")}
        </h1>
        <div className="flex gap-2 items-center">
          <Button
            handleClick={() =>
              updateDates(startOfMonth(subDays(startOfMonth(selectedDate), 1)))
            }
          >
            <FontAwesomeIcon icon={faAngleLeft} aria-label="Previous Month" />
          </Button>
          <Button
            handleClick={() =>
              updateDates(addDays(endOfMonth(selectedDate), 1))
            }
          >
            <FontAwesomeIcon icon={faAngleRight} aria-label="Next Month" />
          </Button>
        </div>
      </div>
      <div className="flex justify-between">
        <form>
          <input
            id="date"
            type="date"
            value={format(selectedDate, "yyyy-MM-dd")}
            onChange={(e) => updateDates(toDate(e.target.value))}
            className="bg-stone-50 text-sm text-d-purple p-2 rounded-3xl border border-border 3xl:text-lg 3xl:p-3"
          />
        </form>
        <button
          onClick={() => updateDates(new Date())}
          aria-label="Today"
          className="text-secondary text-sm font-medium cursor-pointer hover:font-bold 3xl:text-lg"
        >
          Today
        </button>
      </div>
    </div>
  );
}
