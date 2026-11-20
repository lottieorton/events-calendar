import type { Meta, StoryObj } from "@storybook/react-vite";
import Modal from "./Modal";
import { fn } from "storybook/test";

const meta = {
  title: "UI/Modal",
  component: Modal,
  tags: ["autodocs"],
  decorators: [(Story) => <Story />],
  args: {
    open: true,
    title: "Modal",
    children: "Text in the modal",
    onClose: fn(),
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
