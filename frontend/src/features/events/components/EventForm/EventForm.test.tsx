import { userEvent } from "storybook/test";
import { makeCalendar } from "../../../../lib/utils/test-utils";
import { useCalendars } from "../../../calendars/hooks/calendar-hooks";
import EventForm from "./EventForm";
import { eventFormSchema, type EventFormValues } from "./schema";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { render, screen, waitFor } from "@testing-library/react";

vi.mock("../../../calendars/hooks/calendar-hooks", () => ({
  useCalendars: vi.fn(),
}));

const EventFormWrapper = ({
  onSubmit,
  onCancel,
  isSubmitting = false,
}: {
  onSubmit: (data: EventFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}) => {
  const methods = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema) as Resolver<EventFormValues>,
  });

  return (
    <EventForm
      methods={methods}
      submitLabel="Submit"
      onSubmit={onSubmit}
      onCancel={onCancel}
      isSubmitting={isSubmitting}
    />
  );
};

describe("EventForm", () => {
  const mockCalendars = [
    makeCalendar(),
    makeCalendar({ id: 2, name: "Family", color: "purple" }),
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useCalendars).mockReturnValue({
      data: mockCalendars,
      isLoading: false,
      isError: false,
    } as ReturnType<typeof useCalendars>);
  });

  const mockSubmit = vi.fn();
  const mockCancel = vi.fn();

  it("Should submit the form with valid form values", async () => {
    const user = userEvent.setup();
    render(<EventFormWrapper onSubmit={mockSubmit} onCancel={mockCancel} />);

    const submitBtn = screen.getByRole("button", { name: "Submit" });
    const titleInput = screen.getByRole("textbox", { name: "Title *" });
    const calendarInput = screen.getByRole("combobox", { name: "Calendar *" });
    const descriptionInput = screen.getByRole("textbox", {
      name: "Description",
    });
    const startAtInput = screen.getByLabelText("Start At *");
    const endAtInput = screen.getByLabelText("End At *");
    const isAllDayInput = screen.getByRole("checkbox", { name: "All-day" });

    await user.type(titleInput, "Test");
    await user.type(descriptionInput, "Test description");
    await user.selectOptions(calendarInput, "Family");
    await user.type(startAtInput, "2026-11-20T10:00");
    await user.type(endAtInput, "2026-11-20T11:00");
    await user.click(isAllDayInput);
    await user.click(submitBtn);

    expect(mockSubmit).toHaveBeenCalledOnce();
    expect(mockSubmit).toHaveBeenCalledWith({
      title: "Test",
      calendarId: 2,
      description: "Test description",
      startAt: new Date(2026, 10, 20, 10, 0, 0),
      endAt: new Date(2026, 10, 20, 11, 0, 0),
      isAllDay: true,
    });
  });

  it("Should render zod validation errors with invalid form values", async () => {
    const user = userEvent.setup();
    render(<EventFormWrapper onSubmit={mockSubmit} onCancel={mockCancel} />);

    const submitBtn = screen.getByRole("button", { name: "Submit" });
    await user.click(submitBtn);

    expect(mockSubmit).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.getByText("Title cannot be empty")).toBeInTheDocument();
      expect(
        screen.getAllByText("Please enter a valid date and time"),
      ).toHaveLength(2);
    });
  });

  it("Should pass calendar options to the calendar form field", () => {
    render(<EventFormWrapper onSubmit={mockSubmit} onCancel={mockCancel} />);

    const calendarInput = screen.getByRole("combobox", { name: "Calendar *" });
    const dropdownOptions = screen.getAllByRole("option");

    expect(calendarInput).toHaveValue("1");
    expect(dropdownOptions.length).toBe(2);
    expect(dropdownOptions[0]).toHaveValue("1");
    expect(dropdownOptions[0]).toHaveTextContent("Personal");
    expect(dropdownOptions[1]).toHaveValue("2");
    expect(dropdownOptions[1]).toHaveTextContent("Family");
  });

  it("Should render an alert when error fetching calendars", () => {
    vi.mocked(useCalendars).mockReturnValue({
      isLoading: false,
      isError: true,
    } as ReturnType<typeof useCalendars>);

    render(<EventFormWrapper onSubmit={mockSubmit} onCancel={mockCancel} />);

    const errorAlert = screen.getByText("Error:");
    const errorAlertMsg = screen.getByText("Failed to fetch form");
    expect(errorAlert).toBeInTheDocument();
    expect(errorAlertMsg).toBeInTheDocument();
  });

  it("Should render spinner while loading calendars", () => {
    vi.mocked(useCalendars).mockReturnValue({
      isLoading: true,
      isError: false,
    } as ReturnType<typeof useCalendars>);

    render(<EventFormWrapper onSubmit={mockSubmit} onCancel={mockCancel} />);

    const spinner = screen.getByText("Loading");
    expect(spinner).toBeInTheDocument();
  });

  it("Should disable the form submission button while submitting", () => {
    render(
      <EventFormWrapper
        isSubmitting
        onSubmit={mockSubmit}
        onCancel={mockCancel}
      />,
    );

    const submitBtn = screen.getByRole("button", { name: "Submit" });
    expect(submitBtn).toHaveAttribute("disabled");
  });

  it("Should call onCancel when cancel button clicked", async () => {
    const user = userEvent.setup();
    render(
      <EventFormWrapper
        isSubmitting
        onSubmit={mockSubmit}
        onCancel={mockCancel}
      />,
    );

    const cancelBtn = screen.getByRole("button", { name: "Cancel" });
    await user.click(cancelBtn);

    expect(mockCancel).toHaveBeenCalled();
  });
});
