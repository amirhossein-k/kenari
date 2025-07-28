// src\app\api\auth\verify\route.ts
import { NextResponse } from "next/server";
import { sign } from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient()


const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';


export async function POST(req: Request) {
  try {


    const body = await req.json();

    const { code, phone } = body;
console.log(code,'codeee')
    if (!code) {
      return NextResponse.json({ error: 'کد یا شماره تلفن ارسال نشده.' }, { status: 400 });
    }

    const user = await prisma.user.findFirst({ where: { phoneNumber: phone } }

    )
    // verify code
    if (code !== user?.code) {
      return NextResponse.json(
        { succes: true, error: "کد نا معتبر" },
        { status: 401 }
      );
    }



    console.log(phone, 'phone')
    if (user?.admin) {
  const updatedAdmin = await prisma.userAdmin.update({
    where: { phoneNumber: phone },
    data: {
      code,
      verify: true,
      idUser: user.id
    },
  });

  const token = sign(
    updatedAdmin,
    JWT_SECRET!,
    { expiresIn: '24h' }
  );

  const response = NextResponse.json({
    success: true,
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










  } catch (error) {
    console.error('خطا در تأیید کد:', error);
    return NextResponse.json({ error: 'خطایی رخ داده است.' }, { status: 500 });
  }

};
