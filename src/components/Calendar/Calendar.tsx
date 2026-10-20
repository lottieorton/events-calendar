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
    <section className="flex flex-col gap-4">
      <div className="flex justify-between w-full">
        <h1 className="font-sans text-d-purple text-2xl font-extrabold">
          {format(selectedDate, "MMMM yyyy")}
        </h1>
        <div className="flex gap-2">
          <Button
            handleClick={() =>
              updateDates(startOfMonth(subDays(startOfMonth(selectedDate), 1)))
            }
          >
            <i
              className="fa-solid fa-angle-left text-d-purple"
              aria-label="Previous Month"
            ></i>
          </Button>
          <Button
            handleClick={() =>
              updateDates(addDays(endOfMonth(selectedDate), 1))
            }
          >
            <i
              className="fa-solid fa-angle-right text-d-purple"
              aria-label="Next Month"
            ></i>
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
            className="bg-stone-50 text-sm text-d-purple p-2 rounded-3xl border border-[#EEDDE1]"
          />
        </form>
        <button
          onClick={() => updateDates(new Date())}
          aria-label="Today"
          className="text-d-pink text-sm font-medium cursor-pointer hover:font-bold"
        >
          Today
        </button>
      </div>
      <div className="grid grid-cols-7 p-4 gap-2 bg-stone-50 rounded-3xl border border-[#EEDDE1] justify-items-center">
        <p className="text-xs text-center text-pale-purple font-semibold">
          Mon
        </p>
        <p className="text-xs text-center text-pale-purple font-semibold">
          Tue
        </p>
        <p className="text-xs text-center text-pale-purple font-semibold">
          Wed
        </p>
        <p className="text-xs text-center text-pale-purple font-semibold">
          Thu
        </p>
        <p className="text-xs text-center text-pale-purple font-semibold">
          Fri
        </p>
        <p className="text-xs text-center text-pale-purple font-semibold">
          Sat
        </p>
        <p className="text-xs text-center text-pale-purple font-semibold">
          Sun
        </p>
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
    </section>
  );
}
