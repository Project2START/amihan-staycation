import { NextResponse } from "next/server";

export async function DELETE() {
  const response = NextResponse.json({ ok: true });

  response.cookies.delete("id");
  response.cookies.delete("role");

  return response;
}
