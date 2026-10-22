import { useEffect, useState } from "react";
import Button from "../Buttons/Button";
import DateCard from "../DateCard/DateCard";
import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  format,
  isMonday,
  isSameDay,
  isSameMonth,
  isSunday,
  nextSunday,
  previousMonday,
  startOfDay,
  startOfMonth,
  subDays,
  toDate,
} from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(
    startOfDay(new Date()),
  );
  const [calendarDates, setCalendarDates] = useState<Date[]>([]);

  const getCalendarDates = (date: Date): void => {
    let startOfCalendar = startOfMonth(date);
    let endOfCalendar = endOfMonth(date);
    if (!isMonday(startOfCalendar)) {
      startOfCalendar = previousMonday(startOfCalendar);
    }
    if (!isSunday(endOfCalendar)) {
      endOfCalendar = nextSunday(endOfCalendar);
    }
    const dates = eachDayOfInterval({
      start: startOfCalendar,
      end: endOfCalendar,
    });
    setCalendarDates(dates);
  };

  useEffect(() => {
    getCalendarDates(new Date());
  }, []);

  const updateDates = (date: Date) => {
    if (!isSameMonth(date, selectedDate)) {
      getCalendarDates(date);
    }
    setSelectedDate(date);
  };

  return (
    <section className="flex flex-col gap-4 px-4 pb-4 max-w-240 sm:px-6 lg:py-4 3xl:max-w-280">
      <div className="flex justify-between w-full">
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
      <div className="flex flex-col p-4 gap-2 bg-stone-50 rounded-3xl border border-border md:p-6">
        <div className="grid grid-cols-7 gap-2 justify-items-center">
          <p className="text-xs text-center text-pale-purple font-semibold 3xl:text-base">
            Mon
          </p>
          <p className="text-xs text-center text-pale-purple font-semibold 3xl:text-base">
            Tue
          </p>
          <p className="text-xs text-center text-pale-purple font-semibold 3xl:text-base">
            Wed
          </p>
          <p className="text-xs text-center text-pale-purple font-semibold 3xl:text-base">
            Thu
          </p>
          <p className="text-xs text-center text-pale-purple font-semibold 3xl:text-base">
            Fri
          </p>
          <p className="text-xs text-center text-pale-purple font-semibold 3xl:text-base">
            Sat
          </p>
          <p className="text-xs text-center text-pale-purple font-semibold 3xl:text-base">
            Sun
          </p>
        </div>
        <div className="grid grid-cols-7 justify-items-center gap-1 md:gap-0 md:border md:border-border">
          {calendarDates.map((d) => {
            return (
              <DateCard
                date={d}
                isSelected={isSameDay(d, selectedDate)}
                key={d.toDateString()}
                handleClick={() => updateDates(d)}
                isCurrentMonth={isSameMonth(d, selectedDate)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
