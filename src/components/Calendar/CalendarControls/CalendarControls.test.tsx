import { render, screen } from "@testing-library/react";
import CalendarControls from "./CalendarControls";
import userEvent from "@testing-library/user-event";
import {
  getStartOfNextMonth,
  getStartOfPrevMonth,
  stringToDate,
  toMonthYear,
} from "../../../lib/utils/date-utils";

vi.mock("../../DateForm/DateForm", () => {
  return {
    default: ({
      selectedDate,
      onChange,
    }: {
      selectedDate: Date;
      onChange: () => void;
    }) => (
      <button onClick={onChange}>{`${selectedDate.toDateString()}`}</button>
    ),
  };
});

vi.mock("../../../lib/utils/date-utils", () => ({
  getStartOfNextMonth: vi.fn(),
  getStartOfPrevMonth: vi.fn(),
  stringToDate: vi.fn(),
  toMonthYear: vi.fn(),
}));

describe("CalendarControls", () => {
  const mockUpdateDates = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Should render current month as title", () => {
    vi.mocked(toMonthYear).mockReturnValue("November 2026");

    render(
      <CalendarControls
        selectedDate={new Date("11/03/2026")}
        updateDates={mockUpdateDates}
      />,
    );

    const monthTitle = screen.getByRole("heading", { level: 1 });
    expect(monthTitle).toHaveTextContent("November 2026");
  });

  it("Should call updateDates when previous month button is clicked", async () => {
    const user = userEvent.setup();
    vi.mocked(getStartOfPrevMonth).mockReturnValue(new Date("2026-10-01"));

    render(
      <CalendarControls
        selectedDate={new Date("11/03/2026")}
        updateDates={mockUpdateDates}
      />,
    );

    const prevBtn = screen.getByRole("button", { name: "Previous Month" });
    await user.click(prevBtn);

    expect(mockUpdateDates).toHaveBeenCalledOnce();
    expect(mockUpdateDates).toHaveBeenCalledWith(new Date("2026-10-01"));
  });

  it("Should call updateDates when next month button is clicked", async () => {
    const user = userEvent.setup();
    vi.mocked(getStartOfNextMonth).mockReturnValue(new Date("2026-12-01"));
    render(
      <CalendarControls
        selectedDate={new Date("11/03/2026")}
        updateDates={mockUpdateDates}
      />,
    );

    const nextBtn = screen.getByRole("button", { name: "Next Month" });
    await user.click(nextBtn);

    expect(mockUpdateDates).toHaveBeenCalledOnce();
    expect(mockUpdateDates).toHaveBeenCalledWith(new Date("2026-12-01"));
  });

  it("Should pass selected date to DateForm", async () => {
    render(
      <CalendarControls
        selectedDate={new Date("11/03/2026")}
        updateDates={mockUpdateDates}
      />,
    );

    const dateInput = screen.getByRole("button", {
      name: new Date("11/03/2026").toDateString(),
    });
    expect(dateInput).toBeInTheDocument();
  });

  it("Should pass updateDates to DateForm", async () => {
    const user = userEvent.setup();
    vi.mocked(stringToDate).mockReturnValue(new Date("2026-12-01"));

    render(
      <CalendarControls
        selectedDate={new Date("11/03/2026")}
        updateDates={mockUpdateDates}
      />,
    );

    const dateForm = screen.getByRole("button", {
      name: new Date("11/03/2026").toDateString(),
    });
    await user.click(dateForm);

    expect(mockUpdateDates).toHaveBeenCalledOnce();
    expect(mockUpdateDates).toHaveBeenCalledWith(new Date("2026-12-01"));
  });

  it("Should call updateDates when Today button clicked", async () => {
    const user = userEvent.setup();
    render(
      <CalendarControls
        selectedDate={new Date("11/01/2026")}
        updateDates={mockUpdateDates}
      />,
    );

    const todayBtn = screen.getByRole("button", { name: "Today" });
    await user.click(todayBtn);

    expect(mockUpdateDates).toHaveBeenCalledOnce();

    const dateCalled = mockUpdateDates.mock.calls[0][0];
    const expectedToday = new Date();

    expect(dateCalled.getDate()).toBe(expectedToday.getDate());
    expect(dateCalled.getMonth()).toBe(expectedToday.getMonth());
    expect(dateCalled.getFullYear()).toBe(expectedToday.getFullYear());
  });
});
