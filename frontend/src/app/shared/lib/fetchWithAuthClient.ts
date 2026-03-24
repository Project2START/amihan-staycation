import { HOST } from "@/app/shared/constants/config";

type FetchWithAuthClientOptions = RequestInit;

export async function fetchWithAuthClient(
  path: string,
  options: FetchWithAuthClientOptions = {},
) {
  const url = `${HOST}${path.startsWith("/") ? "" : "/"}${path}`;

  const res = await fetch(url, {
    ...options,
    credentials: "include",
  });

  return res;
}

export default fetchWithAuthClient;
