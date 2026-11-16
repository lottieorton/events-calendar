import { useQuery } from "@tanstack/react-query";
import { getAllEvents } from "../api/events-api";
import type { Event } from "../types";

export const EVENTS_KEY = "events";

export function useEvents() {
  return useQuery<Event[]>({
    queryKey: [EVENTS_KEY],
    queryFn: () => getAllEvents(),
  });
}
