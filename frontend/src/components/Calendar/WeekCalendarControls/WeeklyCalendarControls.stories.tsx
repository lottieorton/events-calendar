import { fn } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react-vite";
import WeekCalendarControls from "./WeekCalendarControls";

const meta = {
  title: "Calendar/WeekCalendarControls",
  component: WeekCalendarControls,
  tags: ["autodocs"],
  args: {
    selectedDate: new Date("11/03/2027"),
    updateDates: fn(),
  },
} satisfies Meta<typeof WeekCalendarControls>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
