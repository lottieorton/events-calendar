import type { Meta, StoryObj } from "@storybook/react-vite";
import CalendarList from "./CalendarList";

const meta = {
  title: "Calendars/CalendarList",
  component: CalendarList,
  tags: ["autodocs"],
} satisfies Meta<typeof CalendarList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
