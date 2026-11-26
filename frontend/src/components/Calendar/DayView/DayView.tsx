import { faPlus } from "@fortawesome/free-solid-svg-icons";
import EventCard from "../../../features/events/components/EventCard/EventCard";
import type { Event } from "../../../features/events/types";
import { toDayOfWeekDate } from "../../../lib/utils/date-utils";
import IconButton from "../../../ui/components/IconButton/IconButton";
import Modal from "../../../ui/components/Modal/Modal";
import { useState } from "react";
import UpdateEventForm from "../../../features/events/components/UpdateEventForm/UpdateEventForm";

interface DayViewProps {
  events: Event[];
  selectedDate: Date;
  openCreateModal: () => void;
}

export type ModalState =
  null | { type: "update"; event: Event } | { type: "delete"; event: Event };

export default function DayView({
  events,
  selectedDate,
  openCreateModal,
}: DayViewProps) {
  const [modal, setModal] = useState<ModalState>(null);
  const onUpdate = (event: Event) => setModal({ type: "update", event: event });
  const closeModal = () => setModal(null);

  return (
    <section className="flex flex-col gap-4 p-4 sm:p-6 lg:px-0 max-w-300 3xl:max-w-280">
      <div className="flex items-center justify-between">
        <h2 className="text-d-purple text-xl font-extrabold 3xl:text-2xl">
          {toDayOfWeekDate(selectedDate)}
        </h2>
        <IconButton
          icon={faPlus}
          label="Add event"
          onClick={openCreateModal}
          variant="secondary"
        />
      </div>
      {events.length === 0 ? (
        <h3 className="text-pale-purple text-sm font-semibold 3xl:text-lg">
          No events
        </h3>
      ) : (
        events.map((e) => {
          return (
            <EventCard
              event={e}
              selectedDate={selectedDate}
              key={e.id}
              onUpdate={onUpdate}
            />
          );
        })
      )}
      <Modal
        open={modal?.type === "update"}
        title="Update Event"
        onClose={closeModal}
      >
        {modal?.event && (
          <UpdateEventForm
            event={modal.event}
            onSuccess={closeModal}
            onCancel={closeModal}
          />
        )}
      </Modal>
    </section>
  );
}
