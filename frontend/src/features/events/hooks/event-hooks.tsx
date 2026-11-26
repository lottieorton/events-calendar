import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createEvent,
  deleteEvent,
  getAllEvents,
  updateEvent,
} from "../api/events-api";
import type { Event } from "../types";
import type { EventFormValues } from "../components/EventForm/schema";

export const EVENTS_KEY = "events";

export function useEvents() {
  return useQuery<Event[]>({
    queryKey: [EVENTS_KEY],
    queryFn: () => getAllEvents(),
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation<Event, Error, EventFormValues>({
    mutationFn: (formData) => createEvent(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EVENTS_KEY] });
    },
  });
}

interface UpdateEventPayload {
  id: number;
  formData: EventFormValues;
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation<Event, Error, UpdateEventPayload>({
    mutationFn: ({ id, formData }) => updateEvent(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EVENTS_KEY] });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, number>({
    mutationFn: (id) => deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EVENTS_KEY] });
    },
  });
}
