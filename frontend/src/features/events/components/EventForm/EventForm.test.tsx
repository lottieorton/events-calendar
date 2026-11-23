import { userEvent } from "storybook/test";
import { makeCalendar } from "../../../../lib/utils/test-utils";
import { useCalendars } from "../../../calendars/hooks/calendar-hooks";
import EventForm from "./EventForm";
import {
  eventFormSchema,
  type EventFormInput,
  type EventFormValues,
} from "./schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { render, screen, waitFor } from "@testing-library/react";

vi.mock("../../../calendars/hooks/calendar-hooks", () => ({
  useCalendars: vi.fn(),
}));

const EventFormWrapper = ({
  onSubmit,
  onCancel,
  isSubmitting = false,
  defaultValues,
}: {
  onSubmit: (data: EventFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  defaultValues?: Partial<EventFormInput>;
}) => {
  const methods = useForm<EventFormInput, any, EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: defaultValues,
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

const mockDefaultValues = {
  title: "Default title",
  calendarId: 1,
  description: "Default description",
  startAt: "2026-11-23T13:00",
  endAt: "2026-11-23T14:00",
  isAllDay: false,
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

  it("Should render with default values when provided", () => {
    const mockDefaultValues = {
      title: "Default title",
      calendarId: 1,
      description: "Default description",
      startAt: "2026-11-23T13:00",
      endAt: "2026-11-23T14:00",
      isAllDay: true,
    };

    render(
      <EventFormWrapper
        onSubmit={mockSubmit}
        onCancel={mockCancel}
        defaultValues={mockDefaultValues}
      />,
    );

    const titleInput = screen.getByRole("textbox", { name: "Title *" });
    const calendarInput = screen.getByRole("combobox", { name: "Calendar *" });
    const descriptionInput = screen.getByRole("textbox", {
      name: "Description",
    });
    const startAtInput = screen.getByLabelText("Start At *");
    const endAtInput = screen.getByLabelText("End At *");
    const isAllDayInput = screen.getByRole("checkbox", { name: "All-day" });

    expect(titleInput).toHaveValue("Default title");
    expect(calendarInput).toHaveValue("1");
    expect(descriptionInput).toHaveValue("Default description");
    expect(startAtInput).toHaveValue("2026-11-23");
    expect(endAtInput).toHaveValue("2026-11-23");
    expect(isAllDayInput).toBeChecked();
  });

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

    await user.type(titleInput, "Test");
    await user.type(descriptionInput, "Test description");
    await user.selectOptions(calendarInput, "Family");
    await user.type(startAtInput, "2026-11-20T10:00");
    await user.type(endAtInput, "2026-11-20T11:00");
    await user.click(submitBtn);

    expect(mockSubmit).toHaveBeenCalledOnce();
    expect(mockSubmit).toHaveBeenCalledWith({
      title: "Test",
      calendarId: 2,
      description: "Test description",
      startAt: new Date(2026, 10, 20, 10, 0, 0),
      endAt: new Date(2026, 10, 20, 11, 0, 0),
      isAllDay: false,
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

  it("Should set startAt date to start of the day when isAllDay is true in submitted form", async () => {
    const user = userEvent.setup();
    render(
      <EventFormWrapper
        onSubmit={mockSubmit}
        onCancel={mockCancel}
        defaultValues={mockDefaultValues}
      />,
    );

    const submitBtn = screen.getByRole("button", { name: "Submit" });
    const titleInput = screen.getByRole("textbox", { name: "Title *" });
    const startAtInput = screen.getByLabelText("Start At *");
    const isAllDayInput = screen.getByRole("checkbox", { name: "All-day" });

    expect(startAtInput).toHaveValue("2026-11-23T13:00");
    await user.type(titleInput, "Test");
    await user.click(isAllDayInput);
    await user.click(submitBtn);

    expect(mockSubmit).toHaveBeenCalledOnce();
    expect(mockSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        startAt: new Date(2026, 10, 23, 0, 0, 0),
        isAllDay: true,
      }),
    );
  });

  it("Should set endAt date to end of the day when isAllDay is true in submitted form", async () => {
    const user = userEvent.setup();
    render(
      <EventFormWrapper
        onSubmit={mockSubmit}
        onCancel={mockCancel}
        defaultValues={mockDefaultValues}
      />,
    );

    const submitBtn = screen.getByRole("button", { name: "Submit" });
    const titleInput = screen.getByRole("textbox", { name: "Title *" });
    const endAtInput = screen.getByLabelText("End At *");
    const isAllDayInput = screen.getByRole("checkbox", { name: "All-day" });

    expect(endAtInput).toHaveValue("2026-11-23T14:00");
    await user.type(titleInput, "Test");
    await user.click(isAllDayInput);
    await user.click(submitBtn);

    expect(mockSubmit).toHaveBeenCalledOnce();
    expect(mockSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        endAt: new Date(2026, 10, 23, 23, 59, 59, 999),
        isAllDay: true,
      }),
    );
  });

  it("Should render startAt and endAt fields as datetime-local when isAllDay is false", () => {
    render(
      <EventFormWrapper
        onSubmit={mockSubmit}
        onCancel={mockCancel}
        defaultValues={mockDefaultValues}
      />,
    );

    const startAtInput = screen.getByLabelText("Start At *");
    const endAtInput = screen.getByLabelText("End At *");

    expect(startAtInput).toHaveAttribute("type", "datetime-local");
    expect(endAtInput).toHaveAttribute("type", "datetime-local");
    expect(startAtInput).toHaveValue("2026-11-23T13:00");
    expect(endAtInput).toHaveValue("2026-11-23T14:00");
  });

  it("Should render startAt and endAt fields as dates when isAllDay is true", () => {
    const mockDefaultValues = {
      title: "Default title",
      calendarId: 1,
      description: "Default description",
      startAt: "2026-11-23",
      endAt: "2026-11-23",
      isAllDay: true,
    };

    render(
      <EventFormWrapper
        onSubmit={mockSubmit}
        onCancel={mockCancel}
        defaultValues={mockDefaultValues}
      />,
    );

    const startAtInput = screen.getByLabelText("Start At *");
    const endAtInput = screen.getByLabelText("End At *");

    expect(startAtInput).toHaveAttribute("type", "date");
    expect(endAtInput).toHaveAttribute("type", "date");
    expect(startAtInput).toHaveValue("2026-11-23");
    expect(endAtInput).toHaveValue("2026-11-23");
  });

  it("Should transform datetime-local values to date when isAllDay is checked", async () => {
    const user = userEvent.setup();
    render(
      <EventFormWrapper
        onSubmit={mockSubmit}
        onCancel={mockCancel}
        defaultValues={mockDefaultValues}
      />,
    );

    const startAtInput = screen.getByLabelText("Start At *");
    const endAtInput = screen.getByLabelText("End At *");
    const isAllDayField = screen.getByRole("checkbox", { name: "All-day" });

    expect(startAtInput).toHaveAttribute("type", "datetime-local");
    expect(endAtInput).toHaveAttribute("type", "datetime-local");
    expect(startAtInput).toHaveValue("2026-11-23T13:00");
    expect(endAtInput).toHaveValue("2026-11-23T14:00");
    await user.click(isAllDayField);

    expect(startAtInput).toHaveAttribute("type", "date");
    expect(endAtInput).toHaveAttribute("type", "date");
    expect(startAtInput).toHaveValue("2026-11-23");
    expect(endAtInput).toHaveValue("2026-11-23");
  });

  it("Should transform date values to datetime-local with timeCache value when isAllDay is unchecked", async () => {
    const user = userEvent.setup();
    const mockDefaultValues = {
      title: "Default title",
      calendarId: 1,
      description: "Default description",
      startAt: "2026-11-23",
      endAt: "2026-11-23",
      isAllDay: true,
    };

    render(
      <EventFormWrapper
        onSubmit={mockSubmit}
        onCancel={mockCancel}
        defaultValues={mockDefaultValues}
      />,
    );

    const startAtInput = screen.getByLabelText("Start At *");
    const endAtInput = screen.getByLabelText("End At *");
    const isAllDayField = screen.getByRole("checkbox", { name: "All-day" });

    expect(startAtInput).toHaveAttribute("type", "date");
    expect(endAtInput).toHaveAttribute("type", "date");
    expect(startAtInput).toHaveValue("2026-11-23");
    expect(endAtInput).toHaveValue("2026-11-23");
    await user.click(isAllDayField);

    expect(startAtInput).toHaveAttribute("type", "datetime-local");
    expect(endAtInput).toHaveAttribute("type", "datetime-local");
    expect(startAtInput).toHaveValue("2026-11-23T00:00");
    expect(endAtInput).toHaveValue("2026-11-23T01:00");
  });

  it("Should set and subsequently use the timeCache when converting from datetime-local to date and back to datetime-local", async () => {
    const user = userEvent.setup();
    render(
      <EventFormWrapper
        onSubmit={mockSubmit}
        onCancel={mockCancel}
        defaultValues={mockDefaultValues}
      />,
    );

    const startAtInput = screen.getByLabelText("Start At *");
    const endAtInput = screen.getByLabelText("End At *");
    const isAllDayField = screen.getByRole("checkbox", { name: "All-day" });

    expect(startAtInput).toHaveValue("2026-11-23T13:00");
    expect(endAtInput).toHaveValue("2026-11-23T14:00");
    await user.click(isAllDayField);

    expect(startAtInput).toHaveValue("2026-11-23");
    expect(endAtInput).toHaveValue("2026-11-23");
    await user.click(isAllDayField);

    expect(startAtInput).toHaveValue("2026-11-23T13:00");
    expect(endAtInput).toHaveValue("2026-11-23T14:00");
  });

  it("Should leave dates as blank if the current startAt or endAt values are not strings", async () => {
    const user = userEvent.setup();
    const mockDefaultValues = {
      title: "Default title",
      calendarId: 1,
      description: "Default description",
      startAt: undefined,
      endAt: undefined,
      isAllDay: true,
    };

    render(
      <EventFormWrapper
        onSubmit={mockSubmit}
        onCancel={mockCancel}
        defaultValues={mockDefaultValues}
      />,
    );

    const startAtInput = screen.getByLabelText("Start At *");
    const endAtInput = screen.getByLabelText("End At *");
    const isAllDayField = screen.getByRole("checkbox", { name: "All-day" });

    expect(startAtInput).toHaveValue("");
    expect(endAtInput).toHaveValue("");
    await user.click(isAllDayField);

    expect(startAtInput).toHaveValue("");
    expect(endAtInput).toHaveValue("");
  });
});
