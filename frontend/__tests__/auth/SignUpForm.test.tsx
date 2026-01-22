import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import SignUpForm from "@/app/(auth)/sign-up/components/SignUpForm";
import {
  EMAIL_MAX_LENGTH,
  NAME_MAX_LENGTH,
  NAME_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from "@/app/shared/constants/authFormValidation";
import { signUp } from "@/app/(auth)/sign-up/api/signUp";

jest.mock("../../src/app/(auth)/sign-up/api/signUp");

const pushMock = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

describe("SignUpForm Component", () => {
  let firstNameInput: HTMLInputElement;
  let lastNameInput: HTMLInputElement;
  let emailInput: HTMLInputElement;
  let passwordInput: HTMLInputElement;
  let confirmPasswordInput: HTMLInputElement;
  let submitButton: HTMLInputElement;

  beforeEach(() => {
    render(<SignUpForm />);
    firstNameInput = screen.getByPlaceholderText(/first name/i);
    lastNameInput = screen.getByPlaceholderText(/last name/i);
    emailInput = screen.getByPlaceholderText(/email/i);
    passwordInput = screen.getByPlaceholderText(/^password$/i); // matches the "Password" field
    confirmPasswordInput = screen.getByPlaceholderText(/confirm password/i);
    submitButton = screen.getByRole("button", { name: /sign up/i });
  });

  describe("Form Validation", () => {
    it("shows error when email is empty", async () => {
      expect(emailInput.value).toBe("");
      await userEvent.click(submitButton);
      expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    });
    it("shows an error when email format is invalid", async () => {
      await userEvent.type(emailInput, "invalid-email");
      await userEvent.click(submitButton);
      const emailError = await screen.findByText(/invalid email address/i);
      expect(emailError).toBeInTheDocument();
    });
    it("shows error when email exceeds maximum length", async () => {
      await userEvent.type(emailInput, "a".repeat(EMAIL_MAX_LENGTH + 1));
      await userEvent.click(submitButton);
      const errorRegex = new RegExp(
        `Email cannot exceed ${EMAIL_MAX_LENGTH} characters`,
        "i"
      );
      const error = await screen.findByText(errorRegex);
      expect(error).toBeInTheDocument();
    });
    it("shows error when first name is empty", async () => {
      expect(firstNameInput.value).toBe("");
      await userEvent.click(submitButton);
      expect(
        await screen.findByText(/at least 2 characters/i, {
          selector: "#firstName-error",
        })
      ).toBeInTheDocument();
    });
    it("shows error when first name exceeds maximum length", async () => {
      await userEvent.type(firstNameInput, "a".repeat(NAME_MAX_LENGTH + 1));
      await userEvent.click(submitButton);
      const errorRegex = new RegExp(
        `Exceeded ${NAME_MAX_LENGTH} characters`,
        "i"
      );
      const error = await screen.findByText(errorRegex);
      expect(error).toBeInTheDocument();
    });
    it("shows error when first name is less than minimum length", async () => {
      await userEvent.type(firstNameInput, "a".repeat(NAME_MIN_LENGTH - 1));
      await userEvent.click(submitButton);
      const errorRegex = new RegExp("at least 2 characters", "i");
      const error = await screen.findByText(errorRegex, {
        selector: "#firstName-error",
      });
      expect(error).toBeInTheDocument();
    });
    it("shows error when first name contains invalid characters", async () => {
      await userEvent.type(firstNameInput, "John123!");
      await userEvent.click(submitButton);

      const errorRegex = /can only contain letters/i;
      const error = await screen.findByText(errorRegex, {
        selector: "#firstName-error",
      });
      expect(error).toBeInTheDocument();
    });
    it("shows error when last name is empty", async () => {
      expect(lastNameInput.value).toBe("");
      await userEvent.click(submitButton);
      expect(
        await screen.findByText(/at least 2 characters/i, {
          selector: "#lastName-error",
        })
      ).toBeInTheDocument();
    });

    it("shows error when last name exceeds maximum length", async () => {
      await userEvent.type(lastNameInput, "a".repeat(NAME_MAX_LENGTH + 1));
      await userEvent.click(submitButton);
      const errorRegex = new RegExp(
        `Exceeded ${NAME_MAX_LENGTH} characters`,
        "i"
      );
      const error = await screen.findByText(errorRegex, {
        selector: "#lastName-error",
      });
      expect(error).toBeInTheDocument();
    });

    it("shows error when last name is less than minimum length", async () => {
      await userEvent.type(lastNameInput, "a".repeat(NAME_MIN_LENGTH - 1));
      await userEvent.click(submitButton);
      const errorRegex = new RegExp("at least 2 characters", "i");
      const error = await screen.findByText(errorRegex, {
        selector: "#lastName-error",
      });
      expect(error).toBeInTheDocument();
    });

    it("shows error when last name contains invalid characters", async () => {
      await userEvent.type(lastNameInput, "Doe123!");
      await userEvent.click(submitButton);

      const errorRegex = /can only contain letters/i;
      const error = await screen.findByText(errorRegex, {
        selector: "#lastName-error",
      });
      expect(error).toBeInTheDocument();
    });

    it("shows error when password is empty", async () => {
      expect(passwordInput.value).toBe("");
      await userEvent.click(submitButton);
      expect(
        await screen.findByText(/password must be at least 8 characters/i)
      ).toBeInTheDocument();
    });

    it("shows error when password exceeds maximum length", async () => {
      await userEvent.type(passwordInput, "a".repeat(PASSWORD_MAX_LENGTH + 1));
      await userEvent.click(submitButton);
      const errorRegex = new RegExp(
        `Password cannot exceed ${PASSWORD_MAX_LENGTH} characters`,
        "i"
      );
      const error = await screen.findByText(errorRegex);
      expect(error).toBeInTheDocument();
    });

    it("shows error when password is less than minimum length", async () => {
      await userEvent.type(passwordInput, "a".repeat(PASSWORD_MIN_LENGTH - 1));
      await userEvent.click(submitButton);
      const errorRegex = new RegExp(
        `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
        "i"
      );
      const error = await screen.findByText(errorRegex);
      expect(error).toBeInTheDocument();
    });

    it("shows error when password is missing an uppercase letter", async () => {
      await userEvent.type(passwordInput, "lowercase123");
      await userEvent.click(submitButton);
      const errorRegex = /password must contain at least one uppercase letter/i;
      const error = await screen.findByText(errorRegex);
      expect(error).toBeInTheDocument();
    });

    it("shows error when password is missing a lowercase letter", async () => {
      await userEvent.type(passwordInput, "UPPERCASE123");
      await userEvent.click(submitButton);
      const errorRegex = /password must contain at least one lowercase letter/i;
      const error = await screen.findByText(errorRegex);
      expect(error).toBeInTheDocument();
    });

    it("shows error when password is missing a number", async () => {
      await userEvent.type(passwordInput, "PasswordOnly");
      await userEvent.click(submitButton);
      const errorRegex = /password must contain at least one number/i;
      const error = await screen.findByText(errorRegex);
      expect(error).toBeInTheDocument();
    });
    it("shows error when confirm password does not match password", async () => {
      await userEvent.type(passwordInput, "Password123");
      await userEvent.type(confirmPasswordInput, "Password321");
      await userEvent.click(submitButton);

      const error = await screen.findByText(/passwords do not match/i);
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
    it("toggles confirm password and icon visibility when clicked twice", async () => {
      const toggleButton = screen.getByRole("button", {
        name: /toggle confirm password visibility/i,
      });
      // Initial state (hidden)
      expect(confirmPasswordInput).toHaveAttribute("type", "password");
      expect(screen.getByTestId("confirmPassword-hidden")).toBeInTheDocument();
      // First click (visible)
      await userEvent.click(toggleButton);
      expect(confirmPasswordInput).toHaveAttribute("type", "text");
      expect(screen.getByTestId("confirmPassword-visible")).toBeInTheDocument();
      // Second click (hidden again)
      await userEvent.click(toggleButton);
      expect(confirmPasswordInput).toHaveAttribute("type", "password");
      expect(screen.getByTestId("confirmPassword-hidden")).toBeInTheDocument();
    });
  });

  describe("Sign Up Flow", () => {
    it("redirects to verify code page when sign up is successful", async () => {
      (signUp as jest.Mock).mockResolvedValue({ success: true });

      await userEvent.type(firstNameInput, "John");
      await userEvent.type(lastNameInput, "Doe");
      await userEvent.type(emailInput, "test@example.com");
      await userEvent.type(passwordInput, "Password123");
      await userEvent.type(confirmPasswordInput, "Password123");

      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(pushMock).toHaveBeenCalledWith("/verify-code");
      });
    });
    it("shows error when sign up fails due to email already in use", async () => {
      (signUp as jest.Mock).mockRejectedValue({
        isAxiosError: true,
        response: {
          data: {
            message: "Email already in use. Please provide a different one.",
          },
        },
      });

      await userEvent.type(firstNameInput, "John");
      await userEvent.type(lastNameInput, "Doe");
      await userEvent.type(emailInput, "test@example.com");
      await userEvent.type(passwordInput, "Password123");
      await userEvent.type(confirmPasswordInput, "Password123");

      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(pushMock).not.toHaveBeenCalled();
      });

      expect(
        await screen.findByText(
          /Email already in use. Please provide a different one./i
        )
      ).toBeInTheDocument();
    });
    it("shows error when sign up fails due to network error", async () => {
      (signUp as jest.Mock).mockRejectedValue({
        isAxiosError: true,
        message: "Network Error",
      });

      await userEvent.type(firstNameInput, "John");
      await userEvent.type(lastNameInput, "Doe");
      await userEvent.type(emailInput, "test@example.com");
      await userEvent.type(passwordInput, "Password123");
      await userEvent.type(confirmPasswordInput, "Password123");

      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(pushMock).not.toHaveBeenCalled();
      });

      expect(await screen.findByText(/network error/i)).toBeInTheDocument();
    });
    it("shows error when sign up fails due to unknown error", async () => {
      (signUp as jest.Mock).mockRejectedValue({
        message: "Something went wrong. Please try again later.",
      });

      await userEvent.type(firstNameInput, "John");
      await userEvent.type(lastNameInput, "Doe");
      await userEvent.type(emailInput, "test@example.com");
      await userEvent.type(passwordInput, "Password123");
      await userEvent.type(confirmPasswordInput, "Password123");

      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(pushMock).not.toHaveBeenCalled();
      });

      expect(
        await screen.findByText(
          /something went wrong. please try again later./i
        )
      ).toBeInTheDocument();
    });
  });
});
