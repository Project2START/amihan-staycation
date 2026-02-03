import axios from "axios";

/**
 * Handles errors thrown during Axios requests and normalizes them into a
 * consistent shape. If the error is an AxiosError, it extracts the response
 * message and status code when available. For non-Axios errors, it returns a
 * generic fallback message.
 *
 * @param error - The unknown error thrown during an API call.
 * @returns An object containing a user-friendly message and optional status code.
 */

export function errorHandler(error: unknown) {
  let message, status;

  if (axios.isAxiosError(error)) {
    if (!error.response) {
      message = error.message;
    } else {
      message =
        error.response.data.message ||
        "Something went wrong. Please try again later.";
    }
    status = error.status;
  } else {
    message = "Something went wrong. Please try again later.";
  }

  return { message, status };
}
