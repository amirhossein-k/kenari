
'use client';
import React, { useEffect, useState, useRef } from 'react';
import { TiThMenu } from 'react-icons/ti';
import { FaAngleLeft } from 'react-icons/fa';
import { Skeleton } from '@heroui/skeleton';

// تعریف تایپ برای محصولات
interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  tags: string[];
}

const selector = [
  { id: '1', title: 'beauty', icone: '', active: true },
  { id: '2', title: 'eyeshadow', icone: '', active: false },
  { id: '3', title: 'mascara', icone: '', active: false },
  { id: '4', title: 'face powder', icone: '', active: false },
  { id: '5', title: 'lipstick', icone: '', active: false },
];

// تابع fetch با مدیریت خطا
const fetchProducts = async (setProduct: React.Dispatch<React.SetStateAction<Product[]>>) => {
  try {
    const response = await fetch('https://dummyjson.com/products', {
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    if (!Array.isArray(data.products)) {
      console.error('Data.products is not an array:', data.products);
      setProduct([]);
      return;
    }
    setProduct(data.products);
  } catch (error) {
    console.error('Error fetching products:', error);
    setProduct([]);
  }
};

const Tablepage = () => {
  const [product, setProduct] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeSelector, setActiveSelector] = useState('beauty');
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    fetchProducts(setProduct).then(() => setIsLoaded(true));
  }, []);

  // تنظیم Intersection Observer برای تشخیص تگ فعال
  useEffect(() => {
    const currentRefs = sectionRefs.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const tag = entry.target.getAttribute('data-tag');
            if (tag) {
              setActiveSelector(tag);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    Object.values(currentRefs).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      Object.values(currentRefs).forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [product]);

  // گروه‌بندی محصولات بر اساس تگ‌ها
  const groupedProducts = selector.reduce((acc, item) => {
    acc[item.title] = product.filter((p) =>
      p.tags.includes(item.title)
    );
    return acc;
  }, {} as { [key: string]: Product[] });

  console.log(product, 'p');

  return (
    <div className="w-full h-screen bg-red-300" dir="rtl">
      <div className="container bg-blue-300 mx-auto h-full py-4 overflow-y-auto">
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
        <div className="slector_main px-4">
          <ul className="flex text-lg">
            <li className="border-b-2 border-black px-4 py-2">کافه</li>
            <li className="px-3 py-2">رستوران</li>
          </ul>
        </div>
        {/* selector */}
        <div className="slector my-4 px-2 sticky top-0 bg-blue-300 z-10">
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
          {product.length === 0 ? (
            <ul className="flex flex-col gap-4">
              {Array(6).fill(0).map((_, index) => (
                <li key={index}>
                  <Skeleton isLoaded={isLoaded} className="w-full h-40 rounded-md" />
                  <Skeleton isLoaded={isLoaded} className="w-3/4 h-6 mt-2 rounded-md" />
                  <Skeleton isLoaded={isLoaded} className="w-full h-4 mt-2 rounded-md" />
                  <Skeleton isLoaded={isLoaded} className="w-1/2 h-6 mt-2 rounded-md" />
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
                className="mb-8"
              >
                <h2 className="text-xl font-bold mb-4">{tag}</h2>
                <ul className="flex flex-col gap-4">
                  {products.length > 0 ? (
                    products.map((item) => (
                      <li
                        key={item.id}
                        className="p-4 bg-white rounded-lg shadow-md"
                      >
                        <img
                          src={item.thumbnail}
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
