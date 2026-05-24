import { HOST } from "@/app/shared/constants/config";
import axiosWithAuth from "@/app/shared/lib/axiosWithAuth";

export async function deleteUnitProduct(id: string) {
  const result = await axiosWithAuth.delete(`${HOST}/api/products/${id}`);

  return result;
}
