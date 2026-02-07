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

  if (["/spaces"].includes(currentPath)) {
    return await verifyAdmin(req);
  }

  console.log(["/units"].includes(currentPath));

  if (["/units"].includes(currentPath)) {
    return await verifyUser(req);
  }

  if (["/browse-units", "/sign-in", "/sign-up"].includes(currentPath)) {
    return await verifyGuest(req);
  }
}

export const config = {
  matcher: [
    "/verify-code/:path*",
    "/spaces/:path*",
    "/units/:path*",
    "/browse-units",
    "/sign-in",
    "/sign-up",
  ],
};
