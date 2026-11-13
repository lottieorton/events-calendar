export type FieldErrors = Record<string, string[]>;
export class ApiError extends Error {
  readonly status: number;
  readonly details?: FieldErrors;

  constructor(message: string, status: number, details?: FieldErrors) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export const toApiError = async (res: Response, fallbackMsg: string) => {
  let body: { message?: string; details?: FieldErrors } = {};

  try {
    body = await res.json();
  } catch {
    // if response isn't json use the fallback message
  }

  return new ApiError(body.message ?? fallbackMsg, res.status, body.details);
};
