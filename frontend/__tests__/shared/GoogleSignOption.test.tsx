import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const pushMock = jest.fn();
jest.mock("next/navigation", () => ({ useRouter: () => ({ push: pushMock }) }));

import GoogleSignOption from "@/app/shared/components/GoogleSignOption";
import { HOST } from "@/app/shared/constants/config";

describe("GoogleSignOption", () => {
  afterEach(() => jest.resetAllMocks());

  it("navigates to google oauth when clicked", async () => {
    render(<GoogleSignOption />);

    const button = screen.getByRole("button", { name: /google/i });

    await userEvent.click(button);

    expect(pushMock).toHaveBeenCalledWith(`${HOST}/api/users/google`);
  });
});
