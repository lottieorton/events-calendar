import { render, screen, waitFor } from "@testing-library/react";
import Calendar from "./Calendar";
import userEvent from "@testing-library/user-event";
import { toast } from "react-toastify";
import type { DateWithEvents, Event } from "../../features/events/types";
import { useEvents } from "../../features/events/hooks/event-hooks";
import { makeEvent } from "../../lib/utils/test-utils";
import type { ReactNode } from "react";

vi.mock("./CalendarControls/CalendarControls", () => {
  return {
    default: ({
      selectedDate,
      updateDates,
      openModal,
    }: {
      selectedDate: Date;
      updateDates: (date: Date) => void;
      openModal: () => void;
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
        <button aria-label="MockCalendarControls-OpenModal" onClick={openModal}>
          Open Modal
        </button>
      </>
    ),
  };
});

vi.mock("./WeekCalendarControls/WeekCalendarControls", () => {
  return {
    default: ({
      selectedDate,
      updateDates,
      openModal,
    }: {
      selectedDate: Date;
      updateDates: (date: Date) => void;
      openModal: () => void;
    }) => (
      <>
        <button
          aria-label="MockWeekCalendarControls"
          onClick={() => updateDates(new Date("2026-11-04"))}
        >{`${selectedDate}`}</button>
        <button
          aria-label="MockWeekCalendarControls-OpenModal"
          onClick={openModal}
        >
          Open Modal
        </button>
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
      updateDates: (date: Date, updateView?: "week" | "month") => void;
    }) => (
      <>
        <button
          aria-label="MockCalendarView"
          onClick={() => updateDates(new Date("2026-12-05"))}
        >{`${selectedDate.toDateString()}`}</button>
        <button
          aria-label="WeekViewUpdate"
          onClick={() => updateDates(new Date("2026-12-10"), "week")}
        >{`${selectedDate.toDateString()}`}</button>
        <button
          aria-label="MockSelectNextWeek"
          onClick={() => updateDates(new Date("2026-12-17"))}
        >{`${selectedDate.toDateString()}`}</button>
        <button
          aria-label="MonthViewUpdate"
          onClick={() => updateDates(new Date("2026-12-11"), "month")}
        >{`${selectedDate.toDateString()}`}</button>
        {calendarDates.map((d) => (
          <div key={d.day.toDateString()} data-testid="date-cell">
            <p>{d.day.toDateString()}</p>
            <span
              data-testid={`event-count: ${d.day.toDateString()}`}
              aria-label="event-count"
            >{`${d.events.length}`}</span>
            {d.events.map((e) => {
              return (
                <div
                  data-testid={`events: ${d.day.toDateString()}`}
                  key={e.id}
                >{`${e.id}`}</div>
              );
            })}
          </div>
        ))}
      </>
    ),
  };
});

vi.mock("../../ui/components/Modal/Modal", () => {
  return {
    default: ({
      open,
      title,
      onClose,
      children,
    }: {
      open: boolean;
      title: string;
      onClose: () => void;
      children: ReactNode;
    }) => {
      if (open) {
        return (
          <div>
            <button
              data-testid="mockModal"
              onClick={onClose}
            >{`${title}`}</button>
            {children}
          </div>
        );
      }

      return null;
    },
  };
});

vi.mock("./DayView/DayView", () => {
  return {
    default: ({
      events,
      selectedDate,
      openModal,
    }: {
      events: Event[];
      selectedDate: Date;
      openModal: () => void;
    }) => (
      <>
        <div aria-label="MockDayView">{`${selectedDate}`}</div>
        {events.map((e) => {
          return (
            <div data-testid="DayViewEvents" key={e.id}>
              {e.id}
            </div>
          );
        })}
        <button
          aria-label="MockWeekCalendarControls-OpenModal"
          onClick={openModal}
        >
          Open Modal
        </button>
      </>
    ),
  };
});

vi.mock(
  "../../features/events/components/CreateEventForm/CreateEventForm",
  () => {
    return {
      default: ({
        onSuccess,
        onCancel,
      }: {
        onSuccess: () => void;
        onCancel: () => void;
      }) => (
        <div>
          <form>
            <label htmlFor="create-event-form">Form field:</label>
            <input id="create-event-form" />
          </form>
          <button data-testid="mockCreateEventFormSuccess" onClick={onSuccess}>
            "Success
          </button>
          <button data-testid="mockCreateEventFormCancel" onClick={onCancel}>
            "Cancel
          </button>
        </div>
      ),
    };
  },
);

