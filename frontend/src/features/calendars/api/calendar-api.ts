import { toApiError } from "../../../lib/utils/api-error";
import type { CalendarResponse } from "../types";

const API_URL = import.meta.env.VITE_API_URL;

export const getAllCalendars = async (): Promise<CalendarResponse[]> => {
  const response = await fetch(`${API_URL}/calendars`);
  if (!response.ok) {
    throw await toApiError(response, "Failed to fetch calendars");
  }
  return response.json();
};
