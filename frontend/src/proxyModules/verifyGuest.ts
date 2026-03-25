import { NextRequest, NextResponse } from "next/server";

export default async function verifyGuest(req: NextRequest) {
  const userId = req.cookies.get("id")?.value;
  const role = req.cookies.get("role")?.value;

  if (!userId) return NextResponse.next();

  if ((role === "user" || role === "agent") && userId) {
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-id", `${userId}`);

    const response = NextResponse.redirect(new URL(`/units`, req.url));

    return response;
  }
  if (role === "admin" && userId) {
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-id", `${userId}`);

    const response = NextResponse.redirect(new URL(`/spaces`, req.url));

    return response;
  }
}
