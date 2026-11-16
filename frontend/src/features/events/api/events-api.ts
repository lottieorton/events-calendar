import { toApiError } from "../../../lib/utils/api-error";
import type { Event, EventResponse } from "../types";
import { toEvent } from "./event-mapper";

const API_URL = import.meta.env.VITE_API_URL;

export const getAllEvents = async (): Promise<Event[]> => {
  const response = await fetch(`${API_URL}/events`);

  if (!response.ok) {
    throw await toApiError(response, "Failed to fetch events");
  }

  const data: EventResponse[] = await response.json();
  return data.map(toEvent).filter((e): e is Event => e !== null);
};
