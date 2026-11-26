import { render, screen } from "@testing-library/react";
import { makeEvent } from "../../../../lib/utils/test-utils";
import DeleteEventCheck from "./DeleteEventCheck";
import userEvent from "@testing-library/user-event";
import { useDeleteEvent } from "../../hooks/event-hooks";

vi.mock("../../hooks/event-hooks", () => ({
  useDeleteEvent: vi.fn(),
}));

describe("DeleteEventCheck", () => {
  const mockEvent = makeEvent({ id: 10, title: "Incorrect event" });
  const mockOnSuccess = vi.fn();
  const mockOnCancel = vi.fn();
  const mockDeleteEvent = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useDeleteEvent).mockReturnValue({
      mutate: mockDeleteEvent,
      isPending: false,
      isError: false,
    } as any);
  });

  it("Should render the event name", () => {
    render(
      <DeleteEventCheck
        event={mockEvent}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />,
    );

    expect(screen.getByText("Incorrect event")).toBeInTheDocument();
  });

  it("Should call deleteEvent when the Delete button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <DeleteEventCheck
        event={mockEvent}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />,
    );

    const deleteBtn = screen.getByRole("button", { name: "Delete" });
    await user.click(deleteBtn);

    expect(mockDeleteEvent).toHaveBeenCalledOnce();
    expect(mockDeleteEvent).toHaveBeenCalledWith(10, {
      onSuccess: expect.any(Function),
    });
  });

  it("Should call onSuccess when delete successful", async () => {
    mockDeleteEvent.mockImplementation((_variables, options) => {
      options.onSuccess();
    });
    const user = userEvent.setup();

    render(
      <DeleteEventCheck
        event={mockEvent}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />,
    );

    const deleteBtn = screen.getByRole("button", { name: "Delete" });
    await user.click(deleteBtn);

    expect(mockDeleteEvent).toHaveBeenCalledOnce();
    expect(mockOnSuccess).toHaveBeenCalledOnce();
  });

  it("Should call onCancel when the Cancel button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <DeleteEventCheck
        event={mockEvent}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />,
    );

    const cancelBtn = screen.getByRole("button", { name: "Cancel" });
    await user.click(cancelBtn);

    expect(mockOnCancel).toHaveBeenCalledOnce();
  });

  it("Should render alert when there is a delete error", () => {
    vi.mocked(useDeleteEvent).mockReturnValue({
      mutate: mockDeleteEvent,
      isPending: false,
      isError: true,
    } as any);

    render(
      <DeleteEventCheck
        event={mockEvent}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />,
    );

    expect(screen.getByText("Error:")).toBeInTheDocument();
    expect(screen.getByText("Error deleting event")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Something went wrong. Please try again or refresh the page.",
      ),
    ).toBeInTheDocument();
  });

  it("Should disable Delete button while delete is pending", () => {
    vi.mocked(useDeleteEvent).mockReturnValue({
      mutate: mockDeleteEvent,
      isPending: true,
      isError: false,
    } as any);

    render(
      <DeleteEventCheck
        event={mockEvent}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />,
    );

    const deleteBtn = screen.getByRole("button", { name: "Delete" });

    expect(deleteBtn).toHaveAttribute("disabled");
  });
});
