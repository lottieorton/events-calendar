import { useEffect, useState } from "react";
import CalendarView from "./CalendarView/CalendarView";
import CalendarControls from "./CalendarControls/CalendarControls";
import { type Event } from "../../features/events/types";
import {
  doesEventOverlapDate,
  getCalendarDates,
  getStartOfDay,
  isMonthSame,
} from "../../lib/utils/date-utils";
import { toast } from "react-toastify";

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(
    getStartOfDay(new Date()),
  );
  const [calendarDates, setCalendarDates] = useState<Date[]>([]);

  const events: Event[] = [
    {
      id: 1,
      title: "Hair cut",
      description: "Go to the salon to get this sorted",
      calendar: {
        id: 1,
        name: "Personal",
        color: "blue",
      },
      start_at: new Date(2026, 10, 5, 10, 0, 0),
      end_at: new Date(2026, 10, 5, 10, 30, 0),
      is_all_day: false,
    },
    {
      id: 2,
      title: "Put up the Christmas tree",
      description: "Get the lights up, tree up and start wrapping presents.",
      calendar: {
        id: 2,
        name: "Family",
        color: "purple",
      },
      start_at: new Date(2026, 10, 1, 0, 0, 0),
      end_at: new Date(2026, 10, 2, 0, 0, 0),
      is_all_day: true,
    },
    {
      id: 3,
      title: "Christmas Spirit",
      description: "Sing Christmas songs on repeat.",
      calendar: {
        id: 2,
        name: "Family",
        color: "purple",
      },
      start_at: new Date(2026, 10, 13, 11, 0, 0),
      end_at: new Date(2026, 10, 20, 8, 0, 0),
      is_all_day: false,
    },
    {
      id: 4,
      title: "Q4 Planning Meeting",
      description: "Quarterly review and roadmap planning with the team.",
      calendar: {
        id: 3,
        name: "Work",
        color: "green",
      },
      start_at: new Date(2026, 10, 13, 14, 0, 0),
      end_at: new Date(2026, 10, 13, 16, 0, 0),
      is_all_day: false,
    },
    {
      id: 5,
      title: "Dentist Appointment",
      description: "Routine checkup and cleaning.",
      calendar: {
        id: 1,
        name: "Personal",
        color: "blue",
      },
      start_at: new Date(2026, 10, 16, 9, 0, 0),
      end_at: new Date(2026, 10, 16, 10, 0, 0),
      is_all_day: false,
    },
    {
      id: 6,
      title: "Weekend Getaway",
      description: "Trip to the coast for a relaxing weekend.",
      calendar: {
        id: 4,
        name: "Travel",
        color: "pink",
      },
      start_at: new Date(2026, 9, 30, 17, 0, 0),
      end_at: new Date(2026, 10, 2, 19, 0, 0),
      is_all_day: false,
    },
    {
      id: 7,
      title: "Project Alpha Launch",
      description: "Final deployment and monitoring phase.",
      calendar: {
        id: 3,
        name: "Work",
        color: "green",
      },
      start_at: new Date(2026, 9, 27, 0, 0, 0),
      end_at: new Date(2026, 9, 28, 0, 0, 0),
      is_all_day: true,
    },
    {
      id: 8,
      title: "Dinner with Sarah",
      description: "Catching up over Italian food.",
      calendar: {
        id: 5,
        name: "Social",
        color: "pink",
      },
      start_at: new Date(2026, 9, 28, 19, 30, 0),
      end_at: new Date(2026, 9, 28, 21, 30, 0),
      is_all_day: false,
    },
    {
      id: 9,
      title: "Gym - Leg Day",
      description: "Squats, lunges, and regrets.",
      calendar: {
        id: 1,
        name: "Personal",
        color: "blue",
      },
      start_at: new Date(2026, 10, 13, 7, 0, 0),
      end_at: new Date(2026, 10, 13, 8, 30, 0),
      is_all_day: false,
    },
  ];

  const calendarWithEvents = calendarDates.map((c) => {
    const filteredEvents = events.filter((e) =>
      doesEventOverlapDate(e.start_at, e.end_at, c),
    );
    return { day: c, events: filteredEvents };
  });

  const updateDates = (date: Date) => {
    if (Number.isNaN(date.getTime())) {
      toast.error("Invalid date entered");
      return;
    }

    if (!isMonthSame(date, selectedDate)) {
      setCalendarDates(getCalendarDates(date));
    }
    setSelectedDate(date);
  };

  useEffect(() => {
    setCalendarDates(getCalendarDates(new Date()));
  }, []);

  return (
    <section className="flex flex-col gap-4 px-4 pb-4 max-w-300 sm:px-6 lg:bg-stone-50 lg:py-4 lg:border lg:border-border lg:rounded-4xl 3xl:max-w-280">
      <CalendarControls selectedDate={selectedDate} updateDates={updateDates} />
      <CalendarView
        calendarDates={calendarWithEvents}
        selectedDate={selectedDate}
        updateDates={updateDates}
      />
    </section>
  );
}
