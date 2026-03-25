import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();

  const response = NextResponse.json({ ok: true });

  response.cookies.set("registree_id", data.registree_id, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: data.cookieMaxAge,
  });

  return response;
}
