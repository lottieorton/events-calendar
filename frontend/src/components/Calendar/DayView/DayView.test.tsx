import { render, screen } from "@testing-library/react";
import DayView from "./DayView";
import userEvent from "@testing-library/user-event";
import { makeEvent } from "../../../lib/utils/test-utils";

describe("Day View", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockOpenModal = vi.fn();

  it("Should call openModal when the Add event button pushed", async () => {
    const user = userEvent.setup();

    render(
      <DayView
        events={[]}
        selectedDate={new Date(2026, 10, 24)}
        openModal={mockOpenModal}
      />,
    );

    const addEventBtn = screen.getByRole("button");
    await user.click(addEventBtn);

    expect(mockOpenModal).toHaveBeenCalledOnce();
  });

  it("Should render a no event message when events is empty", () => {
    render(
      <DayView
        events={[]}
        selectedDate={new Date(2026, 10, 24)}
        openModal={mockOpenModal}
      />,
    );

    expect(screen.getByText("No events")).toBeInTheDocument();
  });

  it("Should render a list of EventCards", () => {
    const mockEvents = [
      makeEvent({
        startAt: new Date(2026, 10, 24, 0, 0, 0),
        endAt: new Date(2026, 10, 24, 23, 59, 59),
        isAllDay: true,
      }),
      makeEvent({
        id: 2,
        title: "Clean flat",
        startAt: new Date(2026, 10, 24, 18, 0, 0),
        endAt: new Date(2026, 10, 24, 20, 0, 0),
      }),
      makeEvent({
        id: 3,
        title: "Go to the gym",
        startAt: new Date(2026, 10, 24, 20, 0, 0),
        endAt: new Date(2026, 10, 24, 21, 0, 0),
      }),
    ];

    render(
      <DayView
        events={mockEvents}
        selectedDate={new Date(2026, 10, 24)}
        openModal={mockOpenModal}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Hair cut" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Clean flat" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Go to the gym" }),
    ).toBeInTheDocument();
  });
});
