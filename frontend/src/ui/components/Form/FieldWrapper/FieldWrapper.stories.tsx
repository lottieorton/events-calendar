import type { Meta, StoryObj } from "@storybook/react-vite";
import FieldWrapper from "./FieldWrapper";

const meta = {
  title: "UI/FormFields/FieldWrapper",
  component: FieldWrapper,
  tags: ["autodocs"],
  decorators: [(Story) => <Story />],
  args: {
    id: "1",
    label: "Field Wrapper Label",
    error: "",
  },
} satisfies Meta<typeof FieldWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div className="text-d-purple bg-white border border-border p-2 rounded-md text-sm 3xl:text-xl">
        Dummy Input Element
      </div>
    ),
  },
};
