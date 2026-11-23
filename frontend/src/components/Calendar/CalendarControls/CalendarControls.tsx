import IconButton from "../../../ui/components/IconButton/IconButton";
import {
  faAngleLeft,
  faAngleRight,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import TextButton from "../../../ui/components/TextButton/TextButton";
import DateForm from "../../DateForm/DateForm";
import {
  getStartOfNextMonth,
  getStartOfPrevMonth,
  stringToDate,
  toMonthYear,
} from "../../../lib/utils/date-utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface CalendarControlsProps {
  selectedDate: Date;
  updateDates: (date: Date) => void;
  openModal: () => void;
}

export default function CalendarControls({
  selectedDate,
  updateDates,
  openModal,
}: CalendarControlsProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between">
        <h1 className="text-d-purple text-2xl font-extrabold 3xl:text-3xl">
          {toMonthYear(selectedDate)}
        </h1>
        <div className="flex gap-2 items-center">
          <IconButton
            icon={faAngleLeft}
            label="Previous Month"
            onClick={() => updateDates(getStartOfPrevMonth(selectedDate))}
          />
          <IconButton
            icon={faAngleRight}
            label="Next Month"
            onClick={() => updateDates(getStartOfNextMonth(selectedDate))}
          />
        </div>
      </div>
      <div className="flex justify-between items-center">
        <DateForm
          selectedDate={selectedDate}
          onChange={(dateString) => updateDates(stringToDate(dateString))}
        />
        <div className="flex flex-wrap justify-end items-center gap-3">
          <TextButton onClick={openModal}>
            <FontAwesomeIcon icon={faPlus} /> New Event
          </TextButton>
          <TextButton
            variant="secondary"
            onClick={() => updateDates(new Date())}
          >
            Today
          </TextButton>
        </div>
      </div>
    </div>
  );
}
