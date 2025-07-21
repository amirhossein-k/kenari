//actions\GetUser.ts
"use server";


import { USERTYPEAdmin } from '@/types/types';

import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client';

const prisma  = new PrismaClient()

export async function GetUserAdmin(id: string) {
    console.log('GetUserAdmin')
    try {
       const user: USERTYPEAdmin | null = await prisma.userAdmin.findUnique({
  where: { id },
  include: {
    posts: {
      include: {
        productImage: true,
        categoryList: true,
        review: true,
        listProperty: true,
        tags:true,


      }
    },

  }
})


console.log(user,'action get user')
        return NextResponse.json(user)

    } catch (error) {
        console.log(error, 'error get listproduct error')
        return NextResponse.json(
            { error: 'خطا در سرور' },
            { status: 500 }
        );
    }

}

