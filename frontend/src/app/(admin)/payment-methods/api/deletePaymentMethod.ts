import { HOST } from "@/app/shared/constants/config";
import axios from "axios";

export async function deletePaymentMethod(id: string) {
  const result = await axios.delete(`${HOST}/api/paymentMethods/${id}`, {
    withCredentials: true,
  });

  return result;
}
