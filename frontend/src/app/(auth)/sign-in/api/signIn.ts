import axios from "axios";
import { HOST } from "@/app/shared/constants/config";
import { SignInSchema } from "../lib/signInSchema";

export const signIn = async (data: SignInSchema) => {
  const response = await axios.post(`${HOST}/api/user/sign-in`, data, {
    withCredentials: true,
  });
  return response.data;
};
