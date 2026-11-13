import { useQuery } from "@tanstack/react-query";
import type { CalendarResponse } from "../types";
import { getAllCalendars } from "../api/calendar-api";

export const CALENDAR_KEY = "calendars";

export function useCalendars() {
  return useQuery<CalendarResponse[]>({
    queryKey: [CALENDAR_KEY],
    queryFn: () => getAllCalendars(),
  });
}
