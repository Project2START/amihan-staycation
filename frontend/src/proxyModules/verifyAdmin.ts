import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export default async function verifyAdmin(req: NextRequest) {
  const auth_token = req.cookies.get("auth_token")?.value;
  const notForYouPage = new URL("/not-found", req.url);

  if (!auth_token) return NextResponse.rewrite(notForYouPage);

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  try {
    const { payload } = await jwtVerify(auth_token, secret);

    const role = payload.user_role;
    const userId = payload.user_id;

    if (role === "admin" && userId) {
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set("x-user-id", `${userId}`);

      return NextResponse.next({
        request: { headers: requestHeaders },
      });
    } else {
      return NextResponse.rewrite(notForYouPage);
    }
  } catch (err) {
    return NextResponse.rewrite(notForYouPage);
  }
}
