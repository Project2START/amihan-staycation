import axios from "axios";
import { HOST } from "@/app/shared/constants/config";

export const requestPasswordReset = async ({
  email,
  source,
}: {
  email: string;
  source: "auth" | "profile";
}) => {
  const response = await axios.post(
    `${HOST}/api/users/password-reset/request`,
    { email, source },
    { withCredentials: true },
  );

  return response.data;
};

export const validatePasswordResetToken = async (token: string) => {
  const response = await axios.post(
    `${HOST}/api/users/password-reset/validate-token`,
    { token },
    { withCredentials: true },
  );

  return response.data;
};

export const completePasswordReset = async ({
  token,
  password,
  confirmPassword,
  source,
}: {
  token: string;
  password: string;
  confirmPassword: string;
  source: "auth" | "profile";
}) => {
  const response = await axios.post(
    `${HOST}/api/users/password-reset/complete`,
    { token, password, confirmPassword, source },
    { withCredentials: true },
  );

  return response.data;
};
