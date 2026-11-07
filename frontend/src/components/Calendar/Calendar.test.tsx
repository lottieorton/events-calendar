import { render, screen, waitFor } from "@testing-library/react";
import Calendar from "./Calendar";
import {
  getCalendarDates,
  getStartOfDay,
  isMonthSame,
  doesEventOverlapDate,
} from "../../lib/utils/date-utils";
import userEvent from "@testing-library/user-event";
import { toast } from "react-toastify";
import type { DateWithEvents } from "../../features/events/types";

vi.mock("./CalendarControls/CalendarControls", () => {
  return {
    default: ({
      selectedDate,
      updateDates,
    }: {
      selectedDate: Date;
      updateDates: (date: Date) => void;
    }) => (
      <>
        <button
          aria-label="MockCalendarControls"
          onClick={() => updateDates(new Date("2026-11-04"))}
        >{`${selectedDate}`}</button>

        <button
          aria-label="MockCalendarControls-InvalidDate"
          onClick={() => updateDates(new Date("invalid-date-string"))}
        >{`${selectedDate}`}</button>
      </>
    ),
  };
});

vi.mock("./CalendarView/CalendarView", () => {
  return {
    default: ({
      calendarDates,
      selectedDate,
      updateDates,
    }: {
      calendarDates: DateWithEvents[];
      selectedDate: Date;
      updateDates: (date: Date) => void;
    }) => (
      <>
        <button
          aria-label="MockCalendarView"
          onClick={() => updateDates(new Date("2026-12-05"))}
        >{`${selectedDate.toDateString()}`}</button>
        {calendarDates.map((d) => (
          <div key={d.day.toDateString()} data-testid="date-cell">
            <p>{d.day.toDateString()}</p>
            <span data-testid="event-count">{d.events.length}</span>
          </div>
        ))}
      </>
    ),
  };
});

vi.mock("../../lib/utils/date-utils", () => ({
  getCalendarDates: vi.fn(),
  getStartOfDay: vi.fn(),
  isMonthSame: vi.fn(),
  doesEventOverlapDate: vi.fn(),
}));

vi.mock("react-toastify", () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe("Calendar", () => {
  const mockCalendarDates = [
    new Date("2026-11-01"),
    new Date("2026-11-02"),
    new Date("2026-11-03"),
    new Date("2026-11-04"),
    new Date("2026-11-05"),
    new Date("2026-11-06"),
    new Date("2026-11-07"),
  ];

  const mockToday = new Date(2026, 10, 6, 8, 0, 0);
  vi.mocked(getStartOfDay).mockReturnValue(mockToday);
  vi.mocked(getCalendarDates).mockReturnValue(mockCalendarDates);
  vi.mocked(doesEventOverlapDate).mockReturnValue(true);

  beforeAll(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(mockToday);
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it("Should set selected date as current day by default", () => {
    render(<Calendar />);

    const calendarControls = screen.getByRole("button", {
      name: "MockCalendarControls",
    });
    const calendarViewDate = screen.getByRole("button", {
      name: "MockCalendarView",
    });
    const dateCalled = vi.mocked(getStartOfDay).mock.calls[0][0];

    expect(dateCalled).toEqual(mockToday);
    expect(calendarControls).toHaveTextContent(mockToday.toDateString());
    expect(calendarViewDate).toHaveTextContent(mockToday.toDateString());
  });

  it("Should set calendar dates on component render", async () => {
    render(<Calendar />);

    const calendarViewDates = await screen.findAllByRole("paragraph");
    const currentDate = new Date().toISOString().substring(0, 10);
    const dateCalled = vi
      .mocked(getCalendarDates)
      .mock.calls[0][0].toISOString()
      .substring(0, 10);
    const events = await screen.findAllByTestId("event-count");

    expect(dateCalled).toBe(currentDate);
    expect(calendarViewDates).toHaveLength(7);
    for (let i = 0; i < calendarViewDates.length; i++) {
      expect(calendarViewDates[i]).toHaveTextContent(
        mockCalendarDates[i].toDateString(),
      );
    }
    expect(events).toHaveLength(7);
  });

  it("Should update selected date when called with a valid date of same month from CalendarControls", async () => {
    vi.mocked(getStartOfDay).mockReturnValueOnce(new Date("2026-11-03"));
    vi.mocked(isMonthSame).mockReturnValueOnce(true);

    const user = userEvent.setup();
    render(<Calendar />);

    const calendarControlsBtn = screen.getByRole("button", {
      name: "MockCalendarControls",
    });

    await user.click(calendarControlsBtn);

    expect(calendarControlsBtn).toHaveTextContent(
      new Date("2026-11-04").toDateString(),
    );
    expect(vi.mocked(getCalendarDates)).toHaveBeenCalledOnce();
  });

  it("Should update selected date when called with a valid date of a different month from CalendarView", async () => {
    const newSelectedDate = new Date("2026-12-05");
    vi.mocked(getStartOfDay).mockReturnValueOnce(newSelectedDate);
    vi.mocked(isMonthSame).mockReturnValueOnce(false);

    const mockNewCalendarDates = [
      new Date("2026-12-01"),
      new Date("2026-12-02"),
      new Date("2026-12-03"),
      new Date("2026-12-04"),
      new Date("2026-12-05"),
      new Date("2026-12-06"),
      new Date("2026-12-07"),
      new Date("2026-12-08"),
    ];
    vi.mocked(getCalendarDates)
      .mockReturnValueOnce(mockCalendarDates)
      .mockReturnValueOnce(mockNewCalendarDates);
    const user = userEvent.setup();
    render(<Calendar />);

    const calendarViewBtn = screen.getByRole("button", {
      name: "MockCalendarView",
    });
    const calendarViewDates = await screen.findAllByRole("paragraph");

    expect(vi.mocked(getCalendarDates)).toHaveBeenCalledOnce();
    expect(calendarViewDates).toHaveLength(7);
    expect(calendarViewDates[0]).toHaveTextContent(
      mockCalendarDates[0].toDateString(),
    );

    await user.click(calendarViewBtn);

    await waitFor(() => {
      expect(calendarViewBtn).toHaveTextContent(newSelectedDate.toDateString());
      expect(vi.mocked(getCalendarDates)).toHaveBeenCalledTimes(2);
      const newCalendarViewDates = screen.getAllByRole("paragraph");
      expect(newCalendarViewDates).toHaveLength(8);

      for (let i = 0; i < newCalendarViewDates.length; i++) {
        expect(newCalendarViewDates[i]).toHaveTextContent(
          mockNewCalendarDates[i].toDateString(),
        );
      }
    });
  });

  it("Should have an error notification when trying to update date with an invalid date", async () => {
    vi.mocked(getStartOfDay).mockReturnValueOnce(new Date("2026-11-03"));

    const user = userEvent.setup();
    render(<Calendar />);

    const calendarControls = screen.getByRole("button", {
      name: "MockCalendarControls",
    });

    const invalidDateBtn = screen.getByRole("button", {
      name: "MockCalendarControls-InvalidDate",
    });
    await user.click(invalidDateBtn);

    expect(toast.error).toHaveBeenCalledWith("Invalid date entered");
    expect(calendarControls).toHaveTextContent(
      new Date("2026-11-03").toDateString(),
    );
  });
});
