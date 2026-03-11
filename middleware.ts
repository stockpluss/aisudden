import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const DOMAIN_MAP: Record<string, string> = {
  "stockplus.im": "/stockplus",
  "www.stockplus.im": "/stockplus",
  "shinjeong.vc": "/shinjeong",
  "www.shinjeong.vc": "/shinjeong",
}

const BYPASS_PREFIXES = [
  "/api/",
  "/_next/",
  "/favicon",
  "/robots",
  "/sitemap",
  "/images/",
]

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const host = request.headers.get("host") ?? ""

  if (BYPASS_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next()
  }

  const isLocalhost = host.startsWith("localhost") || host.startsWith("127.0.0.1")

  if (isLocalhost) {
    const siteParam = request.nextUrl.searchParams.get("site")
    if (siteParam) {
      const targetBase = `/${siteParam}`
      const isKnownSite = Object.values(DOMAIN_MAP).includes(targetBase)
      if (!isKnownSite) {
        return new NextResponse("Not Found", { status: 404 })
      }
      if (pathname.startsWith(targetBase)) {
        return NextResponse.next()
      }
      const url = request.nextUrl.clone()
      url.pathname = pathname === "/" ? targetBase : `${targetBase}${pathname}`
      url.searchParams.delete("site")
      return NextResponse.rewrite(url)
    }
    return NextResponse.next()
  }

  const targetBase = DOMAIN_MAP[host]

  if (!targetBase) {
    return new NextResponse("Not Found", { status: 404 })
  }

  if (pathname.startsWith(targetBase)) {
    return NextResponse.next()
  }

  const url = request.nextUrl.clone()
  url.pathname = pathname === "/" ? targetBase : `${targetBase}${pathname}`
  url.search = search
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
