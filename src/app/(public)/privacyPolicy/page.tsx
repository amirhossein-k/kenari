// src\app\(public)\privacyPolicy\page.tsx
'use client'

import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaChevronLeft } from "react-icons/fa6";

const PrivacyPolicyPage = () => {
  const pathname = usePathname() || "/";
  const router = useRouter();
    const [isNavigating, setIsNavigating] = useState(false);
 const handleBack = () => {
    setIsNavigating(true);
    toast('در حال بازگشت...', { duration: 2000, position: 'top-center' });

    // بررسی تاریخچه مرورگر
    if (window.history.length > 1) {
      router.back();
    } else {
      // اگر تاریخچه وجود ندارد، به صفحه اصلی هدایت شو
      router.push('/');
    }
  };
  
  // توقف پیام لودینگ پس از هدایت
  useEffect(() => {
    if (isNavigating) {
      const timer = setTimeout(() => {
        setIsNavigating(false);
      }, 2000); // مدت زمان Toast
      return () => clearTimeout(timer);
    }
  }, [isNavigating]);
  return (
    <div className="px-4 py-6 m-2 w-full md:w-[60%] mx-auto" dir="rtl">
        <div className="titlepath  flex justify-around">
            <div className=""></div>
            <span>{pathname.slice(1)}</span>
            <span onClick={handleBack}><FaChevronLeft />
</span>
        </div>
        <div className="titlee my-2">قوانین استفاده از خدمات ما (کافه کناری):</div>
        <ul className="flex flex-col gap-5"> 
            <li>1-  کافه کناری تابع قوانین و مقررات جمهوری اسلامی ایران است و درج هرگونه موارد سیاسی، غیر اخلاقی و مغایر با هنجارهای اجتماعی باعث حذف حساب کاربر مورد نظر خواهد شد.</li>

            <li>۲. استفاده از نام و نام‌خانوادگی حقیقی افراد به منظور ثبت‌نام در سایت الزامی است. در صورت مشاهده کلمات رکیک و الفاظ نامناسب، حساب كاربر حذف خواهد شد.

            </li>
            <li>
۳. هنگام سفارش، ثبت یک شماره معتبر و قابل دسترس برای کاربران الزامی است
            </li>
            <li>
۴. مسئولیت وارد کردن اطلاعات اشتباه و غیر واقعی از قبیل نام و نام‌خانوادگی، آدرس و شماره تماس به عهده کاربر است.


            </li>
            <li>
۵. نشان تجاری کافه کناری، در اداره کل ثبت شرکت‌ها و اداره کل مالکیت صنعتی به ثبت رسیده‌است و تحت پوشش قانون کپی‌رایت است.


            </li>
            <li>
۶. جهت استفاده از تخفیف برای سفارش از کافه کناری، باید روش پرداخت آنلاین و یا اعتباری انتخاب شود و این خدمات در روش پرداخت نقدی/کارت بانکی اعمال نمی‌شود.


            </li>
            <li>
۷. توجه داشته باشید کلیه اصول و رویه‏‌های کافه کناری منطبق با قوانین جمهوری اسلامی ایران، قانون تجارت الکترونیک و قانون حمایت از حقوق مصرف کننده است و متعاقباً کاربر نیز موظف به رعایت قوانین مرتبط با کاربر است. در صورتی که در قوانین مندرج، رویه‏‌ها و سرویس‏‌های سایت کافه کناری تغییراتی در آینده ایجاد شود، در همین صفحه منتشر و به روز رسانی می شود و شما توافق می‏‌کنید که استفاده مستمر شما از سایت به معنی پذیرش هرگونه تغییر است.
            </li>
        </ul>
      
    </div>
  )
}

export default PrivacyPolicyPage
