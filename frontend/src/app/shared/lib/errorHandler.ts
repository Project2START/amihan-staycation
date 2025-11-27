import axios from "axios";

export function errorHandler(error: unknown) {
  let message, status;

  if (axios.isAxiosError(error)) {
    if (!error.response) {
      message = error.message;
    } else {
      message = error.response.data.message || "";
    }
    status = error.status;
  } else {
    message = "Something went wrong. Please try again later.";
  }

  return { message, status };
}
