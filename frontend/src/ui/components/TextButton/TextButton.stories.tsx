import type { Meta, StoryObj } from "@storybook/react-vite";
import TextButton from "./TextButton";
import { fn } from "storybook/test";

const meta = {
  title: "UI/TextButton",
  component: TextButton,
  tags: ["autodocs"],
  args: {
    children: "Add Event",
    onClick: fn(),
  },
} satisfies Meta<typeof TextButton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Primary: Story = {
  args: { variant: "primary" },
};
export const Secondary: Story = {
  args: { variant: "secondary" },
};
export const Small: Story = {
  args: { size: "sm" },
};
export const Large: Story = {
  args: { size: "lg" },
};
export const Disabled: Story = {
  args: { disabled: true },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col w-40 gap-3">
      <div>
        <TextButton>Small Primary</TextButton>
      </div>
      <div>
        <TextButton variant="secondary">Small Secondary</TextButton>
      </div>
      <div>
        <TextButton size="lg">Large Primary</TextButton>
      </div>
      <div>
        <TextButton variant="secondary" size="lg">
          Large Secondary
        </TextButton>
      </div>
      <div>
        <TextButton disabled>Primary Disbled</TextButton>
      </div>
      <div>
        <TextButton variant="secondary" disabled>
          Secondary Disbled
        </TextButton>
      </div>
    </div>
  ),
};
