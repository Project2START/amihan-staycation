import { NextRequest } from "next/server";
import verifyRegistree from "./middlewareModules/verifyRegistree";

export async function middleware(req: NextRequest) {
  const currentPath = req.nextUrl.pathname;

  if (currentPath === "/verify-code") {
    return await verifyRegistree(req);
  }
}

export const config = {
  matcher: ["/verify-code/:path*"],
};
