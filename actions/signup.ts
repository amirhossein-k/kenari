// actions\signup.ts
"use server";
import { userType } from "@/types/types";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

export async function signUp(phone: string, name: string): Promise<{
  success: boolean;
  error?: string;
  data?: { user: userType };
}> {
  try {
    const code = "1234"; // TODO: Replace with real OTP logic later

    const existUser = await prisma.user.findFirst({
      where: { phoneNumber: phone },
    });

    if (existUser) {
      const updatedUser = await prisma.user.update({
        where: { id: existUser.id },
        data: {
          admin: false,
          verify: false,
          code,
        },
      });

      return {
        success: true,
        error:"",
        data: { user: updatedUser },
      };
    } else {
      const customId = `USR-${Date.now()}-${uuidv4()}`;
      if(phone==='09391470427'){

        const customIdAdmin = `USRA-${Date.now()}-${uuidv4()}`;
         await prisma.userAdmin.create({
              data:{
                admin:true,
                code,
                id:customIdAdmin,
                name:"admin",
                phoneNumber:phone,
                verify:false,
              }
            })
      }

      const newUser = await prisma.user.create({
        data: {
          id: customId,
          admin: false,
          name,
          phoneNumber: phone,
          verify: false,
          code,
        },
      });

      return {
        success: true,
        error:"",
        data: { user: newUser },
      };
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "خطای ثبت‌نام",
    };
  }
}