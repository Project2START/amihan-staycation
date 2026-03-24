import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export default async function verifyOptionalAuthenticated(req: NextRequest) {
  const auth_token = req.cookies.get("auth_token")?.value;

  if (!auth_token) return NextResponse.next();

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  try {
    const { payload } = await jwtVerify(auth_token, secret);

    const role = payload.user_role;
    const userId = payload.user_id;

    if ((role === "user" || role === "admin" || role === "agent") && userId) {
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set("x-user-id", `${userId}`);

      return NextResponse.next({
        request: { headers: requestHeaders },
      });
    }

    return NextResponse.next();
  } catch {
    return NextResponse.next();
  }
}
