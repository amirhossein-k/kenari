/* eslint-disable @typescript-eslint/no-unused-vars */
// src\app\api\products\add\route.ts
import { getSession } from "@/lib/auth";
// import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

import { PrismaClient } from '@prisma/client';
import { TagType } from "@/types/types";

const prisma  = new PrismaClient()

interface ImageObject {
  key: string;
  url: string;
  id: string;
}

interface ProductRequest {
  name: string;
  price: number;
  html: string;
  checkbox: string;
  tableContent: string
  detailImage: ImageObject[]; // آرایه‌ای از اشیای تصویر
  imageDefult: string;
  selectedImageId: string;
  count: number;
  countproduct: number;
  priceOffer: number;
  category:string[]
  tags:TagType[]
  
}

export async function POST(request: Request) {
  try {
   


    const session = await getSession();
    console.log(session, 'sesiion data');
    console.log(session?.id,'sesiion data id');
    if (!session) {
      return NextResponse.json(
        { error: 'کاربر احراز هویت نشده است' },
        { status: 401 }
      );
    }
console.log('before')
// console.log(">>> Received tableContent on server:", tableContent);



return NextResponse.json({ success: true, message: "پست جدید ذخیره شد" });
return { success: true, message: "پست جدید ذخیره شد" };

 
  } catch (error) {
    console.log(error, 'error login error');
    return NextResponse.json(
      { error: 'خطا در سرور' },
      { status: 500 }
    );
  }
}
