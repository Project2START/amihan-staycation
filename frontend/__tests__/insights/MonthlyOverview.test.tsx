import { render, screen } from "@testing-library/react";
import MonthlyOverview from "@/app/(admin)/insights/components/MonthlyOverview";

// Mock recharts to avoid rendering SVG internals in tests
jest.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive">{children}</div>,
  LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  Cell: () => <div data-testid="cell" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
}));

describe("MonthlyOverview component", () => {
  it("renders summary text and list items", () => {
    render(<MonthlyOverview monthYear="October 2025" />);

    expect(screen.getByText(/Monthly Overview/i)).toBeInTheDocument();
    expect(screen.getByText(/Your insights for/i)).toBeInTheDocument();
    expect(screen.getByText(/Your insights for October 2025 are ready./i)).toBeInTheDocument();

    // List items
    expect(screen.getByText(/Revenue growth of 15%/i)).toBeInTheDocument();
    expect(screen.getByText(/Average guest rating: 4.8\/5 stars/i)).toBeInTheDocument();
  });

  it("renders booking trends and bookings per unit charts", () => {
    render(<MonthlyOverview monthYear="October 2025" />);

    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
  });
});
