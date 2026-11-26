import type { UseFormReturn } from "react-hook-form";
import type { EventFormValues } from "../EventForm/schema";
import { useUpdateEvent } from "../../hooks/event-hooks";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import UpdateEventForm from "./UpdateEventForm";
import { makeEvent } from "../../../../lib/utils/test-utils";

const mockFormData = {
  title: "Updated",
  description: "New desccription",
  calendarId: 2,
  startAt: new Date(2026, 10, 26, 11, 0, 0),
  endAt: new Date(2026, 10, 26, 12, 0, 0),
  isAllDay: false,
};

vi.mock("../EventForm/EventForm", () => {
  return {
    default: ({
      methods,
      submitLabel,
      onSubmit,
      onCancel,
      isSubmitting,
    }: {
      methods: UseFormReturn<EventFormValues>;
      submitLabel: string;
      onSubmit: (formData: EventFormValues) => Promise<void>;
      onCancel: () => void;
      isSubmitting: boolean;
    }) => {
      const currentValues = methods.getValues();

      return (
        <>
          <div data-testid="default-title">{currentValues.title}</div>
          <div data-testid="default-description">
            {currentValues.description}
          </div>
          <div data-testid="default-calendarId">{currentValues.calendarId}</div>
          <div data-testid="default-startAt">{`${currentValues.startAt}`}</div>
          <div data-testid="default-endAt">{`${currentValues.endAt}`}</div>
          <div data-testid="default-isAllDay">{`${currentValues.isAllDay}`}</div>
          <button
            aria-label="MockSubmitForm"
            onClick={() => onSubmit(mockFormData)}
          >
            {submitLabel}
          </button>
          <button aria-label="MockCancelForm" onClick={onCancel}>
            Cancel
          </button>
          {isSubmitting && <div>Submitting</div>}
        </>
      );
    },
  };
});

vi.mock("../../hooks/event-hooks", () => ({
  useUpdateEvent: vi.fn(),
}));

describe("UpdateEventForm", () => {
  const mockOnSuccess = vi.fn();
  const mockOnCancel = vi.fn();
  const mockUpdateEvent = vi.fn();

  const mockEvent = makeEvent({
    title: "Old title",
    description: "Old description",
    calendar: { id: 1, name: "Personal", color: "blue" },
    startAt: new Date(2026, 10, 25, 10, 0, 0),
    endAt: new Date(2026, 10, 25, 11, 0, 0),
    isAllDay: false,
  });

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useUpdateEvent).mockReturnValue({
      mutate: mockUpdateEvent,
      isPending: false,
      isError: false,
    } as any);
  });

  it("Should call updateEvent when onSubmit called in EventForm", async () => {
    const user = userEvent.setup();

    render(
      <UpdateEventForm
        event={mockEvent}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />,
    );

    const submitFormBtn = screen.getByLabelText("MockSubmitForm");
    await user.click(submitFormBtn);

    expect(mockUpdateEvent).toHaveBeenCalledOnce();
    expect(mockUpdateEvent).toHaveBeenCalledWith(
      {
        id: mockEvent.id,
        formData: mockFormData,
      },
      {
        onSuccess: expect.any(Function),
      },
    );
  });

  it("Should call onSuccess on successful updateEvent", async () => {
    const user = userEvent.setup();
    mockUpdateEvent.mockImplementation((_variables, options) => {
      options.onSuccess();
    });

    render(
      <UpdateEventForm
        event={mockEvent}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />,
    );

    const submitFormBtn = screen.getByLabelText("MockSubmitForm");
    await user.click(submitFormBtn);

    expect(mockUpdateEvent).toHaveBeenCalledOnce();
    expect(mockOnSuccess).toHaveBeenCalledOnce();
  });

  it("Should call onCancel when called in EventForm", async () => {
    const user = userEvent.setup();

    render(
      <UpdateEventForm
        event={mockEvent}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />,
    );

    const onCancelBtn = screen.getByLabelText("MockCancelForm");
    await user.click(onCancelBtn);

    expect(mockOnCancel).toHaveBeenCalledOnce();
  });

  it("Should render an alert when update errors", () => {
    vi.mocked(useUpdateEvent).mockReturnValue({
      mutate: mockUpdateEvent,
      isPending: false,
      isError: true,
    } as any);

    render(
      <UpdateEventForm
        event={mockEvent}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />,
    );

    expect(screen.getByText("Error updating this event")).toBeInTheDocument();
    expect(
      screen.getByText("Please check the details and try again."),
    ).toBeInTheDocument();
  });

  it("Should provide correct default values to EventForm for non-allDay event", () => {
    render(
      <UpdateEventForm
        event={mockEvent}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />,
    );

    const titleDefault = screen.getByTestId("default-title");
    const descriptionDefault = screen.getByTestId("default-description");
    const calendarIdDefault = screen.getByTestId("default-calendarId");
    const startAtDefault = screen.getByTestId("default-startAt");
    const endAtDefault = screen.getByTestId("default-endAt");
    const isAllDayDefault = screen.getByTestId("default-isAllDay");

    expect(titleDefault).toHaveTextContent("Old title");
    expect(descriptionDefault).toHaveTextContent("Old description");
    expect(calendarIdDefault).toHaveTextContent("1");
    expect(startAtDefault).toHaveTextContent("2026-11-25T10:00");
    expect(endAtDefault).toHaveTextContent("2026-11-25T11:00");
    expect(isAllDayDefault).toHaveTextContent("false");
  });

  it("Should provide correct date default values to EventForm for allDay event", () => {
    const mockEvent = makeEvent({
      title: "Old title",
      description: "Old description",
      calendar: { id: 1, name: "Personal", color: "blue" },
      startAt: new Date(2026, 10, 25, 0, 0, 0),
      endAt: new Date(2026, 10, 25, 23, 59, 59),
      isAllDay: true,
    });

    render(
      <UpdateEventForm
        event={mockEvent}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />,
    );

    const startAtDefault = screen.getByTestId("default-startAt");
    const endAtDefault = screen.getByTestId("default-endAt");
    const isAllDayDefault = screen.getByTestId("default-isAllDay");

    expect(startAtDefault).toHaveTextContent("2026-11-25");
    expect(endAtDefault).toHaveTextContent("2026-11-25");
    expect(isAllDayDefault).toHaveTextContent("true");
  });

  it("Should have isSubmitting as false when not pending", () => {
    vi.mocked(useUpdateEvent).mockReturnValue({
      mutate: mockUpdateEvent,
      isPending: false,
      isError: false,
    } as any);

    render(
      <UpdateEventForm
        event={mockEvent}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />,
    );

    expect(screen.queryByText("Submitting")).not.toBeInTheDocument();
  });

  it("Should pass true when form isSubmitting", () => {
    vi.mocked(useUpdateEvent).mockReturnValue({
      mutate: mockUpdateEvent,
      isPending: true,
      isError: false,
    } as any);

    render(
      <UpdateEventForm
        event={mockEvent}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />,
    );

    expect(screen.getByText("Submitting")).toBeInTheDocument();
  });
});
