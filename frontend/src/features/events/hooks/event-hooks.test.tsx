import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createEvent,
  deleteEvent,
  getAllEvents,
  updateEvent,
} from "../api/events-api";
import { act, type ReactNode } from "react";
import { makeEvent } from "../../../lib/utils/test-utils";
import { renderHook, waitFor } from "@testing-library/react";
import {
  useCreateEvent,
  useDeleteEvent,
  useEvents,
  useUpdateEvent,
} from "./event-hooks";

vi.mock("../api/events-api", () => ({
  getAllEvents: vi.fn(),
  createEvent: vi.fn(),
  updateEvent: vi.fn(),
  deleteEvent: vi.fn(),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("event-hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockFormData = {
    title: "Hair cut",
    description: "Go to the salon for a cut and blowdry",
    calendarId: 1,
    startAt: new Date(2026, 10, 5, 10, 0, 0),
    endAt: new Date(2026, 10, 5, 10, 30, 0),
    isAllDay: false,
  };

  const mockEvent = makeEvent();

  const mockEvents = [
    makeEvent(),
    makeEvent({
      id: 2,
      title: "Clean flat",
    }),
    makeEvent({
      id: 3,
      title: "Go to the gym",
    }),
  ];

  describe("useEvents", () => {
    it("Should return events on successful getAllEvents", async () => {
      vi.mocked(getAllEvents).mockResolvedValueOnce(mockEvents);
      const { result } = renderHook(() => useEvents(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isSuccess).toBe(false);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
        expect(getAllEvents).toHaveBeenCalledOnce();
        expect(result.current.data).toEqual(mockEvents);
        expect(result.current.isError).toBe(false);
        expect(result.current.isLoading).toBe(false);
      });
    });

    it("Should return isError when fetching fails", async () => {
      vi.mocked(getAllEvents).mockRejectedValueOnce(
        new Error("Oops something went wrong!"),
      );
      const { result } = renderHook(() => useEvents(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
        expect(result.current.isSuccess).toBe(false);
        expect(result.current.error?.message).toBe(
          "Oops something went wrong!",
        );
        expect(getAllEvents).toHaveBeenCalledOnce();
        expect(result.current.data).toBeUndefined();
      });
    });
  });

  describe("useCreateEvent", () => {
    it("Should return an event on successful create", async () => {
      vi.mocked(createEvent).mockResolvedValueOnce(mockEvent);

      const { result } = renderHook(() => useCreateEvent(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isPending).toBe(false);
      expect(result.current.isSuccess).toBe(false);
      act(() => {
        result.current.mutate(mockFormData);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
        expect(createEvent).toHaveBeenCalledOnce();
        expect(createEvent).toHaveBeenCalledWith(mockFormData);
        expect(result.current.data).toEqual(mockEvent);
        expect(result.current.isPending).toBe(false);
      });
    });

    it("Should cause useEvents to be refetched on successful create", async () => {
      vi.mocked(getAllEvents)
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce(mockEvents);
      vi.mocked(createEvent).mockResolvedValueOnce(mockEvent);
      const wrapper = createWrapper();
      const { result } = renderHook(
        () => ({
          query: useEvents(),
          mutation: useCreateEvent(),
        }),
        { wrapper },
      );

      await waitFor(() => {
        expect(result.current.query.data).toEqual([]);
      });
      expect(getAllEvents).toHaveBeenCalledOnce();
      act(() => {
        result.current.mutation.mutate(mockFormData);
      });

      await waitFor(() => {
        expect(result.current.mutation.isSuccess).toBe(true);
        expect(createEvent).toHaveBeenCalledOnce();
        expect(getAllEvents).toHaveBeenCalledTimes(2);
        expect(result.current.query.data).toEqual(mockEvents);
      });
    });

    it("Should return isError when creating event errors", async () => {
      vi.mocked(getAllEvents).mockResolvedValueOnce(mockEvents);
      vi.mocked(createEvent).mockRejectedValueOnce(
        new Error("Could not create event"),
      );
      const wrapper = createWrapper();
      const { result } = renderHook(
        () => ({
          query: useEvents(),
          mutation: useCreateEvent(),
        }),
        { wrapper },
      );

      await waitFor(() => {
        expect(result.current.query.data).toEqual(mockEvents);
      });
      expect(getAllEvents).toHaveBeenCalledOnce();
      act(() => {
        result.current.mutation.mutate(mockFormData);
      });

      await waitFor(() => {
        expect(result.current.mutation.isSuccess).toBe(false);
        expect(result.current.mutation.isError).toBe(true);
        expect(result.current.mutation.error?.message).toBe(
          "Could not create event",
        );
        expect(createEvent).toHaveBeenCalledOnce();
        expect(getAllEvents).toHaveBeenCalledOnce();
      });
    });
  });

  describe("useUpdateEvent", () => {
    it("Should return an event on successful update", async () => {
      vi.mocked(updateEvent).mockResolvedValueOnce(mockEvent);
      const mockData = { id: 1, formData: mockFormData };

      const { result } = renderHook(() => useUpdateEvent(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isPending).toBe(false);
      expect(result.current.isSuccess).toBe(false);
      act(() => {
        result.current.mutate(mockData);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
        expect(updateEvent).toHaveBeenCalledOnce();
        expect(updateEvent).toHaveBeenCalledWith(
          mockData.id,
          mockData.formData,
        );
        expect(result.current.data).toEqual(mockEvent);
        expect(result.current.isPending).toBe(false);
      });
    });

    it("Should cause useEvents to be refetched on successful update", async () => {
      vi.mocked(getAllEvents)
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce(mockEvents);
      vi.mocked(updateEvent).mockResolvedValueOnce(mockEvent);
      const mockData = { id: 1, formData: mockFormData };
      const wrapper = createWrapper();
      const { result } = renderHook(
        () => ({
          query: useEvents(),
          mutation: useUpdateEvent(),
        }),
        { wrapper },
      );

      await waitFor(() => {
        expect(result.current.query.data).toEqual([]);
      });
      expect(getAllEvents).toHaveBeenCalledOnce();
      act(() => {
        result.current.mutation.mutate(mockData);
      });

      await waitFor(() => {
        expect(result.current.mutation.isSuccess).toBe(true);
        expect(updateEvent).toHaveBeenCalledOnce();
        expect(getAllEvents).toHaveBeenCalledTimes(2);
        expect(result.current.query.data).toEqual(mockEvents);
      });
    });

    it("Should return isError when updating event errors", async () => {
      vi.mocked(getAllEvents).mockResolvedValueOnce(mockEvents);
      vi.mocked(updateEvent).mockRejectedValueOnce(
        new Error("Could not update event"),
      );
      const mockData = { id: 1, formData: mockFormData };
      const wrapper = createWrapper();
      const { result } = renderHook(
        () => ({
          query: useEvents(),
          mutation: useUpdateEvent(),
        }),
        { wrapper },
      );

      await waitFor(() => {
        expect(result.current.query.data).toEqual(mockEvents);
      });
      expect(getAllEvents).toHaveBeenCalledOnce();
      act(() => {
        result.current.mutation.mutate(mockData);
      });

      await waitFor(() => {
        expect(result.current.mutation.isSuccess).toBe(false);
        expect(result.current.mutation.isError).toBe(true);
        expect(result.current.mutation.error?.message).toBe(
          "Could not update event",
        );
        expect(updateEvent).toHaveBeenCalledOnce();
        expect(getAllEvents).toHaveBeenCalledOnce();
      });
    });
  });

  describe("useDeleteEvent", () => {
    it("Should return true on successful delete", async () => {
      vi.mocked(deleteEvent).mockResolvedValueOnce(true);

      const { result } = renderHook(() => useDeleteEvent(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isPending).toBe(false);
      expect(result.current.isSuccess).toBe(false);
      act(() => {
        result.current.mutate(1);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
        expect(deleteEvent).toHaveBeenCalledOnce();
        expect(deleteEvent).toHaveBeenCalledWith(1);
        expect(result.current.data).toEqual(true);
        expect(result.current.isPending).toBe(false);
      });
    });

    it("Should cause useEvents to be refetched on successful delete", async () => {
      vi.mocked(getAllEvents)
        .mockResolvedValueOnce([mockEvent])
        .mockResolvedValueOnce([]);
      vi.mocked(deleteEvent).mockResolvedValueOnce(true);

      const wrapper = createWrapper();
      const { result } = renderHook(
        () => ({
          query: useEvents(),
          mutation: useDeleteEvent(),
        }),
        { wrapper },
      );

      await waitFor(() => {
        expect(result.current.query.data).toEqual([mockEvent]);
      });
      expect(getAllEvents).toHaveBeenCalledOnce();
      act(() => {
        result.current.mutation.mutate(1);
      });

      await waitFor(() => {
        expect(result.current.mutation.isSuccess).toBe(true);
        expect(deleteEvent).toHaveBeenCalledOnce();
        expect(getAllEvents).toHaveBeenCalledTimes(2);
        expect(result.current.query.data).toEqual([]);
      });
    });

    it("Should return isError when deleting event errors", async () => {
      vi.mocked(getAllEvents).mockResolvedValueOnce(mockEvents);
      vi.mocked(deleteEvent).mockRejectedValueOnce(
        new Error("Could not delete event"),
      );

      const wrapper = createWrapper();
      const { result } = renderHook(
        () => ({
          query: useEvents(),
          mutation: useDeleteEvent(),
        }),
        { wrapper },
      );

      await waitFor(() => {
        expect(result.current.query.data).toEqual(mockEvents);
      });
      expect(getAllEvents).toHaveBeenCalledOnce();
      act(() => {
        result.current.mutation.mutate(1);
      });

      await waitFor(() => {
        expect(result.current.mutation.isSuccess).toBe(false);
        expect(result.current.mutation.isError).toBe(true);
        expect(result.current.mutation.error?.message).toBe(
          "Could not delete event",
        );
        expect(deleteEvent).toHaveBeenCalledOnce();
        expect(getAllEvents).toHaveBeenCalledOnce();
      });
    });
  });
});
