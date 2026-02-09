import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SignInForm from "@/app/(auth)/sign-in/components/SignInForm";
import {
  EMAIL_MAX_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from "@/app/shared/constants/authFormValidation";
import { signIn } from "@/app/(auth)/sign-in/api/signIn";

jest.mock("../../src/app/(auth)/sign-in/api/signIn");

const pushMock = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

describe("SignInForm Component", () => {
  let emailInput: HTMLInputElement;
  let passwordInput: HTMLInputElement;
  let submitButton: HTMLInputElement;

  beforeEach(() => {
    render(<SignInForm />);
    emailInput = screen.getByPlaceholderText(/email/i);
    passwordInput = screen.getByPlaceholderText(/password/i);
    submitButton = screen.getByRole("button", { name: /sign in/i });
  });

  describe("Form Validation", () => {
    it("shows error when email is empty", async () => {
      expect(emailInput.value).toBe("");

      await userEvent.click(submitButton);

      expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    });

    it("shows error when password is empty", async () => {
      expect(passwordInput.value).toBe("");

      await userEvent.click(submitButton);

      expect(
        await screen.findByText(/password is required/i),
      ).toBeInTheDocument();
    });

    it("shows an error when email format is invalid", async () => {
      await userEvent.type(emailInput, "invalid-email");

      await userEvent.click(submitButton);

      const emailError = await screen.findByText(/invalid email address/i);
      expect(emailError).toBeInTheDocument();
    });
    it("shows error when password exceeds maximum length", async () => {
      await userEvent.type(passwordInput, "a".repeat(PASSWORD_MAX_LENGTH + 1));

      await userEvent.click(submitButton);
      const errorRegex = new RegExp(
        `Password cannot exceed ${PASSWORD_MAX_LENGTH} characters`,
        "i",
      );
      const error = await screen.findByText(errorRegex);

      expect(error).toBeInTheDocument();
    });
    it("shows error when password is less than minimum length", async () => {
      await userEvent.type(passwordInput, "a".repeat(PASSWORD_MIN_LENGTH - 1));

      await userEvent.click(submitButton);
      const errorRegex = new RegExp(
        `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
        "i",
      );
      const error = await screen.findByText(errorRegex);

      expect(error).toBeInTheDocument();
    });
    it("shows error when email exceeds maximum length", async () => {
      await userEvent.type(emailInput, "a".repeat(EMAIL_MAX_LENGTH + 1));

      await userEvent.click(submitButton);
      const errorRegex = new RegExp("Invalid email address", "i");
      const error = await screen.findByText(errorRegex);
      expect(error).toBeInTheDocument();
    });
  });

  describe("Password Toggle", () => {
    it("toggles password and icon visibility when clicked twice", async () => {
      const toggleButton = screen.getByRole("button", {
        name: /toggle password visibility/i,
      });

      // Initial state (hidden)
      expect(passwordInput).toHaveAttribute("type", "password");
      expect(screen.getByTestId("password-hidden")).toBeInTheDocument();

      // First click (visible)
      await userEvent.click(toggleButton);
      expect(passwordInput).toHaveAttribute("type", "text");
      expect(screen.getByTestId("password-visible")).toBeInTheDocument();

      // Second click (hidden again)
      await userEvent.click(toggleButton);
      expect(passwordInput).toHaveAttribute("type", "password");
      expect(screen.getByTestId("password-hidden")).toBeInTheDocument();
    });
  });

  describe("Sign In Flow", () => {
    it("redirects to auth when sign in is successful", async () => {
      (signIn as jest.Mock).mockResolvedValue({ success: true });

      await userEvent.type(emailInput, "test@example.com");
      await userEvent.type(passwordInput, "password123");

      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(pushMock).toHaveBeenCalledWith("/browse-units");
      });
    });
    it("shows error when sign in fails due to invalid credentials", async () => {
      (signIn as jest.Mock).mockRejectedValue({
        isAxiosError: true,
        response: {
          data: { message: "Invalid credentials" },
        },
      });

      await userEvent.type(emailInput, "test@example.com");
      await userEvent.type(passwordInput, "password123");

      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(pushMock).not.toHaveBeenCalled();
      });

      expect(
        await screen.findByText(/invalid credentials/i),
      ).toBeInTheDocument();
    });
    it("shows error when sign in fails due to network error", async () => {
      (signIn as jest.Mock).mockRejectedValue({
        isAxiosError: true,
        message: "Network Error",
      });

      await userEvent.type(emailInput, "test@example.com");
      await userEvent.type(passwordInput, "password123");

      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(pushMock).not.toHaveBeenCalled();
      });

      expect(await screen.findByText(/network error/i)).toBeInTheDocument();
    });
    it("shows error when sign in fails due to unknown error", async () => {
      (signIn as jest.Mock).mockRejectedValue({
        message: "Something went wrong. Please try again later.",
      });

      await userEvent.type(emailInput, "test@example.com");
      await userEvent.type(passwordInput, "password123");

      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(pushMock).not.toHaveBeenCalled();
      });

      expect(
        await screen.findByText(
          /something went wrong. please try again later./i,
        ),
      ).toBeInTheDocument();
    });
  });
});
