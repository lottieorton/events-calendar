import type { Meta, StoryObj } from "@storybook/react-vite";
import { makeCalendar } from "../../../../lib/utils/test-utils";
import CalendarCard from "./CalendarCard";

const meta = {
  title: "Calendars/CalendarCard",
  component: CalendarCard,
  tags: ["autodocs"],
  args: {
    calendar: makeCalendar(),
    selected: true,
  },
} satisfies Meta<typeof CalendarCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Selected: Story = {};

export const Unselected: Story = {
  args: { selected: false },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col w-100 gap-1 max-w-full">
      <CalendarCard calendar={makeCalendar()} selected />
      <CalendarCard calendar={makeCalendar()} selected={false} />
      <CalendarCard
        calendar={makeCalendar({ name: "Work", color: "purple" })}
        selected
      />
      <CalendarCard
        calendar={makeCalendar({ name: "Work", color: "purple" })}
        selected={false}
      />
      <CalendarCard
        calendar={makeCalendar({ name: "Family", color: "green" })}
        selected
      />
      <CalendarCard
        calendar={makeCalendar({ name: "Family", color: "green" })}
        selected={false}
      />
      <CalendarCard
        calendar={makeCalendar({ name: "Household", color: "pink" })}
        selected
      />
      <CalendarCard
        calendar={makeCalendar({ name: "Household", color: "pink" })}
        selected={false}
      />
    </div>
  ),
};
