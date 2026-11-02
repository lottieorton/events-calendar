import type { Meta, StoryObj } from "@storybook/react-vite";
import Alert from "./Alert";

const meta = {
  title: "UI/Alert",
  component: Alert,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="max-w-xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof Alert>;

export const ErrorState: Story = {
  args: {
    variant: "error",
    children: "There was an issue fetching events, try refreshing the page",
  },
};

export const InfoState: Story = {
  args: {
    variant: "info",
    children: "Couldn't find any events. Please create another one",
  },
};

export const WithTitle: Story = {
  args: {
    variant: "error",
    title: "Couldn't fetch events",
    children: "There was an issue fetching events, try refreshing the page",
  },
};
