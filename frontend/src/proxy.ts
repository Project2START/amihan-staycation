import { NextRequest } from "next/server";
import verifyRegistree from "./proxyModules/verifyRegistree";
import verifyAdmin from "./proxyModules/verifyAdmin";

export async function proxy(req: NextRequest) {
  const currentPath = req.nextUrl.pathname;

  if (currentPath === "/verify-code") {
    return await verifyRegistree(req);
  }

  if (["/spaces"].includes(currentPath)) {
    return await verifyAdmin(req);
  }
}

export const config = {
  matcher: ["/verify-code/:path*", "/spaces/:path*"],
};
