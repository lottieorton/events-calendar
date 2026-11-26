import { useForm } from "react-hook-form";
import EventForm from "../EventForm/EventForm";
import {
  eventFormSchema,
  type EventFormInput,
  type EventFormValues,
} from "../EventForm/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateEvent } from "../../hooks/event-hooks";
import {
  addNumHours,
  toDateTimeString,
} from "../../../../lib/utils/date-utils";
import Alert from "../../../../ui/components/Alert/Alert";

interface CreateEventFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  selectedDate: Date;
}

export default function CreateEventForm({
  onSuccess,
  onCancel,
  selectedDate,
}: CreateEventFormProps) {
  const eventFormDefaults = {
    title: "",
    description: "",
    startAt: toDateTimeString(
      addNumHours(selectedDate, new Date().getHours() + 1),
    ),
    endAt: toDateTimeString(
      addNumHours(selectedDate, new Date().getHours() + 2),
    ),
    isAllDay: false,
  };

  const methods = useForm<EventFormInput, any, EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: eventFormDefaults,
  });

  const { mutate: createEvent, isPending, isError } = useCreateEvent();

  const onSubmit = async (formData: EventFormValues) => {
    createEvent(formData, {
      onSuccess: () => {
        onSuccess();
      },
    });
  };

  return (
    <div>
      {isError && (
        <Alert variant="error" title="Error creating event">
          Please check the details and try again.
        </Alert>
      )}
      <EventForm
        methods={methods}
        submitLabel="Create Event"
        onSubmit={onSubmit}
        onCancel={onCancel}
        isSubmitting={isPending}
      />
    </div>
  );
}
