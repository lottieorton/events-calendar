import { useForm, type Resolver } from "react-hook-form";
import EventForm from "../EventForm/EventForm";
import { eventFormSchema, type EventFormValues } from "../EventForm/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateEvent } from "../../hooks/event-hooks";
import { toast } from "react-toastify";

interface CreateEventFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CreateEventForm({
  onSuccess,
  onCancel,
}: CreateEventFormProps) {
  const methods = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema) as Resolver<EventFormValues>,
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
