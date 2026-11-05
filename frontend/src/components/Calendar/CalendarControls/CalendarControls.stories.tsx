import { fn } from "storybook/test";
import CalendarControls from "./CalendarControls";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Calendar/CalendarControls",
  component: CalendarControls,
  tags: ["autodocs"],
  args: {
    selectedDate: new Date("11/03/2027"),
    updateDates: fn(),
  },
} satisfies Meta<typeof CalendarControls>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
