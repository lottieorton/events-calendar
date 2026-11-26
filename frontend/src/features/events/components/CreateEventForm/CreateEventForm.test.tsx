import type { UseFormReturn } from "react-hook-form";
import type { EventFormValues } from "../EventForm/schema";
import CreateEventForm from "./CreateEventForm";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { useCreateEvent } from "../../hooks/event-hooks";

const mockFormData = {
  title: "title",
  description: "Test",
  calendarId: 1,
  startAt: new Date(2026, 11, 20, 17, 0, 0),
  endAt: new Date(2026, 11, 20, 18, 0, 0),
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
          <button
            aria-label="MockInvalidSubmit"
            onClick={() => methods.handleSubmit(onSubmit)}
          >
            Invalid Create
          </button>
          {isSubmitting && <div>Submitting</div>}
          {Object.values(methods.formState.errors).map((error) => (
            <span key={error?.message as string}>
              {error?.message as string}
            </span>
          ))}
        </>
      );
    },
  };
});

vi.mock("../../hooks/event-hooks", () => ({
  useCreateEvent: vi.fn(),
}));

describe("CreateEventForm", () => {
  const mockOnSuccess = vi.fn();
  const mockOnCancel = vi.fn();
  const mockCreateEvent = vi.fn();

  const mockSelectedDate = new Date(2026, 10, 20, 0, 0, 0);
  const mockToday = new Date(2026, 10, 23, 8, 0, 0);

  beforeAll(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(mockToday);
  });

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useCreateEvent).mockReturnValue({
      mutate: mockCreateEvent,
      isPending: false,
      isError: false,
    } as any);
  });

  it("Should call createEvent when onSubmit called in Event Form", async () => {
    const user = userEvent.setup();

    render(
      <CreateEventForm
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
        selectedDate={mockSelectedDate}
      />,
    );

    const onSubmitBtn = screen.getByRole("button", { name: "MockSubmitForm" });
    await user.click(onSubmitBtn);

    expect(onSubmitBtn).toHaveTextContent("Create Event");
    expect(mockCreateEvent).toHaveBeenCalledOnce();
    expect(mockCreateEvent).toHaveBeenCalledWith(mockFormData, {
      onSuccess: expect.any(Function),
    });
  });

  it("Should call onSuccess when create successful", async () => {
    const user = userEvent.setup();
    mockCreateEvent.mockImplementation((_variables, options) => {
      options.onSuccess();
    });

    render(
      <CreateEventForm
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
        selectedDate={mockSelectedDate}
      />,
    );

    const onSubmitBtn = screen.getByRole("button", { name: "MockSubmitForm" });
    await user.click(onSubmitBtn);

    expect(mockCreateEvent).toHaveBeenCalledOnce();
    expect(mockOnSuccess).toHaveBeenCalledOnce();
  });

  it("Should render an Alert when create errors", () => {
    vi.mocked(useCreateEvent).mockReturnValue({
      mutate: mockCreateEvent,
      isPending: false,
      isError: true,
    } as any);

    render(
      <CreateEventForm
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
        selectedDate={mockSelectedDate}
      />,
    );

    expect(screen.getByText("Error creating event")).toBeInTheDocument();
    expect(
      screen.getByText("Please check the details and try again."),
    ).toBeInTheDocument();
  });

  it("Should call onCancel when called in Event Form", async () => {
    const user = userEvent.setup();

    render(
      <CreateEventForm
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
        selectedDate={mockSelectedDate}
      />,
    );

    const onCancelBtn = screen.getByRole("button", { name: "MockCancelForm" });
    await user.click(onCancelBtn);

    expect(mockOnCancel).toHaveBeenCalledOnce();
  });

  it("Should have isSubmitting as false when not pending", () => {
    render(
      <CreateEventForm
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
        selectedDate={mockSelectedDate}
      />,
    );

    const isSubmittingMsg = screen.queryByText("Submitting");

    expect(isSubmittingMsg).not.toBeInTheDocument();
  });

  it("Should pass true when form isSubmitting", async () => {
    vi.mocked(useCreateEvent).mockReturnValue({
      mutate: mockCreateEvent,
      isPending: true,
    } as any);

    render(
      <CreateEventForm
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
        selectedDate={mockSelectedDate}
      />,
    );

    const isSubmittingMsg = screen.getByText("Submitting");

    expect(isSubmittingMsg).toBeInTheDocument();
  });

  it("Should correctly calculate and pass default values to EventForm", async () => {
    render(
      <CreateEventForm
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
        selectedDate={mockSelectedDate}
      />,
    );

    const titleDefault = screen.getByTestId("default-title");
    const descriptionDefault = screen.getByTestId("default-description");
    const startAtDefault = screen.getByTestId("default-startAt");
    const endAtDefault = screen.getByTestId("default-endAt");
    const isAllDayDefault = screen.getByTestId("default-isAllDay");

    expect(titleDefault).toBeEmptyDOMElement();
    expect(descriptionDefault).toBeEmptyDOMElement();
    expect(startAtDefault).toHaveTextContent("2026-11-20T09:00");
    expect(endAtDefault).toHaveTextContent("2026-11-20T10:00");
    expect(isAllDayDefault).toHaveTextContent("false");
  });
});
