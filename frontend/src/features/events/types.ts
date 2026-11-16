import type { Calendar, CalendarResponse } from "../calendars/types";

export interface Event {
  id: number;
  title: string;
  description: string;
  calendar: Calendar;
  startAt: Date;
  endAt: Date;
  isAllDay: boolean;
}

export interface DateWithEvents {
  day: Date;
  events: Event[];
}

export interface EventResponse {
  id: number;
  title: string;
  description: string;
  calendar: CalendarResponse;
  startAt: string;
  endAt: string;
  isAllDay: boolean;
}
