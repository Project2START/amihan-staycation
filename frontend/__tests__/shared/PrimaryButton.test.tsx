import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PrimaryButton from "@/app/shared/ui/PrimaryButton";

describe("PrimaryButton", () => {
  it("renders children and calls onClick when enabled", async () => {
    const onClick = jest.fn();
    render(<PrimaryButton onClick={onClick}>Click me</PrimaryButton>);

    const btn = screen.getByRole("button", { name: /click me/i });
    await userEvent.click(btn);

    expect(onClick).toHaveBeenCalled();
  });

  it("does not call onClick when disabled", async () => {
    const onClick = jest.fn();
    render(
      <PrimaryButton onClick={onClick} disabled>
        Disabled
      </PrimaryButton>,
    );

    const btn = screen.getByRole("button", { name: /disabled/i });
    expect(btn).toBeDisabled();
    expect(onClick).not.toHaveBeenCalled();
  });
});
