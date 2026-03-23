import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export default async function verifyUser(req: NextRequest) {
  const auth_token = req.cookies.get("auth_token")?.value;

  console.log(auth_token);
  const notForYouPage = new URL("/not-found", req.url);

  if (!auth_token) return NextResponse.rewrite(notForYouPage);

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  try {
    const { payload } = await jwtVerify(auth_token, secret);

    const role = payload.user_role;
    const userId = payload.user_id;

    if ((role === "user" || role === "agent") && userId) {
      const response = NextResponse.next();

      response.cookies.set("user_id", `${userId}`, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: 24 * 60 * 60 * 1000,
      });

      return response;
    } else {
      return NextResponse.rewrite(notForYouPage);
    }
  } catch (err) {
    return NextResponse.rewrite(notForYouPage);
  }
}
