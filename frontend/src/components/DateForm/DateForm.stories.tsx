import type { Meta, StoryObj } from "@storybook/react-vite";
import DateForm from "./DateForm";
import { fn } from "storybook/test";

const meta = {
  title: "Components/DateForm",
  component: DateForm,
  tags: ["autodocs"],
  args: {
    selectedDate: new Date("01/11/2026"),
    onChange: fn(),
  },
} satisfies Meta<typeof DateForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
