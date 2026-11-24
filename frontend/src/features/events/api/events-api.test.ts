import { ApiError } from "../../../lib/utils/api-error";
import { makeEvent, makeEventResponse } from "../../../lib/utils/test-utils";
import { createEvent, getAllEvents } from "./events-api";

const API_URL = import.meta.env.VITE_API_URL;

describe("events-api", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const mockEventResponse = makeEventResponse();

  const mockEvent = makeEvent({
    ...mockEventResponse,
    calendar: {
      color: "blue",
      id: 1,
      name: "Personal",
    },
    startAt: new Date(2026, 10, 13, 17, 0, 0),
    endAt: new Date(2026, 10, 13, 18, 0, 0),
  });

  const mockEventListResponse = [
    makeEventResponse(),
    makeEventResponse({
      id: 2,
      startAt: new Date(2026, 10, 20, 17, 0, 0).toISOString(),
      endAt: new Date(2026, 10, 20, 18, 0, 0).toISOString(),
    }),
  ];

  const mockEvents = [
    makeEvent({
      ...mockEventListResponse[0],
      calendar: {
        color: "blue",
        id: 1,
        name: "Personal",
      },
      startAt: new Date(2026, 10, 13, 17, 0, 0),
      endAt: new Date(2026, 10, 13, 18, 0, 0),
    }),
    makeEvent({
      ...mockEventListResponse[1],
      calendar: {
        color: "blue",
        id: 1,
        name: "Personal",
      },
      id: 2,
      startAt: new Date(2026, 10, 20, 17, 0, 0),
      endAt: new Date(2026, 10, 20, 18, 0, 0),
    }),
  ];

  const mockFormData = {
    title: "Hair cut",
    description: "Go to the salon for a cut and blowdry",
    calendarId: 1,
    startAt: new Date(2026, 10, 5, 10, 0, 0),
    endAt: new Date(2026, 10, 5, 10, 30, 0),
    isAllDay: false,
  };

  const mockErrorResponse = {
    status: 404,
    error: "Not Found",
    message: "Something went wrong with the fetch",
  };

  describe("getAllEvents", () => {
    it("Should return an array of events on successful fetch", async () => {
      vi.spyOn(window, "fetch").mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockEventListResponse,
      } as Response);

      const result = await getAllEvents();

      expect(result).toEqual(mockEvents);
      expect(fetch).toHaveBeenCalledWith(`${API_URL}/events`);
    });

    it("Should remove any null events", async () => {
      const mockEventResponse = [
        makeEventResponse(),
        makeEventResponse({
          id: 2,
          startAt: new Date(2026, 10, 20, 17, 0, 0).toISOString(),
          endAt: new Date(2026, 10, 20, 18, 0, 0).toISOString(),
        }),
        makeEventResponse({
          id: 3,
          startAt: "invalid",
          endAt: new Date(2026, 10, 20, 18, 0, 0).toISOString(),
        }),
      ];
      vi.spyOn(window, "fetch").mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockEventResponse,
      } as Response);

      const result = await getAllEvents();

      expect(result.length).toBe(2);
      expect(result).toEqual(mockEvents);
    });

    it("Should throw an ApiError when !response.ok", async () => {
      vi.spyOn(window, "fetch").mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => mockErrorResponse,
      } as Response);

      await expect(getAllEvents()).rejects.toThrow(
        new ApiError("Something went wrong with the fetch", 404),
      );
    });

    it("Should throw an error when fetch fails", async () => {
      vi.spyOn(window, "fetch").mockRejectedValueOnce(
        new Error("Network connection failed"),
      );

      await expect(getAllEvents()).rejects.toThrow("Network connection failed");
    });
  });

  describe("createEvent", () => {
    it("Should return an event on successful fetch", async () => {
      vi.spyOn(window, "fetch").mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => mockEventResponse,
      } as Response);

      const result = await createEvent(mockFormData);

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockFormData),
      });
      expect(result).toEqual(mockEvent);
    });

    it("Should throw an ApiError when response.status !== 201", async () => {
      vi.spyOn(window, "fetch").mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => mockErrorResponse,
      } as Response);

      await expect(createEvent(mockFormData)).rejects.toThrow(
        new ApiError("Something went wrong with the fetch", 400),
      );
    });

    it("Should throw an error when fails to convert response to an event", async () => {
      const mockInvalidEventResponse = makeEventResponse({
        startAt: "invalid",
      });

      vi.spyOn(window, "fetch").mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => mockInvalidEventResponse,
      } as Response);

      await expect(createEvent(mockFormData)).rejects.toThrow(
        new Error("Failed to map event response"),
      );
    });

    it("Should throw an error when create fails", async () => {
      vi.spyOn(window, "fetch").mockRejectedValueOnce(
        new Error("Network connection failed"),
      );

      await expect(createEvent(mockFormData)).rejects.toThrow(
        "Network connection failed",
      );
    });
  });
});
