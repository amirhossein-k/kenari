// src\app\components\ClientComponent\Container\centerSide\CenterSide.tsx
import styles from "@/styles/center.module.scss";
import { Accordion, AccordionItem, Avatar, Skeleton } from "@heroui/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaRegDotCircle } from "react-icons/fa";

const CenterSide = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  // شبیه‌سازی لودینگ داده‌ها (مثلاً از API)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true); // بعد از 2 ثانیه فرض می‌کنیم داده‌ها لود شده‌اند
    }, 2000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div
      className={` w-full h-full ${styles.center} my-2 px-20 shadow-lg text_light `}
      dir="rtl"
    >
      <Skeleton isLoaded={isLoaded} className="w-full rounded-lg">
        {/* item1 */}
        <div className="item1 flex flex-col gap-3 p-2 ">
          <div className="top flex gap-8 items-center">
            <span className="text-2xl font-bold ">کافه کناری</span>
            <span
              className={`${styles.anima} text-lg flex flex-row-reverse gap-2 justify-center items-center`}
            >
              باز است
              <FaRegDotCircle />
            </span>
          </div>
          <div className="bottom text_light text-lg">
            تهران، ضلع شمال غربی چهار راه ولیعصر
          </div>
        </div>
      </Skeleton>
      <Skeleton isLoaded={isLoaded} className="w-full rounded-lg">
        {/* item2 */}
        <div className="bg-gray-100 flex flex-col gap-4 my-2">
          <div className="text-xl font-bold">نوع سفارش خود را انتخاب کنید:</div>
          <Accordion variant="splitted" className="">
            <AccordionItem
              key="1"
              aria-label="بر روی میز"
              style={{ fontSize: "25px" }}
              startContent={
                <Avatar
                  className="w-full h-[50px] "
                  isBordered
                  color="primary"
                  radius="lg"
                  src="https://c589564.parspack.net/c589564//1191929-%D9%85%D9%86%D9%88%DB%8C-%D8%B1%D9%88%D8%B2%D8%A7%D9%86%D9%87-%D8%A8%D8%B4%D9%82%D8%A7%D8%A8-%D8%A8%D8%A7-%D8%BA%D8%B0%D8%A7-%D8%B1%D9%88%DB%8C-%D9%85%DB%8C%D8%B2.jpg"
                />
              }
              title="بر روی میز"
            >
              <div className="one ">
                <div className="top  text-center text-lg font-medium rounded-lg px-3 py-2">
                  <Link href={'/menu/table'} className="w-full cursor-pointertext-lg font-medium  text-white bg-blue-600 rounded-lg  px-3 py-2 block" >
                    مشاهده منو بر روی میز
                  </Link>
                </div>
                <div className="bot flex flex-col gap-3">
                  <span className="text-lg font-medium">
                    چطور می‌تونیم کمک تون کنیم؟
                  </span>
                  <button className="text-center text-lg font-medium text-white bg-blue-600 rounded-lg px-3 py-2  cursor-pointer block">
                    فراخوان ویتر
                  </button>
                </div>
              </div>
            </AccordionItem>
          </Accordion>

          {/* item2 */}
          <Accordion variant="splitted" className="">
            <AccordionItem
              key="1"
              aria-label="بیرون بر"
              style={{ fontSize: "25px" }}
              startContent={
                <Avatar
                  className="w-full h-[50px]"
                  isBordered
                  color="primary"
                  radius="lg"
                  src="https://c589564.parspack.net/c589564//%D8%A8%D9%87%D8%AA%D8%B1%DB%8C%D9%86%2B%D8%BA%D8%B0%D8%A7%DB%8C%2B%D8%A8%DB%8C%D8%B1%D9%88%D9%86%2B%D8%A8%D8%B1%2B%D8%B1%D8%B4%D8%AA%2B%28%2B%D8%B5%D8%A8%D8%AD%D8%A7%D9%86%D9%87%D8%8C%2B%D9%81%D8%B3%D8%AA%2B%D9%81%D9%88%D8%AF%D8%8C%2B%D8%B1%D8%B3%D8%AA%D9%88%D8%B1%D8%A7%D9%86%DB%8C%29%2B-%2B%D8%AA%D8%B5%D9%88%DB%8C%D8%B1%2B1.jpg"
                />
              }
              title="بیرون بر"
            >
              <div className="one ">
                <div className="top  text-center text-lg font-medium bg-blue-600 rounded-lg px-3 py-2">
                  <span className="w-full cursor-pointer block text-white">
                    مشاهده منو بر روی میز
                  </span>
                </div>
              </div>
            </AccordionItem>
          </Accordion>
        </div>
      </Skeleton>
      <Skeleton isLoaded={isLoaded} className="w-full rounded-lg">
        {/* item3 */}
        <div>
          مکان استفاده از فضایی آرام برای گفتگو و دورهمی‌های دوستانه یا گفتگوهای
          اندیشمندان در فضای دلنشین و زیبای کافه کناری در کنار منویی جذاب،
          می‌تواند برطرف کننده‌ی خستگی کارهای روزانه باشد.
        </div>
      </Skeleton>
      {/* item4 */}
      <Skeleton isLoaded={isLoaded} className="w-full rounded-lg">
        {/* item4  */}
        <Accordion variant="splitted" className="">
          <AccordionItem
            key="1"
            aria-label="ساعت کاری"
            style={{ fontSize: "25px" }}
            title="ساعت کاری"
          >
            <div className="w-full  h-fit">
              <ul className="flex flex-col gap-3">
                <li className="flex justify-around shadow-lg">
                  <span>شنبه</span>
                  <span>۰۷:۰۰الی۲۲:۳۰</span>
                </li>
                <li className="flex justify-around shadow-lg">
                  <span>یک شنبه</span>
                  <span>۰۷:۰۰الی۲۲:۳۰</span>
                </li>
                <li className="flex justify-around shadow-lg">
                  <span >دو شنبه </span>
                  <span>۰۷:۰۰الی۲۲:۳۰</span>
                </li>
                <li className="flex justify-around shadow-lg">
                  <span className="text-center">سه شنبه</span>
                  <span>۰۷:۰۰الی۲۲:۳۰</span>
                </li>
                <li className="flex justify-around shadow-lg">
                  <span>چهار شنبه</span>
                  <span>۰۷:۰۰الی۲۲:۳۰</span>
                </li>
                <li className="flex justify-around shadow-lg">
                  <span>پنج شنبه</span>
                  <span>۰۷:۰۰الی۲۲:۳۰</span>
                </li>
              </ul>
            </div>
          </AccordionItem>
        </Accordion>
      </Skeleton>
      <Skeleton isLoaded={isLoaded} className="w-full rounded-lg">
        <div className="bottom w-full">footer</div>
      </Skeleton>
    </div>
  );
};

export default CenterSide;
