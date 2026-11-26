import { toApiError } from "../../../lib/utils/api-error";
import type { EventFormValues } from "../components/EventForm/schema";
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

export const createEvent = async (
  formData: EventFormValues,
): Promise<Event> => {
  const response = await fetch(`${API_URL}/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (response.status !== 201) {
    throw await toApiError(response, "Failed to create event");
  }

  const data: EventResponse = await response.json();
  const event = toEvent(data);

  if (!event) {
    throw new Error("Failed to map event response");
  }
  return event;
};

export const updateEvent = async (
  id: number,
  formData: EventFormValues,
): Promise<Event> => {
  const response = await fetch(`${API_URL}/events/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    throw await toApiError(response, "Failed to update event");
  }

  const data: EventResponse = await response.json();
  const event = toEvent(data);

  if (!event) {
    throw new Error("Failed to map event response");
  }
  return event;
};

export const deleteEvent = async (id: number): Promise<boolean> => {
  const response = await fetch(`${API_URL}/events/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw await toApiError(response, "Failed to delete event");
  }
  return true;
};
