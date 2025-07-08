
'use client';
import React, { useEffect, useRef, useContext, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TiThMenu } from 'react-icons/ti';
import { FaAngleLeft } from 'react-icons/fa';
import { Skeleton } from '@heroui/skeleton';
import Image from 'next/image';
import SpinnersNav from '@/features/SpinnerNav';
import { MainContext } from '@/context/MainContext';
import toast from 'react-hot-toast';

// تعریف تایپ برای محصولات
interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  tags: string[];
}

const selectorMain = [
  { id: '14', title: 'cafe', icone: '', active: true },
  { id: '42', title: 'res', icone: '', active: false },
];

const selector = [
  { id: '1', title: 'beauty', icone: '', active: true },
  { id: '2', title: 'eyeshadow', icone: '', active: false },
  { id: '3', title: 'mascara', icone: '', active: false },
  { id: '4', title: 'face powder', icone: '', active: false },
  { id: '5', title: 'lipstick', icone: '', active: false },
  { id: '6', title: 'res', icone: '', active: false },
];

// تابع fetch برای دریافت محصولات
const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch('https://dummyjson.com/products', {
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) {
      throw new Error('خطا در دریافت محصولات');
    }
    const data = await response.json();
    if (!Array.isArray(data.products)) {
      throw new Error('محصولات نمی‌توانند فرایند مورد نیاز روی آن‌ها صورت گیرند');
    }
    return data.products.map((item: Product) => {
      const isRes = item.tags.some((tag) => ['groceries', 'kitchen-accessories'].includes(tag));
      return {
        ...item,
        tags: isRes ? [...item.tags, 'res'] : item.tags,
      };
    });
  } catch (error) {
    // بررسی خطای شبکه
    if (error instanceof Error && error.message.includes('Failed to fetch')) {
      throw new Error('اینترنت وصل نیست');
    }
    throw error; // سایر خطاها به همان صورت پرتاب می‌شوند
  }
};

const Tablepage = () => {
  const [activeSelector, setActiveSelector] = React.useState(selector[0]?.title || 'beauty');
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const prevActiveSelector = useRef(activeSelector);
  const { setLoading } = useContext(MainContext);
  const [ ErrorMessage,setErrorMessage] = useState<string>('')
  const prevErrorMessage = useRef<string>(''); // برای جلوگیری از Toastهای مکرر

  // استفاده از react-query برای دریافت محصولات
  const { data: products = [], isLoading, isError, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    retry: 2, // تلاش مجدد در صورت خطا
    staleTime: 5 * 60 * 1000, // کش برای 5 دقیقه
  });

  // به‌روزرسانی loading در context
  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  // نمایش پیام خطا با Toast
