import axios from "axios";
import { HOST } from "@/app/shared/constants/config";
import { NewUnitSchema } from "../lib/newUnitSchema";

export const addUnit = async (data: NewUnitSchema) => {
  const response = await axios.post(`${HOST}/api/user/sign-in`, data, {
    withCredentials: true,
  });
  return response.data;
};
