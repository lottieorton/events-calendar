import { useCalendars } from "../../hooks/calendar-hooks";
import CalendarList from "./CalendarList";
import { render, screen } from "@testing-library/react";
import { makeCalendar } from "../../../../lib/utils/test-utils";

vi.mock("../../hooks/calendar-hooks", () => ({
  useCalendars: vi.fn(),
}));

describe("CalendarList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockCalendars = [
    makeCalendar(),
    makeCalendar({ id: 2, name: "Family", color: "purple" }),
  ];

  it("Should call useCalendars on render", () => {
    vi.mocked(useCalendars).mockReturnValueOnce({
      data: mockCalendars,
      isLoading: false,
      isError: false,
    } as ReturnType<typeof useCalendars>);
    render(<CalendarList />);
    expect(useCalendars).toHaveBeenCalledOnce();
  });

  it("Should return empty list of calendars if data returned undefined", () => {
    vi.mocked(useCalendars).mockReturnValue({
      isLoading: false,
      isError: false,
    } as ReturnType<typeof useCalendars>);
    render(<CalendarList />);
    const header = screen.getByRole("heading", { level: 2 });
    expect(header).toHaveTextContent("My Calendars");
    expect(screen.queryByText("Family")).not.toBeInTheDocument();
  });

  it("Should return array of calendars if data returned", () => {
    vi.mocked(useCalendars).mockReturnValue({
      data: mockCalendars,
      isLoading: false,
      isError: false,
    } as ReturnType<typeof useCalendars>);
    render(<CalendarList />);
    const header = screen.getByRole("heading", { level: 2 });
    expect(header).toHaveTextContent("My Calendars");
    expect(screen.getByText("Personal")).toBeInTheDocument();
    expect(screen.getByText("Family")).toBeInTheDocument();
  });

  it("Should render alert if useCalendars fetch errors", () => {
    vi.mocked(useCalendars).mockReturnValue({
      isLoading: false,
      isError: true,
      error: {
        message: "Could not fetch calendars",
      },
    } as ReturnType<typeof useCalendars>);
    render(<CalendarList />);
    expect(screen.getByText("Error:")).toBeInTheDocument();
    expect(screen.getByText("Failed to fetch calendars")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Issue fetching calendars. Please try refreshing the page.",
      ),
    ).toBeInTheDocument();
  });

  it("Should render spinner if useCalendars isLoading", () => {
    vi.mocked(useCalendars).mockReturnValue({
      isLoading: true,
      isError: false,
    } as ReturnType<typeof useCalendars>);
    render(<CalendarList />);
    expect(screen.getByText("Loading")).toBeInTheDocument();
  });
});
