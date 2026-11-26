import { useForm } from "react-hook-form";
import {
  type EventFormInput,
  eventFormSchema,
  type EventFormValues,
} from "../EventForm/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import EventForm from "../EventForm/EventForm";
import type { Event } from "../../types";
import {
  toDateTimeString,
  toISODateString,
} from "../../../../lib/utils/date-utils";
import { useUpdateEvent } from "../../hooks/event-hooks";
import Alert from "../../../../ui/components/Alert/Alert";

interface UpdateEventFormProps {
  event: Event;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function UpdateEventForm({
  onSuccess,
  onCancel,
  event,
}: UpdateEventFormProps) {
  const { mutate: updateEvent, isPending, isError } = useUpdateEvent();

  const eventFormDefaults = {
    ...event,
    calendarId: event.calendar.id,
    startAt: event.isAllDay
      ? toISODateString(event.startAt)
      : toDateTimeString(event.startAt),
    endAt: event.isAllDay
      ? toISODateString(event.endAt)
      : toDateTimeString(event.endAt),
  };

  const methods = useForm<EventFormInput, any, EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: eventFormDefaults,
  });

  const onSubmit = async (formData: EventFormValues) => {
    updateEvent(
      { id: event.id, formData },
      {
        onSuccess: () => {
          onSuccess();
        },
      },
    );
  };

  return (
    <div>
      {isError && (
        <Alert variant="error" title="Error updating this event">
          Please check the details and try again.
        </Alert>
      )}
      <EventForm
        methods={methods}
        submitLabel="Save Changes"
        onSubmit={onSubmit}
        onCancel={onCancel}
        isSubmitting={isPending}
      />
    </div>
  );
}
