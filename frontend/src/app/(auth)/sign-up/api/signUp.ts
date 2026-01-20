import axios from "axios";
import { HOST } from "@/app/shared/constants/config";
import { SignupSchema } from "../lib/signUpSchema";

export const signUp = async (data: Partial<SignupSchema>) => {
  const response = await axios.post(`${HOST}/api/registree/register`, data, {
    withCredentials: true,
  });
  return response.data;
};
