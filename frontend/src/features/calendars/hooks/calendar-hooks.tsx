import { useQuery } from "@tanstack/react-query";
import type { Calendar } from "../types";
import { getAllCalendars } from "../api/calendar-api";

export const CALENDAR_KEY = "calendars";

export function useCalendars() {
  return useQuery<Calendar[]>({
    queryKey: [CALENDAR_KEY],
    queryFn: () => getAllCalendars(),
  });
}
