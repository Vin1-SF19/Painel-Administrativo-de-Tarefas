import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  // Rotas que exigem login
  const privateRoutes = ["/ScreenHome", "/Calendar", "/Tarefas"];

  const isPrivate = privateRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  if (isPrivate && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/ScreenHome/:path*", "/Calendar/:path*", "/Tarefas/:path*"],
};
