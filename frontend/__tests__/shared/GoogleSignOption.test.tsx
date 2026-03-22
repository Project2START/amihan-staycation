import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import GoogleSignOption from "@/app/shared/components/GoogleSignOption";
import { HOST } from "@/app/shared/constants/config";

describe("GoogleSignOption", () => {
  afterEach(() => jest.resetAllMocks());

  it("navigates to google oauth when clicked", async () => {
    const openSpy = jest.spyOn(window, "open").mockImplementation(() => null);

    render(<GoogleSignOption />);

    const button = screen.getByRole("button", { name: /google/i });

    await userEvent.click(button);

    expect(openSpy).toHaveBeenCalledWith(`${HOST}/api/users/google`, "_self");
  });
});
