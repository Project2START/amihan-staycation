import axios from "axios";
import { SignInSchema } from "../lib/signInSchema";

export const signIn = async (data: SignInSchema) => {
  const response = await axios.post("/api/auth/sign-in", data);
  return response.data;
};
