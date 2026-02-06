import axios from "axios";
import { HOST } from "../constants/config";

export async function logout() {
  await axios.post(`${HOST}/api/users/logout`, {}, { withCredentials: true });
}
