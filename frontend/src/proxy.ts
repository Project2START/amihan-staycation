import { NextRequest } from "next/server";
import verifyRegistree from "./proxyModules/verifyRegistree";
import verifyAdmin from "./proxyModules/verifyAdmin";
import verifyGuest from "./proxyModules/verifyGuest";
import verifyUser from "./proxyModules/verifyUser";

export async function proxy(req: NextRequest) {
  const currentPath = req.nextUrl.pathname;

  if (currentPath === "/verify-code") {
    return await verifyRegistree(req);
  }

  // Admin-protected routes (matching NavigationBottomSpaces paths)
  if (["/spaces", "/bookings", "/insights", "/agents"].includes(currentPath)) {
    return await verifyAdmin(req);
  }

  if (["/units"].includes(currentPath)) {
    return await verifyUser(req);
  }

  if (["/auth"].includes(currentPath)) {
    return await verifyGuest(req);
  }
}

export const config = {
  matcher: [
    "/verify-code/:path*",
    "/auth/:path*",
    "/units/:path*",
    "/spaces/:path*",
    "/bookings/:path*",
    "/insights/:path*",
    "/agents/:path*",
  ],
};