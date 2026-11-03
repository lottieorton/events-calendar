import type { Meta, StoryObj } from "@storybook/react-vite";
import { getCalendarDates } from "../../../lib/utils/date-utils";
import CalendarView from "./CalendarView";
import { fn } from "storybook/test";

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
    calendarDates: getCalendarDates(new Date("11/03/2026")),
    selectedDate: new Date("11/03/2026"),
  },
};

export const OnlyCurrentMonthDays: Story = {
  args: {
    calendarDates: getCalendarDates(new Date("02/01/2027")),
    selectedDate: new Date("02/01/2027"),
  },
};
