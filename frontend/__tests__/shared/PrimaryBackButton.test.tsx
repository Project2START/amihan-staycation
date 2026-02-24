import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PrimaryBackButton from "@/app/shared/components/PrimaryBackButton";

describe("PrimaryBackButton", () => {
  it("calls onClick when clicked", async () => {
    const onClick = jest.fn();
    render(<PrimaryBackButton onClick={onClick} />);

    const btn = screen.getByRole("button");
    await userEvent.click(btn);

    expect(onClick).toHaveBeenCalled();
  });
});
