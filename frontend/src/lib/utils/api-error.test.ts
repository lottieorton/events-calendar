import { ApiError, toApiError } from "./api-error";

describe("toApiError", () => {
  it("Should return an ApiError", async () => {
    const mockBody = {
      message: "Something went wrong",
      details: { server: ["Server unavailable"] },
    };
    const mockResponse = {
      status: 400,
      json: async () => mockBody,
    } as unknown as Response;

    const result = await toApiError(mockResponse, "Fallback message");
    expect(result).toBeInstanceOf(ApiError);
    expect(result.message).toBe("Something went wrong");
    expect(result.status).toBe(400);
    expect(result.details).toEqual({ server: ["Server unavailable"] });
  });

  it("Should have default error message when none provided", async () => {
    const mockResponse = {
      status: 400,
      json: async () => ({}),
    } as unknown as Response;

    const result = await toApiError(mockResponse, "Fallback message");
    expect(result).toBeInstanceOf(ApiError);
    expect(result.message).toBe("Fallback message");
    expect(result.status).toBe(400);
    expect(result.details).toBeUndefined();
  });
});
