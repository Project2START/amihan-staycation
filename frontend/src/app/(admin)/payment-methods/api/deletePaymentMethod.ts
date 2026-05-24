import { HOST } from "@/app/shared/constants/config";
import axiosWithAuth from "@/app/shared/lib/axiosWithAuth";

export async function deletePaymentMethod(id: string) {
  const result = await axiosWithAuth.delete(`${HOST}/api/paymentMethods/${id}`);

  return result;
}
