import { fireEvent, render, screen } from "@testing-library/react";
import DateForm from "./DateForm";
import { toISODateString } from "../../lib/utils/date-utils";

vi.mock("../../lib/utils/date-utils", () => ({
  toISODateString: vi.fn(),
}));

describe("DateForm", () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(toISODateString).mockReturnValue("2026-11-03");
  });

  it("Should pass selected date to input", () => {
    render(
      <DateForm
        selectedDate={new Date("11/03/2026")}
        onChange={mockOnChange}
      />,
    );

    const dateInput = screen.getByLabelText("Select date");

    expect(dateInput).toHaveValue("2026-11-03");
  });

  it("Should call onChange when date selected", () => {
    render(
      <DateForm
        selectedDate={new Date("11/03/2026")}
        onChange={mockOnChange}
      />,
    );

    const dateInput = screen.getByLabelText("Select date");
    fireEvent.change(dateInput, { target: { value: "2026-11-04" } });

    expect(mockOnChange).toHaveBeenCalledOnce();
    expect(mockOnChange).toHaveBeenCalledWith("2026-11-04");
  });
});
