// src\app\api\products\review\[id]\route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { cookies } from 'next/headers';
import { USERTYPE } from '@/utils/types';
import { GetUser } from '../../../../../../actions/GetUser';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {  try {
  const { id:reviewId } = await params;

    // اعتبارسنجی reviewId
    if (!reviewId) {
      return NextResponse.json(
        { error: 'شناسه نظر الزامی است' },
        { status: 400 }
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

    // بررسی اینکه کاربر ادمین است
    if (!user.admin) {
      return NextResponse.json(
        { error: 'فقط ادمین‌ها می‌توانند نظرات را حذف کنند' },
        { status: 403 }
      );
    }

    // بررسی وجود نظر
    const review = await prisma.reviewList.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return NextResponse.json(
        { error: 'نظر یافت نشد' },
        { status: 404 }
      );
    }

    // حذف نظر
    await prisma.reviewList.delete({
      where: { id: reviewId },
    });

    return NextResponse.json(
      { message: 'نظر با موفقیت حذف شد' },
      { status: 200 }
    );
  } catch (error) {
    console.error('خطا در حذف نظر:', error);
    return NextResponse.json(
      { error: 'خطای سرور رخ داد' },
      { status: 500 }
    );
  }
}