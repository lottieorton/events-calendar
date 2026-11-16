import CalendarCard from "../CalendarCard/CalendarCard";
import { useCalendars } from "../../hooks/calendar-hooks";
import Alert from "../../../../ui/components/Alert/Alert";
import Spinner from "../../../../ui/components/Spinner/Spinner";

export default function CalendarList() {
  const { data: calendars = [], isLoading, isError } = useCalendars();

  if (isError) {
    return (
      <Alert variant="error" title="Failed to fetch calendars">
        Issue fetching calendars. Please try refreshing the page.
      </Alert>
    );
  }

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <section className="flex flex-col gap-2">
      <h2 className="font-main font-semibold text-sm 3xl:text-base">
        My Calendars
      </h2>
      {calendars.map((c) => {
        return <CalendarCard key={c.id} calendar={c} selected />;
      })}
    </section>
  );
}
