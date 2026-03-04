import { NextRequest } from "next/server";
import verifyRegistree from "./proxyModules/verifyRegistree";
import verifyAdmin from "./proxyModules/verifyAdmin";
import verifyGuest from "./proxyModules/verifyGuest";
import verifyUser from "./proxyModules/verifyUser";
import verifyAuthenticated from "./proxyModules/verifyAuthenticated";

export async function proxy(req: NextRequest) {
  const currentPath = req.nextUrl.pathname;

  if (currentPath === "/verify-code") {
    return await verifyRegistree(req);
  }

  if (["/spaces", "/payment-methods"].includes(currentPath)) {
    return await verifyAdmin(req);
  }

  if (["/bookings", "/my-bookings-history"].includes(currentPath)) {
    return await verifyUser(req);
  }

  if (["/profile"].includes(currentPath)) {
    return await verifyAuthenticated(req);
  }

  if (["/auth", "/sign-in", "/sign-up", "/"].includes(currentPath)) {
    return await verifyGuest(req);
  }
}

export const config = {
  matcher: [
    "/",
    "/verify-code/:path*",
    "/spaces/:path*",
    "/auth",
    "/sign-in",
    "/sign-up",
    "/bookings",
    "/my-bookings-history",
    "/profile",
  ],
};
