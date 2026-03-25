import { NextRequest, NextResponse } from "next/server";

export default async function verifyUser(req: NextRequest) {
  const userId = req.cookies.get("id")?.value;
  const role = req.cookies.get("role")?.value;

  const notForYouPage = new URL("/not-found", req.url);

  if (!userId) return NextResponse.rewrite(notForYouPage);

  if ((role === "user" || role === "agent") && userId) {
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-id", `${userId}`);

    const response = NextResponse.next({
      request: { headers: requestHeaders },
    });

    return response;
  } else {
    return NextResponse.rewrite(notForYouPage);
  }
}
