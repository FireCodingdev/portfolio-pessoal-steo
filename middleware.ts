import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, verifySessionToken } from "./lib/auth";

// Rotas de API que exigem login (leitura de leads, métricas e escrita de conteúdo)
const PROTECTED_API_PREFIXES = ["/api/leads", "/api/metrics", "/api/admin"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isDashboard = pathname.startsWith("/dashboard");
  const isProtectedApi = PROTECTED_API_PREFIXES.some((p) => pathname.startsWith(p));
  // /api/content é público para GET (o site precisa ler), mas protegido para PUT/POST/DELETE
  const isContentWrite =
    pathname.startsWith("/api/content") && req.method !== "GET";

  if (!isDashboard && !isProtectedApi && !isContentWrite) {
    return NextResponse.next();
  }

  const token = req.cookies.get(COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session) {
    if (isDashboard) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.json({ erro: "Não autenticado." }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/leads/:path*", "/api/metrics/:path*", "/api/admin/:path*", "/api/content/:path*"],
};
