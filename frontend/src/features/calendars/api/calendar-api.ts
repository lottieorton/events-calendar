import { toApiError } from "../../../lib/utils/api-error";
import type { Calendar } from "../types";
import { toCalendar } from "../utils/calendar-utils";

const API_URL = import.meta.env.VITE_API_URL;

export const getAllCalendars = async (): Promise<Calendar[]> => {
  const response = await fetch(`${API_URL}/calendars`);
  if (!response.ok) {
    throw await toApiError(response, "Failed to fetch calendars");
  }
  const data = await response.json();

  return data.map(toCalendar);
};
