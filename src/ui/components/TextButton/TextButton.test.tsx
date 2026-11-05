import { render, screen } from "@testing-library/react";
import TextButton from "./TextButton";
import userEvent from "@testing-library/user-event";

describe("TextButton", () => {
  const mockOnClick = vi.fn();
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Should render children", () => {
    render(<TextButton onClick={mockOnClick}>Click me</TextButton>);

    expect(
      screen.getByRole("button", { name: "Click me" }),
    ).toBeInTheDocument();
  });

  it("Should call onClick when clicked", async () => {
    const user = userEvent.setup();

    render(<TextButton onClick={mockOnClick}>Click me</TextButton>);

    const textBtn = screen.getByRole("button", { name: "Click me" });
    await user.click(textBtn);

    expect(mockOnClick).toHaveBeenCalledOnce();
  });

  it("Should not submit surrounding form by default", async () => {
    const user = userEvent.setup();

    render(
      <form onSubmit={mockOnSubmit}>
        <TextButton onClick={mockOnClick}>Click me</TextButton>
      </form>,
    );

    const textBtn = screen.getByRole("button", { name: "Click me" });
    await user.click(textBtn);

    expect(mockOnSubmit).not.toHaveBeenCalled();
    expect(mockOnClick).toHaveBeenCalled();
  });
});
