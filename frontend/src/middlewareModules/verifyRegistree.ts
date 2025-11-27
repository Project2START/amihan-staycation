import { HOST } from "@/app/shared/constants/config";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export default async function verifyRegistree(req: NextRequest) {
  const registree_id = req.cookies.get("registree_id")?.value;
  try {
    await axios.post(`${HOST}/api/registree/verify`, {
      id: registree_id,
    });

    return NextResponse.next();
  } catch (err) {
    const notForYouPage = new URL("/not-found", req.url);
    return NextResponse.rewrite(notForYouPage);
  }
}
