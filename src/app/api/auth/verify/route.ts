// src/app/api/auth/verify/route.ts
import { NextResponse } from "next/server";
import { sign } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(req: Request) {
  try {
    // دریافت داده‌های درخواست
    const body = await req.json();
    const { code, phone } = body;
    console.log(code, "codeee");
    console.log(phone, "phone");

    // بررسی وجود داده‌های ورودی
    if (!code || !phone) {
      return NextResponse.json(
        { success: false, error: "کد یا شماره تلفن ارسال نشده." },
        { status: 400 }
      );
    }

    // بررسی وجود کاربر
    const user = await prisma.user.findFirst({
      where: { phoneNumber: phone },
    });
    console.log("User found:", user);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "کاربر یافت نشد" },
        { status: 404 }
      );
    }

    // بررسی صحت کد تأیید
    if (code !== user.code) {
      return NextResponse.json(
        { success: false, error: "کد نامعتبر" }, // اصلاح تایپوگرافی
        { status: 401 }
      );
    }

    // به‌روزرسانی وضعیت تأیید کاربر
    await prisma.user.update({
      where: { id: user.id },
      data: { verify: true, code: '' }, // حذف کد پس از تأیید
    });

    // اگر کاربر ادمین است
    if (user.admin) {
      const updatedAdmin = await prisma.userAdmin.update({
        where: { phoneNumber: phone },
        data: {
          code,
          verify: true,
          idUser: user.id,
        },
      });

      const token = sign(updatedAdmin, JWT_SECRET, { expiresIn: "24h" });

      const response = NextResponse.json({
        success: true,
        message: "تأیید موفقیت‌آمیز بود",
        user: updatedAdmin,
      });

      response.cookies.set("tokken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24,
        sameSite: "lax",
      });

      return response;
    }

    // برای کاربران غیرادمین
    const token = sign(
      { id: user.id, phoneNumber: user.phoneNumber, admin: false },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    const response = NextResponse.json({
      success: true,
      message: "تأیید موفقیت‌آمیز بود",
      user: { id: user.id, phoneNumber: user.phoneNumber, admin: false },
    });

    response.cookies.set("tokken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24,
      sameSite: "lax",
    });

    return response;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Verify error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "خطا در تأیید" },
      { status: 500 }
    );
  }
}