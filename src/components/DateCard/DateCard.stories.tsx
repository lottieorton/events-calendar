import type { Meta, StoryObj } from "@storybook/react-vite";
import DateCard from "./DateCard";
import { fn } from "storybook/test";

const meta = {
  title: "Components/DateCard",
  component: DateCard,
  tags: ["autodocs"],
  args: {
    date: new Date("11/01/2026"),
    onClick: fn(),
  },
  decorators: [
    (Story) => (
      <div className="w-30">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DateCard>;
export default meta;
type Story = StoryObj<typeof DateCard>;

export const Default: Story = {};

export const Selected: Story = {
  args: {
    variant: "selected",
    date: new Date("11/10/2026"),
  },
};

export const Current: Story = {
  args: {
    variant: "current",
    date: new Date("11/21/2026"),
  },
};

export const Adjacent: Story = {
  args: {
    variant: "adjacent",
    date: new Date("11/30/2026"),
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex w-100 gap-1">
      <DateCard
        variant="current"
        date={new Date("11/01/2026")}
        onClick={fn()}
      />
      <DateCard
        variant="selected"
        date={new Date("11/02/2026")}
        onClick={fn()}
      />
      <DateCard
        variant="adjacent"
        date={new Date("11/03/2026")}
        onClick={fn()}
      />
    </div>
  ),
};
