import type { Meta, StoryObj } from "@storybook/react-vite";
import TextButton from "./TextButton";
import { fn } from "storybook/test";

const meta = {
  title: "UI/TextButton",
  component: TextButton,
  tags: ["autodocs"],
  args: {
    children: "Add Event",
    handleClick: fn(),
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
