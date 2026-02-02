import { HOST } from "@/app/shared/constants/config";
import axios from "axios";

export async function deleteUnitProduct(id: string) {
  const result = await axios.delete(`${HOST}/api/products/${id}`, {
    withCredentials: true,
  });

  return result;
}
