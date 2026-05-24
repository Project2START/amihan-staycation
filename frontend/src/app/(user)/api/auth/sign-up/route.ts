import { NextRequest, NextResponse } from "next/server";
import { sign } from "jsonwebtoken";
import { HOST } from "@/app/shared/constants/config";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const TOKEN_EXPIRES_IN = "24h";
const COOKIE_MAX_AGE_SECONDS = 24 * 60 * 60;

export async function POST(req: NextRequest) {
  if (!HOST) {
    return NextResponse.json(
      { message: "Missing API host configuration" },
      { status: 500 },
    );
  }

  const payload = await req.json();

  const backendResponse = await fetch(`${HOST}/api/users/sign-up`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  let data: any = null;
  try {
    data = await backendResponse.json();
  } catch {
    data = null;
  }

  if (!backendResponse.ok) {
    return NextResponse.json(
      { message: data?.message ?? "Unable to complete sign up" },
      { status: backendResponse.status },
    );
  }

  const user = data?.user;
  if (!user?.id || !user?.role || typeof user?.auth_version !== "number") {
    return NextResponse.json(
      { message: "Missing user auth details" },
      { status: 500 },
    );
  }

  const token = sign(
    {
      user_id: user.id,
      user_role: user.role,
      auth_version: user.auth_version,
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRES_IN },
  );

  const response = NextResponse.json(data, { status: 201 });
  response.cookies.set("auth_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
  });
  response.cookies.set("id", user.id, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  });
  response.cookies.set("role", user.role, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  });

  return response;
}
