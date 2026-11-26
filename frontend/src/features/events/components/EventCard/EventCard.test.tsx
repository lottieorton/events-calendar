import { render, screen } from "@testing-library/react";
import { makeEvent } from "../../../../lib/utils/test-utils";
import EventCard from "./EventCard";
import userEvent from "@testing-library/user-event";

describe("EventCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockOnUpdate = vi.fn();
  const mockOnDelete = vi.fn();
  const mockEvent = makeEvent();

  it("Should call onUpdate when update event button clicked", async () => {
    const user = userEvent.setup();

    render(
      <EventCard
        event={mockEvent}
        selectedDate={new Date(2026, 10, 26, 10, 0, 0)}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />,
    );

    const updateBtn = screen.getByLabelText("Update Event");
    await user.click(updateBtn);

    expect(mockOnUpdate).toHaveBeenCalledOnce();
    expect(mockOnUpdate).toHaveBeenCalledWith(mockEvent);
  });

  it("Should call onDelete when delete event button clicked", async () => {
    const user = userEvent.setup();

    render(
      <EventCard
        event={mockEvent}
        selectedDate={new Date(2026, 10, 26, 10, 0, 0)}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />,
    );

    const deleteBtn = screen.getByLabelText("Delete Event");
    await user.click(deleteBtn);

    expect(mockOnDelete).toHaveBeenCalledOnce();
    expect(mockOnDelete).toHaveBeenCalledWith(mockEvent);
  });
});
