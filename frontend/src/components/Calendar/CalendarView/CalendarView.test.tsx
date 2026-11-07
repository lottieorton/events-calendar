import { render, screen } from "@testing-library/react";
import CalendarView from "./CalendarView";
import userEvent from "@testing-library/user-event";
import type { DateWithEvents, Event } from "../../../features/events/types";
import { makeEvent } from "../../../lib/utils/test-utils";

vi.mock("../../DateCard/DateCard", () => {
  return {
    default: ({
      variant,
      date,
      onClick,
      events,
    }: {
      variant: string;
      date: Date;
      onClick: () => void;
      events: Event[];
    }) => (
      <div>
        <button
          onClick={onClick}
        >{`${date.toDateString()} - ${variant}`}</button>
        <p data-testid="mock-event">{`Events: ${events.length}`}</p>
      </div>
    ),
  };
});

describe("CalendarView", () => {
  const mockEvents: Event[] = [
    makeEvent(),
    makeEvent({
      id: 2,
    }),
  ];

  const mockCalendarDates: DateWithEvents[] = [
    { day: new Date("10/31/2026"), events: mockEvents },
    { day: new Date("11/01/2026"), events: [] },
    { day: new Date("11/02/2026"), events: [] },
  ];
  const mockSelectedDate = new Date("11/01/2026");
  const mockUpdateDates = vi.fn();

  it("Should pass props to DateCards", () => {
    render(
      <CalendarView
        calendarDates={mockCalendarDates}
        selectedDate={mockSelectedDate}
        updateDates={mockUpdateDates}
      />,
    );

    const dateCards = screen.getAllByRole("button");
    const events = screen.getAllByTestId("mock-event");

    expect(dateCards).toHaveLength(3);
    expect(events[0]).toHaveTextContent("Events: 2");
    expect(events[1]).toHaveTextContent("Events: 0");
    expect(events[2]).toHaveTextContent("Events: 0");
  });

  it("Should call onClick with day of card", async () => {
    const user = userEvent.setup();
    render(
      <CalendarView
        calendarDates={mockCalendarDates}
        selectedDate={mockSelectedDate}
        updateDates={mockUpdateDates}
      />,
    );

    const dateCards = screen.getAllByRole("button");
    await user.click(dateCards[0]);

    expect(dateCards).toHaveLength(3);
    expect(mockUpdateDates).toHaveBeenCalledOnce();
    expect(mockUpdateDates).toHaveBeenCalledWith(mockCalendarDates[0].day);
  });

  it("Should correctly calculate variant as selected", () => {
    render(
      <CalendarView
        calendarDates={mockCalendarDates}
        selectedDate={mockSelectedDate}
        updateDates={mockUpdateDates}
      />,
    );

    const dateCards = screen.getAllByRole("button");
    expect(dateCards[1]).toHaveTextContent("Sun Nov 01 2026 - selected");
  });

  it("Should correctly calculate variant as current", () => {
    render(
      <CalendarView
        calendarDates={mockCalendarDates}
        selectedDate={mockSelectedDate}
        updateDates={mockUpdateDates}
      />,
    );

    const dateCards = screen.getAllByRole("button");
    expect(dateCards[2]).toHaveTextContent("Mon Nov 02 2026 - current");
  });

  it("Should correctly calculate variant as adjacent", () => {
    render(
      <CalendarView
        calendarDates={mockCalendarDates}
        selectedDate={mockSelectedDate}
        updateDates={mockUpdateDates}
      />,
    );

    const dateCards = screen.getAllByRole("button");
    expect(dateCards[0]).toHaveTextContent("Sat Oct 31 2026 - adjacent");
  });
});
