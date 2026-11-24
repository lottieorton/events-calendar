import { useForm } from "react-hook-form";
import { fn } from "storybook/test";
import {
  eventFormSchema,
  type EventFormInput,
  type EventFormValues,
} from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import EventForm from "./EventForm";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const onSubmit = fn();
const onCancel = fn();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

interface FormWrapperProps {
  submitLabel: string;
  isSubmitting?: boolean;
  showErrors?: boolean;
  defaultValues?: Partial<EventFormInput>;
}

function FormWrapper({
  submitLabel,
  isSubmitting = false,
  showErrors = false,
  defaultValues,
}: FormWrapperProps) {
  const methods = useForm<EventFormInput, any, EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: defaultValues,
  });

  useEffect(() => {
    if (showErrors) methods.trigger();
  }, [showErrors, methods]);

  return (
    <EventForm
      methods={methods}
      submitLabel={submitLabel}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isSubmitting={isSubmitting}
    />
  );
}

const meta = {
  title: "Events/EventForm",
  component: FormWrapper,
  decorators: [
    (Story) => {
      window.fetch = async (url) => {
        if (url.toString().includes("calendars")) {
          return {
            ok: true,
            status: 200,
            json: async () => [
              { id: 1, name: "Personal", color: "blue" },
              { id: 2, name: "Work", color: "purple" },
            ],
          } as Response;
        }
        return Promise.reject(new Error("Unmocked request in Storybook"));
      };
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
    submitLabel: "Create Event",
  },
} satisfies Meta<typeof FormWrapper>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const WithValidationErrors: Story = {
  args: { showErrors: true },
};

export const WithDateTimeStartAndEnd: Story = {
  args: {
    defaultValues: {
      title: "Default title",
      calendarId: 1,
      description: "Default description",
      startAt: "2026-11-23T13:00",
      endAt: "2026-11-23T14:00",
      isAllDay: false,
    },
  },
};

export const WithDateStartAndEnd: Story = {
  args: {
    defaultValues: {
      title: "Default title",
      calendarId: 1,
      description: "Default description",
      startAt: "2026-11-23",
      endAt: "2026-11-23",
      isAllDay: true,
    },
  },
};
