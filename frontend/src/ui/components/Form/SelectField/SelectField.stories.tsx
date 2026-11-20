import type { Meta, StoryObj } from "@storybook/react-vite";
import SelectField from "./SelectField";

const opts = [
  { label: "Personal", value: 1 },
  { label: "Family", value: 2 },
  { label: "Work", value: 3 },
];

const meta = {
  title: "UI/FormFields/SelectField",
  component: SelectField,
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
    label: "Calendar",
    options: opts,
    error: "",
  },
} satisfies Meta<typeof SelectField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithError: Story = {
  args: { error: "Calendar is required" },
};

export const Required: Story = {
  args: { required: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};
