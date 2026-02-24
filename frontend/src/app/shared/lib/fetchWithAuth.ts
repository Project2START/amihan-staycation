import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { HOST } from "@/app/shared/constants/config";

type FetchWithAuthOptions = RequestInit;

export async function fetchWithAuth(
  path: string,
  options: FetchWithAuthOptions = {},
) {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("auth_token")?.value;

  if (!authToken) {
    return notFound();
  }

  const url = `${HOST}${path.startsWith("/") ? "" : "/"}${path}`;

  const baseHeaders: Record<string, string> =
    options.headers instanceof Headers
      ? Object.fromEntries(options.headers.entries())
      : (options.headers as Record<string, string>) || {};

  const headers = {
    ...baseHeaders,
    cookie: `auth_token=${authToken}`,
  };

  const res = await fetch(url, { ...options, headers });

  return res;
}

export default fetchWithAuth;
