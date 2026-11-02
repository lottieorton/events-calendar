import Button from "../../../ui/components/Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import TextButton from "../../../ui/components/TextButton/TextButton";
import DateForm from "../../DateForm/DateForm";
import {
  getStartOfNextMonth,
  getStartOfPrevMonth,
  stringToDate,
  toMonthYear,
} from "../../../lib/utils/date-utils";

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
          {toMonthYear(selectedDate)}
        </h1>
        <div className="flex gap-2 items-center">
          <Button
            handleClick={() => updateDates(getStartOfPrevMonth(selectedDate))}
          >
            <FontAwesomeIcon icon={faAngleLeft} aria-label="Previous Month" />
          </Button>
          <Button
            handleClick={() => updateDates(getStartOfNextMonth(selectedDate))}
          >
            <FontAwesomeIcon icon={faAngleRight} aria-label="Next Month" />
          </Button>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <DateForm
          selectedDate={selectedDate}
          onChange={(dateString) => updateDates(stringToDate(dateString))}
        />
        <TextButton
          variant="secondary"
          handleClick={() => updateDates(new Date())}
        >
          Today
        </TextButton>
      </div>
    </div>
  );
}
