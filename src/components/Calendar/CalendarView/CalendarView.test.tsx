import { render, screen } from "@testing-library/react";
import CalendarView from "./CalendarView";
import userEvent from "@testing-library/user-event";

vi.mock("../../DateCard/DateCard", () => {
  return {
    default: ({
      variant,
      date,
      onClick,
    }: {
      variant: string;
      date: Date;
      onClick: () => void;
    }) => (
      <button onClick={onClick}>{`${date.toDateString()} - ${variant}`}</button>
    ),
  };
});

describe("CalendarView", () => {
  const mockCalendarDates = [
    new Date("10/31/2026"),
    new Date("11/01/2026"),
    new Date("11/02/2026"),
  ];
  const mockSelectedDate = new Date("11/01/2026");
  const mockUpdateDates = vi.fn();

  it("Should pass onClick to DateCards", async () => {
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
