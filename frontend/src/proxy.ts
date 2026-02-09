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

  // Admin routes
  if (["/spaces", "/bookings", "/insights", "/agents"].includes(currentPath)) {
    return await verifyAdmin(req);
  }

  // User routes - use different path
  if (["/my-bookings"].includes(currentPath)) {
    return await verifyUser(req);
  }

  if (["/browse-units", "/sign-in", "/sign-up"].includes(currentPath)) {
    return await verifyGuest(req);
  }
}

export const config = {
  matcher: [
    "/verify-code/:path*",
    "/auth/:path*",
    "/my-bookings/:path*",  // Changed from /units
    "/spaces/:path*",
    "/bookings/:path*",
    "/insights/:path*",
    "/agents/:path*",
    "/browse-units",
    "/sign-in",
    "/sign-up",
  ],
};