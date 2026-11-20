import type { Meta, StoryObj } from "@storybook/react-vite";
import TextAreaField from "./TextAreaField";

const meta = {
  title: "UI/FormFields/TextAreaField",
  component: TextAreaField,
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
    label: "Description",
    error: "",
  },
} satisfies Meta<typeof TextAreaField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithError: Story = {
  args: { error: "Description is required" },
};

export const Required: Story = {
  args: { required: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};
