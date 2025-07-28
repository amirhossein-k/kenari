// actions\signup.ts
"use server";
// import { userType } from "@/types/types";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

export async function signUp(phone: string, name: string): Promise<{
  success: boolean;
  error?: string;
  data?: { user: {code:string} };
}> {
  try {
    const code = "1234"; // TODO: Replace with real OTP logic later

    const existUser = await prisma.user.findFirst({
      where: { phoneNumber: phone },
    });

    if(existUser &&!existUser.admin){
        await prisma.user.update({
        where: { id: existUser.id },
        data: {
          admin: existUser.admin,
          verify: false,
          code,
        },
      });

    }else{
       const customId = `USR-${Date.now()}-${uuidv4()}`;
       await prisma.user.create({
        data: {
          id: customId,
          admin: false,
          name,
          phoneNumber: phone,
          verify: false,
          code,
          
        },
      });
    }
    // new user


      // if spcial number => create userAdmin profile
   if (phone === '09391470427') {
  const existAdmin = await prisma.userAdmin.findUnique({
    where: { phoneNumber: phone }
  });




  if (!existAdmin) {

    await prisma.user.update({
      where:{phoneNumber:phone},
      data:{
        admin:true
      }
    })
    const customIdAdmin = `USRA-${Date.now()}-${uuidv4()}`;
    await prisma.userAdmin.create({
      data: {
        admin: true,
        code,
        id: customIdAdmin,
        name: `admin-${name}`,
        phoneNumber: phone,
        verify: false,
        idUser: ''
      }
    });
  } else {
        await prisma.user.update({
      where:{phoneNumber:phone},
      data:{
        admin:true
      }
    })
    await prisma.userAdmin.update({
      where: { phoneNumber: phone },
      data: {
        code,
        verify: false
      }
    });
  }
}


    // 




      return {
        success: true,
        error:"",
        data: { user: {code} },
      };
   
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "خطای ثبت‌نام",
    };
  }
}