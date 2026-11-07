import { render, screen } from "@testing-library/react";
import DateCard from "./DateCard";
import userEvent from "@testing-library/user-event";
import { makeEvent } from "../../lib/utils/test-utils";

describe("DateCard", () => {
  const mockOnClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockEvents = [
    makeEvent(),
    makeEvent({
      id: 2,
    }),
    makeEvent({
      id: 3,
    }),
    makeEvent({
      id: 4,
    }),
  ];

  it("Should call onClick when clicked", async () => {
    const user = userEvent.setup();
    render(
      <DateCard
        date={new Date("11/01/2026")}
        onClick={mockOnClick}
        events={mockEvents}
      />,
    );

    const dateCard = screen.getByRole("button");
    await user.click(dateCard);

    expect(mockOnClick).toHaveBeenCalledOnce();
  });

  it("Should render at most 3 icons", async () => {
    render(
      <DateCard
        date={new Date("11/01/2026")}
        onClick={mockOnClick}
        events={mockEvents}
      />,
    );

    const eventIcons = screen.getAllByLabelText("event-icon");

    expect(eventIcons).toHaveLength(3);
  });

  it("Should render all labels", async () => {
    render(
      <DateCard
        date={new Date("11/01/2026")}
        onClick={mockOnClick}
        events={mockEvents}
      />,
    );

    const eventIcons = screen.getAllByLabelText("event-label");

    expect(eventIcons).toHaveLength(4);
  });
});
