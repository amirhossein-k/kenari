// actions\signup.ts
"use server";
// import { userType } from "@/types/types";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

export async function signUp(phone: string, name: string): Promise<{
  success: boolean;
  error?: string;
  data?: { user: { code: string } };
}> {
  try {
    const code = "1234"; // TODO: Replace with real OTP logic later

    console.log("signup attempt for phone:", phone);
    const existUser = await prisma.user.findFirst({
      where: { phoneNumber: phone },
    });
    console.log("existUser:", existUser);

    // اگر کاربر وجود داشته باشد (چه ادمین چه غیرادمین)
    if (existUser) {
      console.log("User already exists, updating...");
      await prisma.user.update({
        where: { id: existUser.id },
        data: {
          verify: false,
          code,
        },
      });
    } else {
      // ایجاد کاربر جدید
      console.log("Creating new user...");
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

    // مدیریت پروفایل ادمین برای شماره خاص
    if (phone === "09391470427") {
      console.log("Handling admin profile...");
      const existAdmin = await prisma.userAdmin.findUnique({
        where: { phoneNumber: phone },
      });

      if (!existAdmin) {
        console.log("Creating new admin profile...");
        await prisma.user.update({
          where: { phoneNumber: phone },
          data: { admin: true },
        });
        const customIdAdmin = `USRA-${Date.now()}-${uuidv4()}`;
        await prisma.userAdmin.create({
          data: {
            admin: true,
            code,
            id: customIdAdmin,
            name: `admin-${name}`,
            phoneNumber: phone,
            verify: false,
            idUser: "",
          },
        });
      } else {
        console.log("Updating existing admin profile...");
        await prisma.user.update({
          where: { phoneNumber: phone },
          data: { admin: true },
        });
        await prisma.userAdmin.update({
          where: { phoneNumber: phone },
          data: {
            code,
            verify: false,
          },
        });
      }
    }

    console.log("Signup successful");
    return {
      success: true,
      error: "",
      data: { user: { code } },
    };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Signup error:", error);
    if (error.code === "P2002") {
      // خطای محدودیت یکتایی در Prisma
      return {
        success: false,
        error: "شماره تلفن قبلاً ثبت شده است",
      };
    }
    return {
      success: false,
      error: error.message || "خطای ثبت‌نام",
    };
  }
}