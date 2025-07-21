// import { verify } from "jsonwebtoken"
import { NextRequest, NextResponse } from "next/server"
// import { jwtVerify } from 'jose'

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
const encoder = new TextEncoder()

const protectedRoutes = ["/profile"]
const guestOnlyRoutes = ["/register"]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function verifyJWT(token: string): Promise<any | null> {
  try {
    const [headerB64, payloadB64, signatureB64] = token.split(".")
    const signature = Uint8Array.from(atob(signatureB64.replace(/-/g, "+").replace(/_/g, "/")), c => c.charCodeAt(0))

    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(JWT_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    )

    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      signature,
      encoder.encode(`${headerB64}.${payloadB64}`)
    )

    if (!valid) return null

    const payloadJson = atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/"))
    return JSON.parse(payloadJson)
  } catch (err) {
    console.error("JWT Verify Error:", err)
    return null
  }
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("tokken")?.value
  const { pathname } = req.nextUrl

  console.log("💡 Token:", token)
  console.log("💡 Path:", pathname)

  const user = token ? await verifyJWT(token) : null
  console.log(user,'uer midlleware')


  if (!user && protectedRoutes.some((route) => pathname.startsWith(route))) {
    console.log("🔐 Redirecting to /register")
    return NextResponse.redirect(new URL("/register", req.url))
  }
  if(user && user.admin && guestOnlyRoutes.some((route) => pathname.startsWith(route))){
      console.log("👤 Logged-in user trying to access /register → Redirecting to /profile/cart")
    return NextResponse.redirect(new URL("/profile/admin", req.url))
  }else{
    
  }

  if (user &&!user.admin && guestOnlyRoutes.some((route) => pathname.startsWith(route))) {
    console.log("👤 Logged-in user trying to access /register → Redirecting to /profile/cart")
    return NextResponse.redirect(new URL("/profile/cart", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/register", "/profile", "/profile/:path*"],
}