// نمایش پیام خطا با Toast و div
  useEffect(() => {
    if (isError && error) {
      const message = error.message || 'خطایی رخ داده است';
      if (message !== prevErrorMessage.current) {
        toast(message, { duration: 4000, position: 'top-center' });
        prevErrorMessage.current = message;
      }
      setErrorMessage(message);
    } else if (ErrorMessage !== '') {
      setErrorMessage('');
      prevErrorMessage.current = '';
    }
  }, [isError, error, ErrorMessage]);


  // به‌روزرسانی prevActiveSelector
  useEffect(() => {
    prevActiveSelector.current = activeSelector;
  }, [activeSelector]);

  // تنظیم Intersection Observer برای تشخیص تگ فعال
  useEffect(() => {
    const currentRefs = sectionRefs.current;
    if (Object.keys(currentRefs).length === 0) {
      console.warn('No section refs available to observe');
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length === 0) return;
        const mostVisible = visibleEntries.reduce(
          (prev, curr) => (curr.intersectionRatio > prev.intersectionRatio ? curr : prev),
          visibleEntries[0]
        );
        if (mostVisible) {
          const tag = mostVisible.target.getAttribute('data-tag');
          if (process.env.NODE_ENV !== 'production') {
            console.log('Most visible tag:', tag, 'Ratio:', mostVisible.intersectionRatio, 'Element:', mostVisible.target);
          }
          if (tag && selector.some((item) => item.title === tag) && tag !== prevActiveSelector.current) {
            setActiveSelector(tag);
          } else if (process.env.NODE_ENV !== 'production') {
            console.warn('Invalid or same tag:', tag);
          }
        }
      },
      { threshold: 0.5, rootMargin: '0px 0px -50px 0px' }
    );

    Object.values(currentRefs).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      Object.values(currentRefs).forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [products]);

  // گروه‌بندی محصولات بر اساس تگ‌ها
  const groupedProducts = selector.reduce((acc, item) => {
    const filtered = products.filter((p) => p.tags?.includes(item.title) ?? false);
    if (filtered.length > 0) {
      acc[item.title] = filtered;
      if (process.env.NODE_ENV !== 'production') {
        console.log(`Group ${item.title}:`, filtered.length, 'products');
      }
    }
    return acc;
  }, {} as { [key: string]: Product[] });

  return (
      <div className="w-full h-screen " dir="rtl">
        <SpinnersNav />
        <div className="container  mx-auto h-full py-4 overflow-y-auto">
           {ErrorMessage && (
          <div className=" text-white p-4 rounded-md mb-4 mx-4 text-center">
            {ErrorMessage}
          </div>
        )}

          {/* nav */}
          <div className="nav flex justify-between items-center py-4 px-3">
            <div className="text-2xl lg:text-4xl md:text-3xl">
              <TiThMenu />
            </div>
            <div className="text-lg lg:text-xl">بر روی میز</div>
            <div className="text-2xl lg:text-4xl md:text-3xl">
              <FaAngleLeft />
            </div>
          </div>
          {/* selector main */}

          <div className="slector_main px-4  sticky -top-2 z-20 bg-white my-2">
          <div className="px-4  absolute  -top-1 -z-10 h-[110px] bg-white my-2 w-full"></div>
            <ul className="flex text-lg">
              {selectorMain.map((item) => (
                <li
                  key={item.id}
                  className={`cursor-pointer px-4 py-2 ${
                    activeSelector === 'res' && item.title === 'res'
                      ? 'border-b-2 border-black'
                      : activeSelector !== 'res' && item.title === 'cafe'
                      ? 'border-b-2 border-black'
                      : ''
                  }`}
                >
                  {item.title}
                </li>
              ))}
            </ul>
          </div>
          {/* selector */}
          <div className="slector my-4 px-2 sticky top-[40px] bg-white z-20">
            <ul className="flex gap-2">
              {selector.map((item) => (
                <li
                  className={`px-5 py-2 text-md rounded-3xl cursor-pointer ${
                    activeSelector === item.title ? 'bg-black text-white shadow-md' : 'bg-gray-200'
                  }`}
                  key={item.id}
                  onClick={() => {
                    const section = sectionRefs.current[item.title];
                    if (section) {
                      section.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  {item.title}
                </li>
              ))}
            </ul>
          </div>
          {/* list of products */}
          <div className="list px-4">
            {isLoading ? (
              <ul className="flex flex-col gap-4">
                {Array(6).fill(0).map((_, index) => (
                  <li key={index}>
                    <Skeleton isLoaded={false} className="w-full h-40 rounded-md" />
                    <Skeleton isLoaded={false} className="w-3/4 h-6 mt-2 rounded-md" />
                    <Skeleton isLoaded={false} className="w-full h-4 mt-2 rounded-md" />
                    <Skeleton isLoaded={false} className="w-1/2 h-6 mt-2 rounded-md" />
                  </li>
                ))}
              </ul>
            ) : (
              Object.entries(groupedProducts).map(([tag, products]) => (
                <div
                  key={tag}
                  ref={(el) => {
                    sectionRefs.current[tag] = el;
                  }}
                  data-tag={tag}
                  className="mb-8 "

                >
                  <h2 className="text-xl font-bold mb-4">{tag}</h2>
                  <ul className="flex flex-col gap-4">
                    {products.length > 0 ? (
                      products.map((item) => (
                        <li
                          key={item.id}
                          className="p-4 bg-white rounded-lg shadow-md cursor-pointer"
                        >
                          <Image
                            width={200}
                            height={200}
                            src={item.thumbnail || '/fallback-image.jpg'}
                            alt={item.title}
                            className="w-full h-40 object-cover rounded-md mb-2"
                          />
                          <h3 className="text-lg font-semibold">{item.title}</h3>
                          <p className="text-sm text-gray-600">{item.description}</p>
                          <p className="text-md font-bold">{item.price} تومان</p>
                        </li>
                      ))
                    ) : (
                      <li className="text-center text-gray-600">هیچ محصولی برای {tag} یافت نشد</li>
                    )}
                  </ul>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
  );
};

export default Tablepage;
