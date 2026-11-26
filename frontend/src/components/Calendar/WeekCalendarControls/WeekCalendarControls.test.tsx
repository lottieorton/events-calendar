import userEvent from "@testing-library/user-event";
import WeekCalendarControls from "./WeekCalendarControls";
import { render, screen } from "@testing-library/react";

describe("WeekCalendarControls", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockUpdateDates = vi.fn();

  it("Should call updateDates when month view button clicked", async () => {
    const user = userEvent.setup();
    const mockDate = new Date(2026, 10, 24);
    render(
      <WeekCalendarControls
        selectedDate={mockDate}
        updateDates={mockUpdateDates}
      />,
    );

    const monthViewBtn = screen.getByRole("button", { name: "November 2026" });
    await user.click(monthViewBtn);

    expect(mockUpdateDates).toHaveBeenCalledOnce();
    expect(mockUpdateDates).toHaveBeenCalledWith(mockDate, "month");
  });

  it("Should call updateDates when previous week button clicked", async () => {
    const user = userEvent.setup();
    render(
      <WeekCalendarControls
        selectedDate={new Date(2026, 10, 24)}
        updateDates={mockUpdateDates}
      />,
    );

    const prevWeekBtn = screen.getByRole("button", { name: "Previous Week" });
    await user.click(prevWeekBtn);

    expect(mockUpdateDates).toHaveBeenCalledOnce();
    expect(mockUpdateDates).toHaveBeenCalledWith(new Date(2026, 10, 17));
  });

  it("Should call updateDates when next week button clicked", async () => {
    const user = userEvent.setup();
    render(
      <WeekCalendarControls
        selectedDate={new Date(2026, 10, 24)}
        updateDates={mockUpdateDates}
      />,
    );

    const nextWeekBtn = screen.getByRole("button", { name: "Next Week" });
    await user.click(nextWeekBtn);

    expect(mockUpdateDates).toHaveBeenCalledOnce();
    expect(mockUpdateDates).toHaveBeenCalledWith(new Date(2026, 11, 1));
  });
});
