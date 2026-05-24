import { NextRequest, NextResponse } from "next/server";
import verifyRegistree from "./proxyModules/verifyRegistree";
import verifyAdmin from "./proxyModules/verifyAdmin";
import verifyGuest from "./proxyModules/verifyGuest";
import verifyUser from "./proxyModules/verifyUser";
import verifyAuthenticated from "./proxyModules/verifyAuthenticated";
import verifyOptionalAuthenticated from "./proxyModules/verifyOptionalAuthenticated";

const isPathMatch = (path: string, basePath: string) =>
  path === basePath || path.startsWith(`${basePath}/`);

const isUserReviewCreatePath = (path: string) =>
  /^\/units\/[^/]+\/reviews\/create(?:\/|$)/.test(path);

const ADMIN_PATHS = [
  "/spaces",
  "/payment-methods",
  "/agents",
  "/insights",
  "/my-bookings",
];

const USER_PATHS = ["/bookings", "/my-bookings-history", "/units/booking"];

const AUTHENTICATED_PATHS = ["/profile"];

const GUEST_PATHS = ["/auth", "/sign-in", "/sign-up", "/forgot-password"];

export async function proxy(req: NextRequest) {
  const currentPath = req.nextUrl.pathname;

  if (isPathMatch(currentPath, "/verify-code")) {
    return await verifyRegistree(req);
  }

  if (isUserReviewCreatePath(currentPath)) {
    return await verifyUser(req);
  }

  if (ADMIN_PATHS.some((basePath) => isPathMatch(currentPath, basePath))) {
    return await verifyAdmin(req);
  }

  if (USER_PATHS.some((basePath) => isPathMatch(currentPath, basePath))) {
    return await verifyUser(req);
  }

  if (
    AUTHENTICATED_PATHS.some((basePath) => isPathMatch(currentPath, basePath))
  ) {
    return await verifyAuthenticated(req);
  }

  if (isPathMatch(currentPath, "/units")) {
    return await verifyOptionalAuthenticated(req);
  }

  if (
    currentPath === "/" ||
    GUEST_PATHS.some((basePath) => isPathMatch(currentPath, basePath))
  ) {
    return await verifyGuest(req);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/verify-code/:path*",
    "/spaces/:path*",
    "/payment-methods/:path*",
    "/auth/:path*",
    "/sign-in/:path*",
    "/sign-up/:path*",
    "/forgot-password/:path*",
    "/reset-password/:path*",
    "/bookings/:path*",
    "/my-bookings-history/:path*",
    "/units/booking/:path*",
    "/units/:path*",
    "/profile/:path*",
    "/agents/:path*",
    "/insights/:path*",
    "/my-bookings/:path*",
    "/reviews/:path*",
  ],
};
