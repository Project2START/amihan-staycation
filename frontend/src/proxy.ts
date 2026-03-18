import { NextRequest, NextResponse } from "next/server";
import verifyRegistree from "./proxyModules/verifyRegistree";
import verifyAdmin from "./proxyModules/verifyAdmin";
import verifyGuest from "./proxyModules/verifyGuest";
import verifyUser from "./proxyModules/verifyUser";
import verifyAuthenticated from "./proxyModules/verifyAuthenticated";

const isPathMatch = (path: string, basePath: string) =>
  path === basePath || path.startsWith(`${basePath}/`);

export async function proxy(req: NextRequest) {
  const currentPath = req.nextUrl.pathname;

  if (isPathMatch(currentPath, "/verify-code")) {
    return await verifyRegistree(req);
  }

  if (
    ["/spaces", "/payment-methods"].some((basePath) =>
      isPathMatch(currentPath, basePath),
    )
  ) {
    return await verifyAdmin(req);
  }

  if (
    ["/bookings", "/my-bookings-history"].some((basePath) =>
      isPathMatch(currentPath, basePath),
    )
  ) {
    return await verifyUser(req);
  }

  if (isPathMatch(currentPath, "/profile")) {
    return await verifyAuthenticated(req);
  }

  if (
    currentPath === "/" ||
    ["/auth", "/sign-in", "/sign-up"].some((basePath) =>
      isPathMatch(currentPath, basePath),
    )
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
    "/bookings/:path*",
    "/my-bookings-history/:path*",
    "/profile/:path*",
  ],
};
