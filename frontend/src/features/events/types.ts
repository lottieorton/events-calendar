import type { Calendar } from "../calendars/types";

export interface Event {
  id: number;
  title: string;
  description: string;
  calendar: Calendar;
  start_at: Date;
  end_at: Date;
  is_all_day: boolean;
}

export interface DateWithEvents {
  day: Date;
  events: Event[];
}
