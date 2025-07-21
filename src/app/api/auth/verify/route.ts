// src\app\api\auth\verify\route.ts
import { NextResponse } from "next/server";
import {sign} from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient()


const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';


export async function POST(req: Request) {
    try {
        

        const body = await req.json();
      
        const { code,phone } = body;
      
         if (!code ) {
            return NextResponse.json({ error: 'کد یا شماره تلفن ارسال نشده.' }, { status: 400 });
          }
      
          const user = await prisma.user.findFirst({where:{phoneNumber:phone}}

          )
        // verify code
        if (code !== user?.code) {
          return NextResponse.json(
            { succes: true, error: "کد نا معتبر" },
            { status: 401 }
          );
        }

        // save to databse
        // const userExist = await prisma.user.findMany({where:{phoneNumber: phone}}) 
        // if(userExist){
           
        //   const update
        // }else{

        // }

        let admin=false
        console.log(phone,'phone')
        if(phone==='09391470427'){

          admin=true
               const existingAdmin = await prisma.userAdmin.findUnique({
    where: { phoneNumber: phone },
  });

  if (existingAdmin) {
    await prisma.userAdmin.update({
      where: { phoneNumber: phone },
      data: {
        admin: true,
        code,
        verify: true,
      },
    });
  } else {
    // اگر از قبل نبود، بساز
    await prisma.userAdmin.create({
      data: {
        id: `USRA-${Date.now()}`,
        phoneNumber: phone,
        name: "admin",
        verify: true,
        code,
        admin: true,
      },
    });
  }
         
        }else{
          admin=false
        }
      
       
      const uptadeVerify = await prisma.user.update({
        where:{
          id:user?.id
        },
        data:{
          verify:true,
          admin,
          code 
        }
      })
      if (!uptadeVerify) {
  return NextResponse.json({ error: 'کاربر یافت نشد یا آپدیت نشد' }, { status: 500 });
}
      //   create jwt7
        const token = sign(
          uptadeVerify,
          JWT_SECRET!,
          {expiresIn:'24h'}
        )

        
            const response = NextResponse.json({
      success: true,
      user: uptadeVerify,
    })

      
      //   دخیره توکن در کوکی hhttpOnly
         response.cookies.set("tokken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 روز
      sameSite: "lax",
    })

    return response
      
      

    } catch (error) {
         console.error('خطا در تأیید کد:', error);
    return NextResponse.json({ error: 'خطایی رخ داده است.' }, { status: 500 });
    }

};
