import { useForm } from "react-hook-form";
import EventForm from "../EventForm/EventForm";
import {
  eventFormSchema,
  type EventFormInput,
  type EventFormValues,
} from "../EventForm/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateEvent } from "../../hooks/event-hooks";
import { toast } from "react-toastify";
import {
  addNumHours,
  toDateTimeString,
} from "../../../../lib/utils/date-utils";

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

  const { mutate: createEvent, isPending } = useCreateEvent();

  const onSubmit = async (formData: EventFormValues) => {
    createEvent(formData, {
      onSuccess: () => {
        onSuccess();
      },
      onError: (err) => {
        const errorMsg = err.message || "Unable to create this event";
        toast.error(errorMsg);
      },
    });
  };

  return (
    <EventForm
      methods={methods}
      submitLabel="Create Event"
      onSubmit={onSubmit}
      onCancel={onCancel}
      isSubmitting={isPending}
    />
  );
}
