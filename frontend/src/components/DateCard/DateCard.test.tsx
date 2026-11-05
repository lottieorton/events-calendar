import { render, screen } from "@testing-library/react";
import DateCard from "./DateCard";
import userEvent from "@testing-library/user-event";

describe("DateCard", () => {
  const mockOnClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Should call onClick when clicked", async () => {
    const user = userEvent.setup();
    render(<DateCard date={new Date("11/01/2026")} onClick={mockOnClick} />);

    const dateCard = screen.getByRole("button", { name: "1" });
    await user.click(dateCard);

    expect(mockOnClick).toHaveBeenCalledOnce();
  });
});
