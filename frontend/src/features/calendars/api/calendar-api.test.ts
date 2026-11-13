import { ApiError } from "../../../lib/utils/api-error";
import { makeCalendarResponse } from "../../../lib/utils/test-utils";
import { getAllCalendars } from "./calendar-api";

const API_URL = import.meta.env.VITE_API_URL;

describe("getAllCalendars", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const mockCalendarResponses = [
    makeCalendarResponse(),
    makeCalendarResponse({ id: 2, name: "Family", color: "PURPLE" }),
  ];

  const mockErrorResponse = {
    status: 404,
    error: "Not Found",
    message: "Something went wrong with the fetch",
  };

  it("Should return an array of calendar responses on successful fetch", async () => {
    vi.spyOn(window, "fetch").mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockCalendarResponses,
    } as Response);

    const result = await getAllCalendars();

    expect(result).toEqual(mockCalendarResponses);
    expect(fetch).toHaveBeenCalledWith(`${API_URL}/calendars`);
  });

  it("Should throw an ApiError for !response.ok", async () => {
    vi.spyOn(window, "fetch").mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => mockErrorResponse,
    } as Response);

    await expect(getAllCalendars()).rejects.toThrow(
      new ApiError("Something went wrong with the fetch", 404),
    );
  });

  it("Should throw an ApiError for when fetch throws an error", async () => {
    vi.spyOn(window, "fetch").mockRejectedValueOnce(
      new Error("Network connection failed"),
    );

    await expect(getAllCalendars()).rejects.toThrow(
      "Network connection failed",
    );
  });
});
