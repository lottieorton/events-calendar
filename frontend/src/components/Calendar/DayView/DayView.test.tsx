import { render, screen } from "@testing-library/react";
import DayView from "./DayView";
import userEvent from "@testing-library/user-event";
import { makeEvent } from "../../../lib/utils/test-utils";
import type { ReactNode } from "react";
import type { Event } from "../../../features/events/types";

vi.mock("../../../ui/components/Modal/Modal", () => {
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
            <button data-testid="mockModal" onClick={onClose}>
              {title}
            </button>
            {children}
          </div>
        );
      }

      return null;
    },
  };
});

vi.mock("../../../features/events/components/EventCard/EventCard", () => {
  return {
    default: ({
      event,
      selectedDate,
      onUpdate,
      onDelete,
    }: {
      event: Event;
      selectedDate: Date;
      onUpdate: (event: Event) => void;
      onDelete: (event: Event) => void;
    }) => {
      return (
        <div>
          <h2>{`${event.title}`}</h2>
          <button onClick={() => onUpdate(event)}>Open Update Modal</button>
          <button onClick={() => onDelete(event)}>Open Delete Modal</button>
          <div data-testid="eventCardDate">{`${selectedDate}`}</div>
        </div>
      );
    },
  };
});

vi.mock(
  "../../../features/events/components/UpdateEventForm/UpdateEventForm",
  () => {
    return {
      default: ({
        event,
        onSuccess,
        onCancel,
      }: {
        event: Event;
        onSuccess: () => void;
        onCancel: () => void;
      }) => (
        <div>
          <div data-testid="update-event">{event.title}</div>
          <form>
            <label htmlFor="update-event-input">Title:</label>
            <input id="update-event-input" />
          </form>
          <button data-testid="mockUpdateEventFormSuccess" onClick={onSuccess}>
            Success
          </button>
          <button data-testid="mockUpdateEventFormCancel" onClick={onCancel}>
            Cancel
          </button>
        </div>
      ),
    };
  },
);

vi.mock(
  "../../../features/events/components/DeleteEventCheck/DeleteEventCheck",
  () => {
    return {
      default: ({
        event,
        onSuccess,
        onCancel,
      }: {
        event: Event;
        onSuccess: () => void;
        onCancel: () => void;
      }) => (
        <div>
          <div data-testid="delete-event">{event.title}</div>
          <button data-testid="mockDeleteCheckSuccess" onClick={onSuccess}>
            Delete
          </button>
          <button data-testid="mockDeleteCheckCancel" onClick={onCancel}>
            Cancel
          </button>
        </div>
      ),
    };
  },
);

