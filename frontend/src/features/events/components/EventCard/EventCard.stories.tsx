import type { Meta, StoryObj } from "@storybook/react-vite";
import EventCard from "./EventCard";
import { makeEvent } from "../../../../lib/utils/test-utils";

const meta = {
  title: "Events/EventCard",
  component: EventCard,
  tags: ["autodocs"],
  args: {
    event: makeEvent({
      startAt: new Date(2026, 10, 24, 8, 0, 0),
      endAt: new Date(2026, 10, 24, 13, 30, 0),
    }),
    selectedDate: new Date(2026, 10, 24),
  },
  decorators: [
    (Story) => (
      <div className="w-200">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof EventCard>;
export default meta;
type Story = StoryObj<typeof EventCard>;

export const Basic: Story = {
  args: {
    event: makeEvent({
      description: undefined,
      startAt: new Date(2026, 10, 24, 8, 0, 0),
      endAt: new Date(2026, 10, 24, 13, 30, 0),
    }),
  },
};

export const WithDescription: Story = {};

export const DayEvent: Story = {};

export const AllDayEvent: Story = {
  args: {
    event: makeEvent({
      isAllDay: true,
    }),
  },
};

export const StartDayEvent: Story = {
  args: {
    event: makeEvent({
      startAt: new Date(2026, 10, 24, 8, 0, 0),
      endAt: new Date(2026, 10, 25, 13, 30, 0),
    }),
  },
};

export const EndDayEvent: Story = {
  args: {
    event: makeEvent({
      startAt: new Date(2026, 10, 23, 8, 0, 0),
      endAt: new Date(2026, 10, 24, 13, 30, 0),
    }),
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col w-200 gap-3">
      <EventCard
        event={makeEvent({
          startAt: new Date(2026, 10, 24, 8, 0, 0),
          endAt: new Date(2026, 10, 24, 13, 30, 0),
        })}
        selectedDate={new Date(2026, 10, 24)}
      />
      <EventCard
        event={makeEvent({
          calendar: { id: 1, name: "personal", color: "purple" },
          isAllDay: true,
        })}
        selectedDate={new Date(2026, 10, 24)}
      />
      <EventCard
        event={makeEvent({
          startAt: new Date(2026, 10, 24, 8, 0, 0),
          endAt: new Date(2026, 10, 25, 13, 30, 0),
          calendar: { id: 1, name: "personal", color: "green" },
        })}
        selectedDate={new Date(2026, 10, 24)}
      />
      <EventCard
        event={makeEvent({
          startAt: new Date(2026, 10, 23, 8, 0, 0),
          endAt: new Date(2026, 10, 24, 9, 0, 0),
        })}
        selectedDate={new Date(2026, 10, 24)}
      />
    </div>
  ),
};
