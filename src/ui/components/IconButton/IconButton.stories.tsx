import type { Meta, StoryObj } from "@storybook/react-vite";
import IconButton from "./IconButton";
import { fn } from "storybook/test";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";

const meta = {
  title: "UI/IconButton",
  component: IconButton,
  tags: ["autodocs"],
  args: {
    icon: faAngleRight,
    label: "Next",
    handleClick: fn(),
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