describe("Day View", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockOpenCreateModal = vi.fn();

  it("Should call openCreateModal when the Add event button pushed", async () => {
    const user = userEvent.setup();

    render(
      <DayView
        events={[]}
        selectedDate={new Date(2026, 10, 24)}
        openCreateModal={mockOpenCreateModal}
      />,
    );

    const addEventBtn = screen.getByRole("button");
    await user.click(addEventBtn);

    expect(mockOpenCreateModal).toHaveBeenCalledOnce();
  });

  it("Should render a no event message when events is empty", () => {
    render(
      <DayView
        events={[]}
        selectedDate={new Date(2026, 10, 24)}
        openCreateModal={mockOpenCreateModal}
      />,
    );

    expect(screen.getByText("No events")).toBeInTheDocument();
  });

  it("Should render a list of EventCards", () => {
    const mockEvents = [
      makeEvent({
        startAt: new Date(2026, 10, 24, 0, 0, 0),
        endAt: new Date(2026, 10, 24, 23, 59, 59),
        isAllDay: true,
      }),
      makeEvent({
        id: 2,
        title: "Clean flat",
        startAt: new Date(2026, 10, 24, 18, 0, 0),
        endAt: new Date(2026, 10, 24, 20, 0, 0),
      }),
      makeEvent({
        id: 3,
        title: "Go to the gym",
        startAt: new Date(2026, 10, 24, 20, 0, 0),
        endAt: new Date(2026, 10, 24, 21, 0, 0),
      }),
    ];

    render(
      <DayView
        events={mockEvents}
        selectedDate={new Date(2026, 10, 24)}
        openCreateModal={mockOpenCreateModal}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Hair cut" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Clean flat" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Go to the gym" }),
    ).toBeInTheDocument();
  });

  it("Should open update modal when onUpdate called from an EventCard", async () => {
    const user = userEvent.setup();
    const mockEvents = [
      makeEvent({
        title: "Go to the gym",
      }),
    ];

    render(
      <DayView
        events={mockEvents}
        selectedDate={new Date(2026, 10, 24)}
        openCreateModal={mockOpenCreateModal}
      />,
    );

    const openUpdateModal = screen.getByRole("button", {
      name: "Open Update Modal",
    });
    await user.click(openUpdateModal);

    const updateModal = screen.getByTestId("mockModal");
    const updateEventForm = screen.getByTestId("update-event");
    expect(updateModal).toHaveTextContent("Update Event");
    expect(updateEventForm).toHaveTextContent("Go to the gym");
  });

  it("Should close update modal when called from Modal", async () => {
    const user = userEvent.setup();
    const mockEvents = [
      makeEvent({
        title: "Go to the gym",
      }),
    ];

    render(
      <DayView
        events={mockEvents}
        selectedDate={new Date(2026, 10, 24)}
        openCreateModal={mockOpenCreateModal}
      />,
    );

    const openUpdateModal = screen.getByRole("button", {
      name: "Open Update Modal",
    });
    await user.click(openUpdateModal);

    const updateModal = screen.getByTestId("mockModal");
    expect(updateModal).toHaveTextContent("Update Event");
    await user.click(updateModal);

    expect(updateModal).not.toBeInTheDocument();
  });

  it("Should close update modal when onSuccess called from UpdateEventForm", async () => {
    const user = userEvent.setup();
    const mockEvents = [
      makeEvent({
        title: "Go to the gym",
      }),
    ];

    render(
      <DayView
        events={mockEvents}
        selectedDate={new Date(2026, 10, 24)}
        openCreateModal={mockOpenCreateModal}
      />,
    );

    const openUpdateModal = screen.getByRole("button", {
      name: "Open Update Modal",
    });
    await user.click(openUpdateModal);

    const updateModal = screen.getByTestId("mockModal");
    expect(updateModal).toHaveTextContent("Update Event");
    const updateEventFormSuccessBtn = screen.getByTestId(
      "mockUpdateEventFormSuccess",
    );
    await user.click(updateEventFormSuccessBtn);

    expect(updateModal).not.toBeInTheDocument();
  });

  it("Should close update modal when onCancel called from UpdateEventForm", async () => {
    const user = userEvent.setup();
    const mockEvents = [
      makeEvent({
        title: "Go to the gym",
      }),
    ];

    render(
      <DayView
        events={mockEvents}
        selectedDate={new Date(2026, 10, 24)}
        openCreateModal={mockOpenCreateModal}
      />,
    );

    const openUpdateModal = screen.getByRole("button", {
      name: "Open Update Modal",
    });
    await user.click(openUpdateModal);

    const updateModal = screen.getByTestId("mockModal");
    expect(updateModal).toHaveTextContent("Update Event");
    const updateEventFormCancelBtn = screen.getByTestId(
      "mockUpdateEventFormCancel",
    );
    await user.click(updateEventFormCancelBtn);

    expect(updateModal).not.toBeInTheDocument();
  });

  it("Should clear unsaved changes to the update event form when reopened", async () => {
    const user = userEvent.setup();
    const mockEvents = [
      makeEvent({
        title: "Go to the gym",
      }),
    ];

    render(
      <DayView
        events={mockEvents}
        selectedDate={new Date(2026, 10, 24)}
        openCreateModal={mockOpenCreateModal}
      />,
    );

    const openUpdateModal = screen.getByRole("button", {
      name: "Open Update Modal",
    });
    await user.click(openUpdateModal);

    const updateModal = screen.getByTestId("mockModal");
    const updateModalTitleField = screen.getByRole("textbox", {
      name: "Title:",
    });
    expect(updateModal).toHaveTextContent("Update Event");
    const updateEventFormCancelBtn = screen.getByTestId(
      "mockUpdateEventFormCancel",
    );

    await user.type(updateModalTitleField, "hello");
    expect(updateModalTitleField).toHaveValue("hello");
    await user.click(updateEventFormCancelBtn);
    expect(updateModal).not.toBeInTheDocument();
    await user.click(openUpdateModal);

    const reopenedUpdateModalTitleField = screen.getByRole("textbox", {
      name: "Title:",
    });
    expect(reopenedUpdateModalTitleField).toHaveValue("");
  });

  it("Should open delete modal when onDelete called from an EventCard", async () => {
    const user = userEvent.setup();
    const mockEvents = [
      makeEvent({
        title: "Go to the gym",
      }),
    ];

    render(
      <DayView
        events={mockEvents}
        selectedDate={new Date(2026, 10, 24)}
        openCreateModal={mockOpenCreateModal}
      />,
    );

    const openDeleteModal = screen.getByRole("button", {
      name: "Open Delete Modal",
    });
    await user.click(openDeleteModal);

    const deleteModal = screen.getByTestId("mockModal");
    const deleteCheck = screen.getByTestId("delete-event");
    expect(deleteModal).toHaveTextContent("Delete Event");
    expect(deleteCheck).toHaveTextContent("Go to the gym");
  });

  it("Should close delete modal when called from modal", async () => {
    const user = userEvent.setup();
    const mockEvents = [
      makeEvent({
        title: "Go to the gym",
      }),
    ];

    render(
      <DayView
        events={mockEvents}
        selectedDate={new Date(2026, 10, 24)}
        openCreateModal={mockOpenCreateModal}
      />,
    );

    const openDeleteModalBtn = screen.getByRole("button", {
      name: "Open Delete Modal",
    });
    await user.click(openDeleteModalBtn);

    const deleteModal = screen.getByTestId("mockModal");
    expect(deleteModal).toHaveTextContent("Delete Event");
    await user.click(deleteModal);

    expect(deleteModal).not.toBeInTheDocument();
  });

  it("Should close delete modal when onSuccess called from DeleteEventCheck", async () => {
    const user = userEvent.setup();
    const mockEvents = [
      makeEvent({
        title: "Go to the gym",
      }),
    ];

    render(
      <DayView
        events={mockEvents}
        selectedDate={new Date(2026, 10, 24)}
        openCreateModal={mockOpenCreateModal}
      />,
    );

    const openDeleteModal = screen.getByRole("button", {
      name: "Open Delete Modal",
    });
    await user.click(openDeleteModal);

    const deleteModal = screen.getByTestId("mockModal");
    expect(deleteModal).toHaveTextContent("Delete Event");
    const deleteSuccessBtn = screen.getByTestId("mockDeleteCheckSuccess");
    await user.click(deleteSuccessBtn);

    expect(deleteModal).not.toBeInTheDocument();
  });

  it("Should close delete modal when onCancel called from DeleteEventCheck", async () => {
    const user = userEvent.setup();
    const mockEvents = [
      makeEvent({
        title: "Go to the gym",
      }),
    ];

    render(
      <DayView
        events={mockEvents}
        selectedDate={new Date(2026, 10, 24)}
        openCreateModal={mockOpenCreateModal}
      />,
    );

    const openDeleteModal = screen.getByRole("button", {
      name: "Open Delete Modal",
    });
    await user.click(openDeleteModal);

    const deleteModal = screen.getByTestId("mockModal");
    expect(deleteModal).toHaveTextContent("Delete Event");
    const deleteCancelBtn = screen.getByTestId("mockDeleteCheckCancel");
    await user.click(deleteCancelBtn);

    expect(deleteModal).not.toBeInTheDocument();
  });
});
