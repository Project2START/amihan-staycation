import React from "react";
import { render, screen } from "@testing-library/react";
import ButtonLoadingStopper from "@/app/shared/components/ButtonLoadingStopper";

describe("ButtonLoadingStopper", () => {
  it("shows a progress indicator when loading is true", () => {
    render(
      <ButtonLoadingStopper loading={true}>
        <button>Inner</button>
      </ButtonLoadingStopper>,
    );

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("does not show progress when loading is false", () => {
    render(
      <ButtonLoadingStopper loading={false}>
        <button>Inner</button>
      </ButtonLoadingStopper>,
    );

    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });
});
