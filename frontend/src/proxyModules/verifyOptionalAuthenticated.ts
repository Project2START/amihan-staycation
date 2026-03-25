import { NextRequest, NextResponse } from "next/server";

export default async function verifyOptionalAuthenticated(req: NextRequest) {
  const userId = req.cookies.get("id")?.value;
  const role = req.cookies.get("role")?.value;

  if (!userId) return NextResponse.next();
  if ((role === "user" || role === "admin" || role === "agent") && userId) {
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-id", `${userId}`);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }
}
