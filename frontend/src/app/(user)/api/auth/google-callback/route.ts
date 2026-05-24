import { NextRequest, NextResponse } from "next/server";
import { sign, verify } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const TOKEN_EXPIRES_IN = "24h";
const COOKIE_MAX_AGE_SECONDS = 24 * 60 * 60;

export async function POST(req: NextRequest) {
  const { token } = await req.json();

  if (!token) {
    return NextResponse.json(
      { message: "Missing OAuth token" },
      { status: 400 },
    );
  }

  let payload: any = null;
  try {
    payload = verify(token, JWT_SECRET);
  } catch {
    return NextResponse.json(
      { message: "Invalid or expired OAuth token" },
      { status: 401 },
    );
  }

  const { user_id, user_role, auth_version } = payload ?? {};
  if (!user_id || !user_role || typeof auth_version !== "number") {
    return NextResponse.json(
      { message: "Invalid token payload" },
      { status: 400 },
    );
  }

  const authToken = sign({ user_id, user_role, auth_version }, JWT_SECRET, {
    expiresIn: TOKEN_EXPIRES_IN,
  });

  const response = NextResponse.json({ ok: true });
  response.cookies.set("auth_token", authToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
  });
  response.cookies.set("id", user_id, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  });
  response.cookies.set("role", user_role, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  });

  return response;
}
