import React from "react";
import { render, screen } from "@testing-library/react";
import AlternativeSeparator from "@/app/shared/components/AlternativeSeparator";

describe("AlternativeSeparator", () => {
  it("renders default content", () => {
    render(<AlternativeSeparator />);
    expect(screen.getByText(/or continue with/i)).toBeInTheDocument();
  });

  it("renders custom content", () => {
    render(<AlternativeSeparator content={"Custom"} />);
    expect(screen.getByText(/custom/i)).toBeInTheDocument();
  });
});
