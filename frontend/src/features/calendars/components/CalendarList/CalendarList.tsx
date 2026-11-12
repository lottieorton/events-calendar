import type { Calendar } from "../../types";
import CalendarCard from "../CalendarCard/CalendarCard";

export default function CalendarList() {
  const calendars = [
    { id: 1, name: "Personal", color: "purple" },
    { id: 2, name: "Family", color: "blue" },
    { id: 3, name: "Work", color: "pink" },
    { id: 4, name: "Work", color: "green" },
  ] as Calendar[];

  return (
    <section className="flex flex-col gap-2 p-4">
      <h2 className="font-main font-semibold text-sm 3xl:text-base">
        My Calendars
      </h2>
      {calendars.map((c) => {
        return <CalendarCard key={c.id} calendar={c} selected />;
      })}
    </section>
  );
}
