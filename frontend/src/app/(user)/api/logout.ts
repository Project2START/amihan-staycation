import axiosWithAuth from "@/app/shared/lib/axiosWithAuth";
import { HOST } from "@/app/shared/constants/config";

export async function logout() {
  await axiosWithAuth.post(`${HOST}/api/users/logout`, {});
}
