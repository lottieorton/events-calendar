import type { Meta, StoryObj } from "@storybook/react-vite";
import { makeEvent } from "../../../lib/utils/test-utils";
import DayView from "./DayView";

const mockEvents = [
  makeEvent({
    startAt: new Date(2026, 10, 24, 0, 0, 0),
    endAt: new Date(2026, 10, 24, 23, 59, 59),
    isAllDay: true,
  }),
  makeEvent({
    id: 2,
    title: "Clean flat",
    calendar: { id: 2, name: "Personal", color: "purple" },
    startAt: new Date(2026, 10, 24, 18, 0, 0),
    endAt: new Date(2026, 10, 24, 20, 0, 0),
  }),
  makeEvent({
    id: 3,
    title: "Go to the gym",
    calendar: { id: 2, name: "Personal", color: "green" },
    startAt: new Date(2026, 10, 24, 20, 0, 0),
    endAt: new Date(2026, 10, 24, 21, 0, 0),
  }),
];

const meta = {
  title: "Calendar/DayView",
  component: DayView,
  tags: ["autodocs"],
  args: {
    events: mockEvents,
    selectedDate: new Date(2026, 10, 24),
  },
  decorators: [(Story) => <Story />],
} satisfies Meta<typeof DayView>;
export default meta;
type Story = StoryObj<typeof DayView>;

export const WithEvents: Story = {};

export const WithoutEvents: Story = {
  args: { events: [] },
};
