import { verifySessionToken } from "@/lib/auth/session";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const publicPaths = ["/", "/circoli", "/login", "/registrazione"];

function isPublicPath(pathname: string) {
  if (publicPaths.includes(pathname)) return true;
  if (pathname.startsWith("/circoli/")) return true;
  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("court_session")?.value;

  if (isPublicPath(pathname)) {
    if (token && (pathname === "/login" || pathname === "/registrazione")) {
      try {
        const session = await verifySessionToken(token);
        const destination =
          session.role === "SUPER_ADMIN" || session.role === "ADMIN"
            ? "/admin"
            : session.role === "CLUB_OWNER" || session.role === "CLUB_STAFF"
              ? "/club"
              : "/dashboard";
        return NextResponse.redirect(new URL(destination, request.url));
      } catch {
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const session = await verifySessionToken(token);

    if (pathname.startsWith("/admin")) {
      if (session.role !== "SUPER_ADMIN" && session.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }

    if (pathname.startsWith("/club")) {
      const allowed =
        session.role === "CLUB_OWNER" ||
        session.role === "CLUB_STAFF" ||
        session.role === "ADMIN" ||
        session.role === "SUPER_ADMIN";

      if (!allowed) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }

    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("court_session");
    return response;
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
