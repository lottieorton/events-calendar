import { render, screen } from "@testing-library/react";
import Modal from "./Modal";
import userEvent from "@testing-library/user-event";

describe("Modal", () => {
  const mockOnClose = vi.fn();

  beforeAll(() => {
    HTMLDialogElement.prototype.showModal = vi.fn();
    HTMLDialogElement.prototype.close = vi.fn();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Should show the modal when open is true", () => {
    render(
      <Modal open title="Event Modal" onClose={mockOnClose}>
        <p>Modal content</p>
      </Modal>,
    );

    const modal = screen.getByLabelText("Event Modal");
    const modalContent = screen.getByText("Modal content");
    expect(modal).toBeInTheDocument();
    expect(modalContent).toBeInTheDocument();
  });

  it("Should not call showModal when open is false", () => {
    render(
      <Modal open={false} title="Event Modal" onClose={mockOnClose}>
        <p>Modal content</p>
      </Modal>,
    );

    expect(HTMLDialogElement.prototype.showModal).not.toHaveBeenCalled();
  });

  it("Should call onClose when X clicked", async () => {
    const user = userEvent.setup();
    render(
      <Modal open title="Event Modal" onClose={mockOnClose}>
        <p>Modal content</p>
      </Modal>,
    );

    const closeBtn = screen.getByLabelText("Close modal");
    await user.click(closeBtn);

    expect(mockOnClose).toHaveBeenCalledOnce();
  });

  it("Should call onClose when click outside of modal", async () => {
    const user = userEvent.setup();
    render(
      <Modal open title="Event Modal" onClose={mockOnClose}>
        <p>Modal content</p>
      </Modal>,
    );

    const dialog = screen.getByRole("dialog", { hidden: true });
    await user.click(dialog);

    expect(mockOnClose).toHaveBeenCalledOnce();
  });
});
