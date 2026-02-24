import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ErrorClient from "@/app/shared/components/ErrorClient";

describe("ErrorClient", () => {
  it("renders message and calls onRetry when retry clicked", async () => {
    const onRetry = jest.fn();
    render(<ErrorClient message={"Oops"} onRetry={onRetry} />);

    expect(screen.getByText(/oops/i)).toBeInTheDocument();

    const btn = screen.getByRole("button", { name: /try again/i });
    await userEvent.click(btn);

    expect(onRetry).toHaveBeenCalled();
  });
});
