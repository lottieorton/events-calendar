import { render, screen } from "@testing-library/react";
import IconButton from "./IconButton";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import userEvent from "@testing-library/user-event";

describe("IconButton", () => {
  const mockOnClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Should be named from the label prop", () => {
    render(
      <IconButton icon={faCheck} onClick={mockOnClick} label="Test label" />,
    );

    expect(
      screen.getByRole("button", { name: "Test label" }),
    ).toBeInTheDocument();
  });

  it("Should call onClick when clicked", async () => {
    const user = userEvent.setup();
    render(
      <IconButton icon={faCheck} onClick={mockOnClick} label="Test label" />,
    );

    const iconBtn = screen.getByRole("button", { name: "Test label" });
    await user.click(iconBtn);

    expect(mockOnClick).toHaveBeenCalledOnce();
  });
});
