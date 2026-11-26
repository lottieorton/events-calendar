import type { Meta, StoryObj } from "@storybook/react-vite";
import { makeEvent } from "../../../../lib/utils/test-utils";
import { fn } from "storybook/test";
import DeleteEventCheck from "./DeleteEventCheck";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const meta = {
  title: "Events/DeleteEventCheck",
  component: DeleteEventCheck,
  decorators: [
    (Story) => {
      return (
        <QueryClientProvider client={queryClient}>
          <div className="border border-border">
            <Story />
          </div>
        </QueryClientProvider>
      );
    },
  ],
  tags: ["autodocs"],
  args: {
    event: makeEvent({
      startAt: new Date(2026, 10, 24, 8, 0, 0),
      endAt: new Date(2026, 10, 24, 13, 30, 0),
    }),
    onSuccess: fn(),
    onCancel: fn(),
  },
} satisfies Meta<typeof DeleteEventCheck>;
export default meta;
type Story = StoryObj<typeof DeleteEventCheck>;

export const Default: Story = {};