vi.mock("../../features/events/hooks/event-hooks", () => ({
  useEvents: vi.fn(),
}));

vi.mock("react-toastify", () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe("Calendar", () => {
  const user = userEvent.setup();
  const mockEvents = [
    makeEvent(),
    makeEvent({
      id: 2,
      title: "Clean flat",
      calendar: { id: 2, name: "Personal", color: "purple" },
      startAt: new Date(2026, 10, 16, 18, 0, 0),
      endAt: new Date(2026, 10, 16, 20, 0, 0),
    }),
    makeEvent({
      id: 3,
      title: "Go to the gym",
    }),
  ];

  const mockToday = new Date(2026, 10, 6, 8, 0, 0);

  beforeAll(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(mockToday);
  });

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useEvents).mockReturnValue({
      data: mockEvents,
      isLoading: false,
      isError: false,
    } as ReturnType<typeof useEvents>);
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it("Should set selected date as the start of the current day by default", () => {
    render(<Calendar />);

    const calendarControls = screen.getByRole("button", {
      name: "MockCalendarControls",
    });

    expect(calendarControls).toHaveTextContent(mockToday.toDateString());
    expect(calendarControls).toHaveTextContent("00:00:00");
  });

  it("Should set calendar dates with current calendar month by default", async () => {
    render(<Calendar />);

    const calendarViewDates = await screen.findAllByRole("paragraph");

    expect(calendarViewDates).toHaveLength(42);
    expect(calendarViewDates[0]).toHaveTextContent("Mon Oct 26 2026");
    expect(calendarViewDates[41]).toHaveTextContent("Sun Dec 06 2026");
    expect(
      screen.getByTestId("event-count: Thu Nov 05 2026"),
    ).toHaveTextContent("2");
    expect(
      screen.getByTestId("event-count: Mon Nov 16 2026"),
    ).toHaveTextContent("1");
  });

  it("Should update selected date when updated with a valid date of same month", async () => {
    render(<Calendar />);

    const calendarControlsBtn = screen.getByRole("button", {
      name: "MockCalendarControls",
    });

    expect(calendarControlsBtn).toHaveTextContent(
      new Date("2026-11-06").toDateString(),
    );

    await user.click(calendarControlsBtn);

    expect(calendarControlsBtn).toHaveTextContent(
      new Date("2026-11-04").toDateString(),
    );
    expect(calendarControlsBtn).toHaveTextContent("00:00:00");
  });

  it("Should not update calendar dates when new selected date chosen with a valid date of same month", async () => {
    render(<Calendar />);

    const calendarControlsBtn = screen.getByRole("button", {
      name: "MockCalendarControls",
    });

    expect(calendarControlsBtn).toHaveTextContent(
      new Date("2026-11-06").toDateString(),
    );

    const calendarDates = await screen.findAllByRole("paragraph");
    expect(calendarDates).toHaveLength(42);
    expect(calendarDates[0]).toHaveTextContent("Mon Oct 26 2026");
    expect(calendarDates[41]).toHaveTextContent("Sun Dec 06 2026");

    await user.click(calendarControlsBtn);

    expect(calendarControlsBtn).toHaveTextContent(
      new Date("2026-11-04").toDateString(),
    );
    const calendarDatesCheck = await screen.findAllByRole("paragraph");
    expect(calendarDatesCheck).toHaveLength(42);
    expect(calendarDatesCheck[0]).toHaveTextContent("Mon Oct 26 2026");
    expect(calendarDatesCheck[41]).toHaveTextContent("Sun Dec 06 2026");
  });

  it("Should update calendar dates when new selected date chosen with a valid date of a different month", async () => {
    const newSelectedDate = new Date("2026-12-05");

    render(<Calendar />);

    const calendarViewBtn = screen.getByRole("button", {
      name: "MockCalendarView",
    });

    const calendarDates = await screen.findAllByRole("paragraph");
    expect(calendarDates).toHaveLength(42);
    expect(calendarDates[0]).toHaveTextContent("Mon Oct 26 2026");
    expect(calendarDates[41]).toHaveTextContent("Sun Dec 06 2026");

    await user.click(calendarViewBtn);

    await waitFor(() => {
      expect(calendarViewBtn).toHaveTextContent(newSelectedDate.toDateString());
      const newCalendarViewDates = screen.getAllByRole("paragraph");
      expect(newCalendarViewDates).toHaveLength(35);
      expect(newCalendarViewDates[0]).toHaveTextContent("Mon Nov 30 2026");
      expect(newCalendarViewDates[34]).toHaveTextContent("Sun Jan 03 2027");
    });
  });

  it("Should update to weekView with a week of dates when date and view updated to week", async () => {
    render(<Calendar />);

    const calendarControlsBtn = screen.getByRole("button", {
      name: "MockCalendarControls",
    });
    const weekViewCalendarControlsBtn = screen.queryByRole("button", {
      name: "MockWeekCalendarControls",
    });
    const weekViewBtn = screen.getByRole("button", {
      name: "WeekViewUpdate",
    });

    // expect start in month view
    expect(calendarControlsBtn).toHaveTextContent(
      new Date("2026-11-06").toDateString(),
    );
    expect(weekViewCalendarControlsBtn).not.toBeInTheDocument();
    await user.click(weekViewBtn);

    const foundWeekViewCalendarControlsBtn = screen.getByRole("button", {
      name: "MockWeekCalendarControls",
    });
    const calendarViewDates = await screen.findAllByRole("paragraph");
    expect(calendarControlsBtn).not.toBeInTheDocument();
    expect(foundWeekViewCalendarControlsBtn).toBeInTheDocument();
    expect(foundWeekViewCalendarControlsBtn).toHaveTextContent(
      new Date("2026-12-10").toDateString(),
    );
    expect(calendarViewDates).toHaveLength(7);
    expect(calendarViewDates[0]).toHaveTextContent("Mon Dec 07 2026");
    expect(calendarViewDates[6]).toHaveTextContent("Sun Dec 13 2026");
  });

  it("Should update week of dates when in weekView and date updated", async () => {
    render(<Calendar />);

    const calendarControlsBtn = screen.getByRole("button", {
      name: "MockCalendarControls",
    });
    const weekViewCalendarControlsBtn = screen.queryByRole("button", {
      name: "MockWeekCalendarControls",
    });
    const weekViewBtn = screen.getByRole("button", {
      name: "WeekViewUpdate",
    });
    const nextWeekBtn = screen.getByRole("button", {
      name: "MockSelectNextWeek",
    });

    expect(calendarControlsBtn).toHaveTextContent(
      new Date("2026-11-06").toDateString(),
    );
    expect(weekViewCalendarControlsBtn).not.toBeInTheDocument();
    await user.click(weekViewBtn);

    const foundWeekViewCalendarControlsBtn = screen.getByRole("button", {
      name: "MockWeekCalendarControls",
    });
    expect(calendarControlsBtn).not.toBeInTheDocument();
    expect(foundWeekViewCalendarControlsBtn).toBeInTheDocument();
    expect(foundWeekViewCalendarControlsBtn).toHaveTextContent(
      new Date("2026-12-10").toDateString(),
    );

    // click next week button without forcing updateView
    await user.click(nextWeekBtn);
    const calendarViewDates = await screen.findAllByRole("paragraph");
    expect(calendarControlsBtn).not.toBeInTheDocument();
    expect(foundWeekViewCalendarControlsBtn).toBeInTheDocument();
    expect(foundWeekViewCalendarControlsBtn).toHaveTextContent(
      new Date("2026-12-17").toDateString(),
    );
    expect(calendarViewDates).toHaveLength(7);
    expect(calendarViewDates[0]).toHaveTextContent("Mon Dec 14 2026");
    expect(calendarViewDates[6]).toHaveTextContent("Sun Dec 20 2026");
  });

  it("Should update to monthView when dates updated with view updated to month", async () => {
    render(<Calendar />);

    const calendarControlsBtn = screen.getByRole("button", {
      name: "MockCalendarControls",
    });
    const weekViewBtn = screen.getByRole("button", {
      name: "WeekViewUpdate",
    });
    const monthViewBtn = screen.getByRole("button", {
      name: "MonthViewUpdate",
    });

    // changed to week view
    await user.click(weekViewBtn);
    const weekViewCalendarControlsBtn = screen.getByRole("button", {
      name: "MockWeekCalendarControls",
    });
    expect(weekViewCalendarControlsBtn).toHaveTextContent(
      new Date("2026-12-10").toDateString(),
    );
    expect(await screen.findAllByRole("paragraph")).toHaveLength(7);
    expect(calendarControlsBtn).not.toBeInTheDocument();

    // changed to month view
    await user.click(monthViewBtn);
    const returnedCalendarControlsBtn = screen.getByRole("button", {
      name: "MockCalendarControls",
    });
    const updatedMonthDates = await screen.findAllByRole("paragraph");
    expect(weekViewCalendarControlsBtn).not.toBeInTheDocument();
    expect(returnedCalendarControlsBtn).toBeInTheDocument();
    expect(returnedCalendarControlsBtn).toHaveTextContent(
      new Date("2026-12-11").toDateString(),
    );
    expect(updatedMonthDates).toHaveLength(35);
    expect(updatedMonthDates[0]).toHaveTextContent("Mon Nov 30 2026");
    expect(updatedMonthDates[34]).toHaveTextContent("Sun Jan 03 2027");
  });

  it("Should have an error notification when trying to update date with an invalid date", async () => {
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
      new Date("2026-11-06").toDateString(),
    );
  });

  it("Should call useEvents on render", async () => {
    render(<Calendar />);
    expect(useEvents).toHaveBeenCalledOnce();
  });

  it("Should return an empty list of events if data returned undefined", async () => {
    vi.mocked(useEvents).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
    } as ReturnType<typeof useEvents>);

    render(<Calendar />);

    const events = await screen.findAllByLabelText("event-count");
    expect(events).toHaveLength(42);
    events.forEach((e) => {
      expect(e).toHaveTextContent("0");
    });
  });

  it("Should return array of events if data returned", async () => {
    vi.mocked(useEvents).mockReturnValue({
      data: mockEvents,
      isLoading: false,
      isError: false,
    } as ReturnType<typeof useEvents>);

    render(<Calendar />);
    const events = await screen.findAllByLabelText("event-count");
    const daysWithEvents = events.some((e) => e.textContent !== "0");
    expect(daysWithEvents).toBe(true);
    expect(screen.getAllByTestId("events: Thu Nov 05 2026")).toHaveLength(2);
    expect(screen.getAllByTestId("events: Mon Nov 16 2026")).toHaveLength(1);
    expect(
      screen.queryByTestId("events: Tue Nov 17 2026"),
    ).not.toBeInTheDocument();
  });

  it("Should send ordered events to CalendarView", async () => {
    const mockEvents = [
      makeEvent({
        id: 1,
        startAt: new Date(2026, 10, 16, 18, 0, 0),
        endAt: new Date(2026, 10, 16, 20, 0, 0),
        isAllDay: false,
      }),
      makeEvent({
        id: 2,
        startAt: new Date(2026, 10, 16, 0, 0, 0),
        endAt: new Date(2026, 10, 16, 22, 59, 59, 999),
        isAllDay: true,
      }),
      makeEvent({
        id: 3,
        startAt: new Date(2026, 10, 16, 17, 0, 0),
        endAt: new Date(2026, 10, 16, 18, 0, 0),
        isAllDay: false,
      }),
      makeEvent({
        id: 4,
        startAt: new Date(2026, 10, 16, 0, 0, 0),
        endAt: new Date(2026, 10, 16, 22, 59, 59, 999),
        isAllDay: true,
      }),
    ];

    vi.mocked(useEvents).mockReturnValue({
      data: mockEvents,
      isLoading: false,
      isError: false,
    } as ReturnType<typeof useEvents>);
    render(<Calendar />);

    const events = await screen.findAllByTestId("events: Mon Nov 16 2026");

    expect(events).toHaveLength(4);
    expect(events[0]).toHaveTextContent("2");
    expect(events[1]).toHaveTextContent("4");
    expect(events[2]).toHaveTextContent("3");
    expect(events[3]).toHaveTextContent("1");
  });

  it("Should render an alert when fetching events errors", async () => {
    vi.mocked(useEvents).mockReturnValue({
      isLoading: false,
      isError: true,
    } as ReturnType<typeof useEvents>);

    render(<Calendar />);
    expect(screen.getByText("Error:")).toBeInTheDocument();
    expect(screen.getByText("Failed to fetch events")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Issue fetching calendar events. Please try refreshing the page.",
      ),
    ).toBeInTheDocument();
  });

  it("Should render a spinner when loading events", async () => {
    vi.mocked(useEvents).mockReturnValue({
      isLoading: true,
      isError: false,
    } as ReturnType<typeof useEvents>);

    render(<Calendar />);

    const spinner = screen.getByText("Loading");
    expect(spinner).toBeInTheDocument();
  });

  it("Should have modal closed by default", () => {
    render(<Calendar />);

    const modal = screen.queryByTestId("mockModal");
    expect(modal).not.toBeInTheDocument();
  });

  it("Should open the modal when openModal is called", async () => {
    render(<Calendar />);

    const openModalBtn = screen.getByRole("button", {
      name: "MockCalendarControls-OpenModal",
    });
    await user.click(openModalBtn);

    const modal = screen.getByTestId("mockModal");
    expect(modal).toBeInTheDocument();
    expect(modal).toHaveTextContent("Create Event");
  });

  it("Should close the modal when closeModal is called from the modal", async () => {
    render(<Calendar />);

    const openModalBtn = screen.getByRole("button", {
      name: "MockCalendarControls-OpenModal",
    });
    await user.click(openModalBtn);

    const modalBtn = screen.getByTestId("mockModal");
    expect(modalBtn).toBeInTheDocument();

    await user.click(modalBtn);
    expect(modalBtn).not.toBeInTheDocument();
  });

  it("Should close the modal when onSuccess is called from CreateEventForm", async () => {
    render(<Calendar />);

    const openModalBtn = screen.getByRole("button", {
      name: "MockCalendarControls-OpenModal",
    });
    await user.click(openModalBtn);

    const modal = screen.getByTestId("mockModal");
    const createEventSuccessBtn = screen.getByTestId(
      "mockCreateEventFormSuccess",
    );

    await user.click(createEventSuccessBtn);
    expect(modal).not.toBeInTheDocument();
  });

  it("Should close the modal when onCancel is called from CreateEventForm", async () => {
    render(<Calendar />);

    const openModalBtn = screen.getByRole("button", {
      name: "MockCalendarControls-OpenModal",
    });
    await user.click(openModalBtn);

    const modal = screen.getByTestId("mockModal");
    const createEventCancelBtn = screen.getByTestId(
      "mockCreateEventFormCancel",
    );

    await user.click(createEventCancelBtn);
    expect(modal).not.toBeInTheDocument();
  });

  it("Should clear content from the create event form when modal is closed and then re-opened", async () => {
    render(<Calendar />);

    const openModalBtn = screen.getByRole("button", {
      name: "MockCalendarControls-OpenModal",
    });
    await user.click(openModalBtn);

    const modalInput = screen.getByRole("textbox", { name: "Form field:" });
    const modalBtn = screen.getByTestId("mockModal");

    await user.type(modalInput, "Testing clear form");
    expect(modalInput).toHaveValue("Testing clear form");
    await user.click(modalBtn);
    expect(modalBtn).not.toBeInTheDocument();

    await user.click(openModalBtn);
    const refreshedModalInput = screen.getByRole("textbox", {
      name: "Form field:",
    });
    expect(refreshedModalInput).toHaveValue("");
  });

  it("Should pass ordered events to DayView in weekView", async () => {
    const mockEvents = [
      makeEvent({
        id: 1,
        startAt: new Date(2026, 11, 12, 18, 0, 0),
        endAt: new Date(2026, 11, 12, 19, 0, 0),
        isAllDay: false,
      }),
      makeEvent({
        id: 2,
        startAt: new Date(2026, 11, 10, 18, 0, 0),
        endAt: new Date(2026, 11, 10, 19, 0, 0),
        isAllDay: false,
      }),
      makeEvent({
        id: 3,
        startAt: new Date(2026, 11, 10, 0, 0, 0),
        endAt: new Date(2026, 11, 10, 22, 59, 59, 999),
        isAllDay: true,
      }),
      makeEvent({
        id: 4,
        startAt: new Date(2026, 11, 8, 17, 0, 0),
        endAt: new Date(2026, 11, 8, 18, 0, 0),
        isAllDay: false,
      }),
      makeEvent({
        id: 5,
        startAt: new Date(2026, 11, 10, 7, 0, 0),
        endAt: new Date(2026, 11, 10, 8, 0, 0),
        isAllDay: false,
      }),
      makeEvent({
        id: 6,
        startAt: new Date(2026, 11, 10, 0, 0, 0),
        endAt: new Date(2026, 11, 10, 22, 59, 59, 999),
        isAllDay: true,
      }),
    ];
    vi.mocked(useEvents).mockReturnValue({
      data: mockEvents,
      isLoading: false,
      isError: false,
    } as ReturnType<typeof useEvents>);
    render(<Calendar />);

    const weekViewBtn = screen.getByRole("button", {
      name: "WeekViewUpdate",
    });

    await user.click(weekViewBtn);

    const mockDayEvents = screen.getAllByTestId("DayViewEvents");
    expect(mockDayEvents).toHaveLength(4);
    expect(mockDayEvents[0]).toHaveTextContent("3");
    expect(mockDayEvents[1]).toHaveTextContent("6");
    expect(mockDayEvents[2]).toHaveTextContent("5");
    expect(mockDayEvents[3]).toHaveTextContent("2");
  });
});
