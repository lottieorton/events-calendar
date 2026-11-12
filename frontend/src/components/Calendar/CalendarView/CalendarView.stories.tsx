import type { Meta, StoryObj } from "@storybook/react-vite";
import CalendarView from "./CalendarView";
import { fn } from "storybook/test";
import { makeEvent } from "../../../lib/utils/test-utils";
import { makeDateEvents, makeDateList } from "../../../lib/utils/test-utils";

const mockEvents = [
  makeEvent({
    start_at: new Date(2026, 9, 27, 11, 0, 0),
    end_at: new Date(2026, 9, 27, 12, 0, 0),
  }),
  makeEvent({
    id: 2,
    title: "Clean flat",
    calendar: { id: 2, name: "Personal", color: "purple" },
    start_at: new Date(2026, 10, 6, 17, 0, 0),
    end_at: new Date(2026, 10, 6, 19, 0, 0),
  }),
  makeEvent({
    id: 3,
    title: "Go to the gym",
    start_at: new Date(2026, 10, 6, 19, 0, 0),
    end_at: new Date(2026, 10, 6, 20, 0, 0),
  }),
  makeEvent({
    id: 3,
    title: "Morning walk",
    calendar: { id: 2, name: "Personal", color: "purple" },
    start_at: new Date(2026, 10, 10, 8, 0, 0),
    end_at: new Date(2026, 10, 10, 9, 0, 0),
  }),
  makeEvent({
    id: 3,
    title: "Doctors appointment",
    calendar: { id: 2, name: "Personal", color: "purple" },
    start_at: new Date(2026, 10, 10, 9, 0, 0),
    end_at: new Date(2026, 10, 10, 9, 15, 0),
  }),
  makeEvent({
    id: 3,
    title: "Do food shop",
    start_at: new Date(2026, 10, 10, 17, 0, 0),
    end_at: new Date(2026, 10, 10, 18, 0, 0),
  }),
  makeEvent({
    id: 3,
    title: "Go to the cinema",
    start_at: new Date(2026, 10, 10, 20, 0, 0),
    end_at: new Date(2026, 10, 10, 22, 30, 0),
  }),
  makeEvent({
    id: 3,
    title: "Run 5km",
    start_at: new Date(2026, 10, 6, 17, 0, 0),
    end_at: new Date(2026, 10, 6, 19, 0, 0),
  }),
  makeEvent({
    id: 3,
    title: "Holiday",
    start_at: new Date(2026, 10, 21, 0, 0, 0),
    end_at: new Date(2026, 10, 28, 0, 0, 0),
  }),
];

const meta = {
  title: "Calendar/CalendarView",
  component: CalendarView,
  tags: ["autodocs"],
  args: {
    updateDates: fn(),
  },
} satisfies Meta<typeof CalendarView>;
export default meta;

type Story = StoryObj<typeof meta>;

export const WithAdjacentMonthDays: Story = {
  args: {
    calendarDates: makeDateEvents(
      makeDateList(new Date(2026, 9, 26), new Date(2026, 11, 6)),
      [],
    ),
    selectedDate: new Date("11/03/2026"),
  },
};

export const OnlyCurrentMonthDays: Story = {
  args: {
    calendarDates: makeDateEvents(
      makeDateList(new Date(2027, 1, 1), new Date(2027, 1, 28)),
      [],
    ),
    selectedDate: new Date("02/01/2027"),
  },
};

export const WithEvents: Story = {
  args: {
    calendarDates: makeDateEvents(
      makeDateList(new Date(2026, 9, 26), new Date(2026, 11, 6)),
      mockEvents,
    ),
    selectedDate: new Date("11/03/2026"),
  },
};
