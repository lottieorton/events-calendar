import Alert from "../../../../ui/components/Alert/Alert";
import TextButton from "../../../../ui/components/TextButton/TextButton";
import { useDeleteEvent } from "../../hooks/event-hooks";
import type { Event } from "../../types";

interface DeleteEventCheckProps {
  event: Event;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function DeleteEventCheck({
  event,
  onSuccess,
  onCancel,
}: DeleteEventCheckProps) {
  const { mutate: deleteEvent, isPending, isError } = useDeleteEvent();

  const onDelete = (eventId: number): void => {
    deleteEvent(eventId, {
      onSuccess: () => {
        onSuccess();
      },
    });
  };

  return (
    <div className="flex flex-col gap-2">
      {isError && (
        <Alert variant="error" title="Error deleting event">
          Something went wrong. Please try again or refresh the page.
        </Alert>
      )}
      <p className="font-main pb-3 text-base">
        Are you sure you want to delete{" "}
        <span className="font-extrabold text-secondary">{event.title}</span>?
      </p>
      <div className="grid grid-cols-2 w-full gap-2">
        <TextButton variant="secondary" size="lg" onClick={onCancel}>
          Cancel
        </TextButton>
        <TextButton
          size="lg"
          onClick={() => onDelete(event.id)}
          disabled={isPending}
        >
          Delete
        </TextButton>
      </div>
    </div>
  );
}
