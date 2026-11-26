import { render, screen } from "@testing-library/react";
import { makeEvent } from "../../../../lib/utils/test-utils";
import EventCard from "./EventCard";
import userEvent from "@testing-library/user-event";

describe("EventCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockOnUpdate = vi.fn();
  const mockEvent = makeEvent();

  it("Should onUpdate when Update Event button clicked", async () => {
    const user = userEvent.setup();

    render(
      <EventCard
        event={mockEvent}
        selectedDate={new Date(2026, 10, 26, 10, 0, 0)}
        onUpdate={mockOnUpdate}
      />,
    );

    const updateBtn = screen.getByLabelText("Update Event");
    await user.click(updateBtn);

    expect(mockOnUpdate).toHaveBeenCalledOnce();
    expect(mockOnUpdate).toHaveBeenCalledWith(mockEvent);
  });
});
