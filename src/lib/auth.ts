// lib/auth.ts
import { cookies } from "next/headers";
import { GetUserAdmin } from "../../actions/GetUser";
import { userType, USERTYPEAdmin } from "@/types/types";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
const encoder = new TextEncoder()

interface Session {
  userId: string;
  email: string;
}
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

// تابع getSession
export async function getSession(cookieHeader?: string): Promise<USERTYPEAdmin | null> {
  if (cookieHeader) {
    // منطق Middleware
    const sessionCookie = cookieHeader
      .split('; ')
      .find(c => c.startsWith('tokken='))
      ?.split('=')[1];

    if (!sessionCookie) return null;
    return JSON.parse(decodeURIComponent(sessionCookie))  as USERTYPEAdmin;
  }

  // منطق کامپوننت‌های سرور
  
  const cookieStore = await cookies(); // بدون await
  const sessionCookie = cookieStore.get('tokken')?.value;
  const user = sessionCookie ? await verifyJWT(sessionCookie) : null
  console.log(user,'uer midlleware')
  //get detail user
  if(sessionCookie){
const oop = user as { id: string };
console.log(oop,'idddd')
    const  data:Response  = await GetUserAdmin(oop ? oop.id: "")
    const userDetail: USERTYPEAdmin = await data.json();
    return userDetail
  }else{
    return null
  }

  
// if(sessionCookie){
//   return userDetail
// }else{
//   return null
// }

  // return sessionCookie ? JSON.parse(sessionCookie) : null;
}

// تابع createSession
export async function createSession(user: Session) { // حذف async
  (await cookies()).set('session', JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
}

// تابع destroySession
export async function destroySession() { // حذف async
  (await cookies()).delete('session');
}




// افزودن نوع برای سشن سفارشات مهمان
interface GuestOrderSession {
  userId: string;
  orders: string[]; // آرایه‌ای از رشته‌های "productId|quantity"
}

// تابع ایجاد/آپدیت سشن مهمان
export async function createGuestSession(orderData: GuestOrderSession): Promise<boolean> {
  try {
    (await cookies()).set('guestSession', JSON.stringify(orderData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 هفته
      path: '/',
    });
    return true;
  } catch (error) {
    console.error('خطا در ایجاد سشن مهمان:', error);
    return false;
  }
}

// تابع دریافت سشن مهمان
export async function getGuestSession(): Promise<GuestOrderSession | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('guestSession')?.value;

  if (sessionCookie) {
    try {
      return JSON.parse(sessionCookie) as GuestOrderSession;
    } catch (error) {
      console.error('خطا در پردازش سشن مهمان:', error);
      return null;
    }
  }
  return null;
}

