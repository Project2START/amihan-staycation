/**
 * Middleware function that verifies the current user's registree ID
 * by sending it to the backend verification endpoint. If verification
 * succeeds, the request continues normally. If it fails, the user is
 * redirected to a "not found" page.
 *
 * @param req - The incoming Next.js request, used to read cookies and build redirects.
 * @returns A `NextResponse` that either allows the request to proceed
 *          or rewrites the route to the /not-found page on failure.
 */

import { HOST } from "@/app/shared/constants/config";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export default async function verifyRegistree(req: NextRequest) {
  const registree_id = req.cookies.get("registree_id")?.value;
  try {
    await axios.post(`${HOST}/api/registrees/verify`, {
      id: registree_id,
    });

    return NextResponse.next();
  } catch (err) {
    const notForYouPage = new URL("/not-found", req.url);

    return NextResponse.rewrite(notForYouPage);
  }
}
