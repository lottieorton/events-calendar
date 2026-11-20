import { render, screen, waitFor } from "@testing-library/react";
import Calendar from "./Calendar";
import userEvent from "@testing-library/user-event";
import { toast } from "react-toastify";
import type { DateWithEvents } from "../../features/events/types";
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
            <span
              data-testid={`event-count: ${d.day.toDateString()}`}
              aria-label="event-count"
            >{`${d.events.length}`}</span>
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

  it("Should set selected date as current day by default", () => {
    render(<Calendar />);

    const calendarControls = screen.getByRole("button", {
      name: "MockCalendarControls",
    });
    const calendarViewDate = screen.getByRole("button", {
      name: "MockCalendarView",
    });

    expect(calendarControls).toHaveTextContent(mockToday.toDateString());
    expect(calendarViewDate).toHaveTextContent(mockToday.toDateString());
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
    const user = userEvent.setup();
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
  });

  it("Should not update calendar dates when new selected date chosen with a valid date of same month", async () => {
    const user = userEvent.setup();
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
    const user = userEvent.setup();

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

  it("Should have an error notification when trying to update date with an invalid date", async () => {
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
    expect(
      screen.getByTestId("event-count: Thu Nov 05 2026"),
    ).toHaveTextContent("2");
    expect(
      screen.getByTestId("event-count: Mon Nov 16 2026"),
    ).toHaveTextContent("1");
    expect(
      screen.getByTestId("event-count: Tue Nov 17 2026"),
    ).toHaveTextContent("0");
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
    const user = userEvent.setup();

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
    const user = userEvent.setup();

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
    const user = userEvent.setup();

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
    const user = userEvent.setup();

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
});
