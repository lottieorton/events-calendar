import IconButton from "../../../ui/components/IconButton/IconButton";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import TextButton from "../../../ui/components/TextButton/TextButton";
import { addNumDays, toMonthYear } from "../../../lib/utils/date-utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface CalendarControlsProps {
  selectedDate: Date;
  updateDates: (date: Date, updateView?: "week" | "month") => void;
}

export default function WeekCalendarControls({
  selectedDate,
  updateDates,
}: CalendarControlsProps) {
  return (
    <section className="flex justify-between">
      <TextButton onClick={() => updateDates(selectedDate, "month")}>
        <FontAwesomeIcon icon={faAngleLeft} />
        {toMonthYear(selectedDate)}
      </TextButton>
      <div className="flex gap-2 items-center">
        <IconButton
          icon={faAngleLeft}
          label="Previous Week"
          onClick={() => updateDates(addNumDays(selectedDate, -7))}
        />
        <IconButton
          icon={faAngleRight}
          label="Next Week"
          onClick={() => updateDates(addNumDays(selectedDate, 7))}
        />
      </div>
    </section>
  );
}
