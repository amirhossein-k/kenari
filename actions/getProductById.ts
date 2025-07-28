

import { GetProductByIdResult } from "@/types/types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
 
export async function getProductById(id: string):Promise<GetProductByIdResult> {
    try {
        const product = await prisma.post.findUnique({
            where: {
                id: id,
            },
            include: {
                tags: true,  // اگر می‌خواهید تگ‌ها هم بیاید
                categoryList: true,  // اگر می‌خواهید دسته‌بندی‌ها هم بیاید
                productImage: true,  // تصاویر هم بیاید
            }
        });

        if (!product) {
    return {
      success: false,
      status: 404,
      error: 'محصول یافت نشد',
      message: '',
      data: null, // ✅
    };
  }

  return {
    success: true,
    status: 200,
    message: 'محصول پیدا شد',
    data: product,
  };

    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: 'خطا در دسترسی به داده‌ها',
            status: 500,
            error: 'خطای سرور',
           data:null
        };
    }
}
