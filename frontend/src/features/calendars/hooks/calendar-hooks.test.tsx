import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getAllCalendars } from "../api/calendar-api";
import { type ReactNode } from "react";
import { makeCalendar } from "../../../lib/utils/test-utils";
import { useCalendars } from "./calendar-hooks";
import { renderHook, waitFor } from "@testing-library/react";

vi.mock("../api/calendar-api", () => ({
  getAllCalendars: vi.fn(),
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

describe("useCalendars", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockCalendars = [
    makeCalendar(),
    makeCalendar({ id: 2, name: "Family", color: "purple" }),
  ];

  it("Should return calendars on successful getAllCalendars", async () => {
    vi.mocked(getAllCalendars).mockResolvedValueOnce(mockCalendars);

    const { result } = renderHook(() => useCalendars(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isSuccess).toBe(false);
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(getAllCalendars).toHaveBeenCalledOnce();
      expect(result.current.data).toEqual(mockCalendars);
      expect(result.current.isLoading).toBe(false);
    });
  });

  it("Should return isError when fetching calendars errors", async () => {
    vi.mocked(getAllCalendars).mockRejectedValueOnce(
      new Error("Oops something went wrong with fetching calendars"),
    );

    const { result } = renderHook(() => useCalendars(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.error?.message).toBe(
        "Oops something went wrong with fetching calendars",
      );
      expect(getAllCalendars).toHaveBeenCalledOnce();
      expect(result.current.data).toBe(undefined);
    });
  });
});
