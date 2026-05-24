import { HOST } from "@/app/shared/constants/config";
import { getAuthHeader } from "./getAuthToken";

type FetchWithAuthClientOptions = RequestInit;

export async function fetchWithAuthClient(
  path: string,
  options: FetchWithAuthClientOptions = {},
) {
  const url = `${HOST}${path.startsWith("/") ? "" : "/"}${path}`;

  const authHeader = await getAuthHeader();
  const mergedHeaders = new Headers(options.headers || {});
  Object.entries(authHeader).forEach(([key, value]) => {
    mergedHeaders.set(key, value);
  });

  const res = await fetch(url, {
    ...options,
    headers: mergedHeaders,
  });

  return res;
}

export default fetchWithAuthClient;
