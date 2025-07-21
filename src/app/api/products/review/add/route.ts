
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { cookies } from 'next/headers';
import { USERTYPE } from '@/utils/types';
import { GetUser } from '../../../../../../actions/GetUser';

export async function POST(request: Request) {
  try {
    // دریافت بدنه درخواست
    const { productId, name, email, reviewText,rating } = await request.json();

    // اعتبارسنجی ورودی‌ها
    if (!productId || !name || !email || !reviewText || rating ===undefined) {
      return NextResponse.json(
        { error: 'تمامی فیلدها (productId, name, email, reviewText) الزامی هستند' },
        { status: 400 }
      );
    }

    // بررسی وجود محصول
    const product = await prisma.post.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'محصول یافت نشد' },
        { status: 404 }
      );
    }

    // بررسی احراز هویت کاربر
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'لطفاً ابتدا وارد حساب کاربری خود شوید' },
        { status: 401 }
      );
    }

    const sessionData: { userId?: string } = JSON.parse(sessionCookie);

    if (!sessionData?.userId) {
      return NextResponse.json(
        { error: 'داده‌های جلسه نامعتبر است' },
        { status: 400 }
      );
    }

    const userResponse = await GetUser(sessionData.userId);

    if (!userResponse.ok) {
      return NextResponse.json(
        { error: 'کاربر یافت نشد' },
        { status: 401 }
      );
    }

    const user: USERTYPE = await userResponse.json();

    // ایجاد نظر جدید
    const newReview = await prisma.reviewList.create({
      data: {
        reviewText,
        name: user.name || name, // استفاده از نام کاربر اگر موجود باشد
        email: user.email || email, // استفاده از ایمیل کاربر اگر موجود باشد
        ownerId: productId,
        rating
        
      },
      select: {
        id: true,
        reviewText: true,
        name: true,
        email: true,
        createdAt: true,
        rating:true
      },
    });

    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    console.error('خطا در افزودن نظر:', error);
    return NextResponse.json(
      { error: 'خطای سرور رخ داد' },
      { status: 500 }
    );
  }
}
