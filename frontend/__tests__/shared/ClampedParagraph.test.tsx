import React from "react";
import { render, screen } from "@testing-library/react";
import ClampedParagraph from "@/app/shared/components/ClampedParagraph";

describe("ClampedParagraph", () => {
  it("renders provided text", () => {
    render(<ClampedParagraph text={"Hello world"} />);
    expect(screen.getByText(/hello world/i)).toBeInTheDocument();
  });
});
