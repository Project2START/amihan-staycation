import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// interface MyJWTPayload {
//   user_id: string;
//   user_role: "admin" | "user";
//   iat?: number;
//   exp?: number;
// }

export default async function verifyGuest(req: NextRequest) {
  const auth_token = req.cookies.get("auth_token")?.value;
  const notForYouPage = new URL("/not-found", req.url);
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  try {
    const { payload } = await jwtVerify(auth_token || "", secret);

    const role = payload.user_role;

    if (role !== "admin") return NextResponse.next();

    return NextResponse.rewrite(notForYouPage);
  } catch (err) {
    return NextResponse.rewrite(notForYouPage);
  }
}
