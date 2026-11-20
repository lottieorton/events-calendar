import type { Meta, StoryObj } from "@storybook/react-vite";
import InputField from "./InputField";

const meta = {
  title: "UI/FormFields/InputField",
  component: InputField,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
  args: {
    id: "1",
    label: "Title",
    error: "",
  },
} satisfies Meta<typeof InputField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Text: Story = {
  args: { type: "text" },
};

export const DateTime: Story = {
  args: { type: "datetime-local" },
};

export const WithError: Story = {
  args: { error: "Title is required" },
};

export const Required: Story = {
  args: { required: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};
