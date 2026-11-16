import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getAllEvents } from "../api/events-api";
import type { ReactNode } from "react";
import { makeEvent } from "../../../lib/utils/test-utils";
import { renderHook, waitFor } from "@testing-library/react";
import { useEvents } from "./event-hooks";

vi.mock("../api/events-api", () => ({
  getAllEvents: vi.fn(),
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

describe("useEvents", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

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
      expect(result.current.error?.message).toBe("Oops something went wrong!");
      expect(getAllEvents).toHaveBeenCalledOnce();
      expect(result.current.data).toBeUndefined();
    });
  });
});
