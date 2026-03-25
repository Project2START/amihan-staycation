import { NextRequest, NextResponse } from "next/server";

export default async function verifyAdmin(req: NextRequest) {
  const userId = req.cookies.get("id")?.value;
  const role = req.cookies.get("role")?.value;

  const notForYouPage = new URL("/not-found", req.url);

  if (!userId) return NextResponse.rewrite(notForYouPage);

  if (role === "admin" && userId) {
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-id", `${userId}`);

    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  } else {
    return NextResponse.rewrite(notForYouPage);
  }
}
