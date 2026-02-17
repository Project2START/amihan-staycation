import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export default async function verifyGuest(req: NextRequest) {
  const auth_token = req.cookies.get("auth_token")?.value;
  const notForYouPage = new URL("/not-found", req.url);
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  if (!auth_token) return NextResponse.next();

  try {
    const { payload } = await jwtVerify(auth_token || "", secret);

    const role = payload.user_role;
    const userId = payload.user_id;

    if (role === "user" && userId) {
      const response = NextResponse.redirect(new URL(`/units`, req.url));

      response.cookies.set("user_id", `${userId}`, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: 24 * 60 * 60 * 1000,
      });

      return response;
      // return NextResponse.redirect(new URL(`/units?user=${userId}`, req.url));
    }
    if (role === "admin") {
      const response = NextResponse.redirect(new URL(`/spaces`, req.url));

      response.cookies.set("user_id", `${userId}`, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: 24 * 60 * 60 * 1000,
      });

      return response;
      // return NextResponse.redirect(new URL(`/spaces?user=${userId}`, req.url));
    }
  } catch (err) {
    return NextResponse.rewrite(notForYouPage);
  }
}
