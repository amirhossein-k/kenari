"use client";
import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TiThMenu } from "react-icons/ti";
import { FaAngleLeft, FaMinus } from "react-icons/fa";
import { Skeleton } from "@heroui/skeleton";
import Image from "next/image";
import SpinnersNav from "@/features/SpinnerNav";
// import { MainContext } from '@/context/MainContext';
import toast from "react-hot-toast";
import Link from "next/link";
import { RootState, store } from "@/store";
import { setProducts, setLoading } from "@/store/productSlice";
// import {setOrderProduct} from '@/store/orderSlice'
import { useDispatch, useSelector } from "react-redux";
import { setOpenNav } from "@/store/navbarSlice";
import styles from "@/styles/center.module.scss";
import { FaRegPlusSquare } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { CiTrash } from "react-icons/ci";

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
  { id: "14", title: "cafe", icone: "", active: true },
  { id: "42", title: "res", icone: "", active: false },
];

const selector = [
  { id: "1", title: "beauty", icone: "", active: true },
  { id: "2", title: "eyeshadow", icone: "", active: false },
  { id: "3", title: "mascara", icone: "", active: false },
  { id: "4", title: "face powder", icone: "", active: false },
  { id: "5", title: "lipstick", icone: "", active: false },
  { id: "6", title: "res", icone: "", active: false },
];

// تابع fetch برای دریافت محصولات
const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch("https://dummyjson.com/products", {
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) {
      throw new Error("خطا در دریافت محصولات");
    }
    const data = await response.json();
    if (!Array.isArray(data.products)) {
      throw new Error(
        "محصولات نمی‌توانند فرایند مورد نیاز روی آن‌ها صورت گیرند"
      );
    }
    return data.products.map((item: Product) => {
      const isRes = item.tags.some((tag) =>
        ["groceries", "kitchen-accessories"].includes(tag)
      );
      return {
        ...item,
        tags: isRes ? [...item.tags, "res"] : item.tags,
      };
    });
  } catch (error) {
    // بررسی خطای شبکه
    if (error instanceof Error && error.message.includes("Failed to fetch")) {
      throw new Error("اینترنت وصل نیست");
    }
    throw error; // سایر خطاها به همان صورت پرتاب می‌شوند
  }
};


const Tablepage = () => {
  const router = useRouter()
  const dispatch = useDispatch();
  const [activeSelector, setActiveSelector] = React.useState(
    selector[0]?.title || "beauty"
  );
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const prevActiveSelector = useRef(activeSelector);
  // const { setLoading } = useContext(MainContext);
  const [ErrorMessage, setErrorMessage] = useState<string>("");
  const prevErrorMessage = useRef<string>(""); // برای جلوگیری از Toastهای مکرر
  const products = useSelector((state: RootState) => state.products.products);
  const { openNav } = useSelector((state: RootState) => state.navbar);

  // const [] = useState<number>(1)

  const productorder = useSelector(
    (state: RootState) => state.orderShop.orderProduct
  );
  // استفاده از react-query برای دریافت محصولات
  const {
    data: fetchedProducts = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    retry: 2, // تلاش مجدد در صورت خطا
    staleTime: 5 * 60 * 1000, // کش برای 5 دقیقه
  });
  //  // به‌روزرسانی loading و products در Redux store

  useEffect(() => {
    console.log(store.getState(), "vass"); // بررسی وضعیت store

    dispatch(setLoading(isLoading));
    if (!isLoading && fetchedProducts.length > 0) {
      dispatch(setProducts(fetchedProducts));
    }
  }, [isLoading, fetchedProducts, dispatch]);

  // به‌روزرسانی loading در context
  // useEffect(() => {
  //   setLoading(isLoading);
  // }, [isLoading, setLoading]);

  // نمایش پیام خطا با Toast
  // نمایش پیام خطا با Toast و div
  useEffect(() => {
    if (isError && error) {
      const message = error.message || "خطایی رخ داده است";
      if (message !== prevErrorMessage.current) {
        toast(message, { duration: 4000, position: "top-center" });
        prevErrorMessage.current = message;
      }
      setErrorMessage(message);
    } else if (ErrorMessage !== "") {
      setErrorMessage("");
      prevErrorMessage.current = "";
    }
  }, [isError, error, ErrorMessage]);

  const [closePopover, setClosePopover] = useState<boolean>(false);
  const handlePopverClose = () => {
    setClosePopover(false);
  };

  // به‌روزرسانی prevActiveSelector
  useEffect(() => {
    prevActiveSelector.current = activeSelector;
  }, [activeSelector]);

  // تنظیم Intersection Observer برای تشخیص تگ فعال
  useEffect(() => {
    const currentRefs = sectionRefs.current;
    if (Object.keys(currentRefs).length === 0) {
      console.warn("No section refs available to observe");
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length === 0) return;
        const mostVisible = visibleEntries.reduce(
          (prev, curr) =>
            curr.intersectionRatio > prev.intersectionRatio ? curr : prev,
          visibleEntries[0]
        );
        if (mostVisible) {
          const tag = mostVisible.target.getAttribute("data-tag");
          if (process.env.NODE_ENV !== "production") {
            console.log(
              "Most visible tag:",
              tag,
              "Ratio:",
              mostVisible.intersectionRatio,
              "Element:",
              mostVisible.target
            );
          }
          if (
            tag &&
            selector.some((item) => item.title === tag) &&
            tag !== prevActiveSelector.current
          ) {
            setActiveSelector(tag);
          } else if (process.env.NODE_ENV !== "production") {
            console.warn("Invalid or same tag:", tag);
          }
        }
      },
      { threshold: 0.5, rootMargin: "0px 0px -50px 0px" }
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
    const filtered = products.filter(
      (p: { tags: string | string[] }) => p.tags?.includes(item.title) ?? false
    );
    if (filtered.length > 0) {
      acc[item.title] = filtered;
      if (process.env.NODE_ENV !== "production") {
        console.log(`Group ${item.title}:`, filtered.length, "products");
      }
    }
    return acc;
  }, {} as { [key: string]: Product[] });

  const navOPEN = () => {
    dispatch(setOpenNav(!openNav));
  };


  const handleSelectionChange2 = (item: orderedProduct) => {
    const updatedOrder = productorder.map((order) =>
      order.id === item.id
        ? { ...order, countOrder: (order.countOrder || 0) + 1 }
        : order
    );
    dispatch(setOrderProduct(updatedOrder));

    console.log(updatedOrder, "update");
  };

  const handleSelectionChange2Minus = (item: orderedProduct) => {
    const updatedOrder = productorder.map((order) =>
      order.id === item.id
        ? { ...order, countOrder: (order.countOrder || 0) - 1 }
        : order
    );
    dispatch(setOrderProduct(updatedOrder));

 

  };

  const handleRemoveItem = (itemId: number) => {
    console.log(itemId, "itemId");
const updatedOrder = productorder.filter((order) => order.id !== itemId);
  dispatch(setOrderProduct(updatedOrder));
    // setSelectedKeysItem2((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleFinish = ()=>{
    router.push('/register')
  }

  return (
    <div className="w-full h-screen lg:w-[50%] mx-auto px-3" dir="rtl">
      <SpinnersNav />
      <div
        className={` ${styles.container} mx-auto h-full py-4 overflow-y-auto relative`}
      >
        {ErrorMessage && (
          <div className=" text-white p-4 rounded-md mb-4 mx-4 text-center">
            {ErrorMessage}
          </div>
        )}

        {/* nav */}
        <div className="nav flex justify-between items-center py-4 px-3">
          <div className="text-2xl lg:text-4xl md:text-3xl">
            <button className="" onClick={navOPEN}>
              <TiThMenu />
            </button>
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
                  activeSelector === "res" && item.title === "res"
                    ? "border-b-2 border-black"
                    : activeSelector !== "res" && item.title === "cafe"
                    ? "border-b-2 border-black"
                    : ""
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
                  activeSelector === item.title
                    ? "bg-black text-white shadow-md"
                    : "bg-gray-200"
                }`}
                key={item.id}
                onClick={() => {
                  const section = sectionRefs.current[item.title];
                  if (section) {
                    section.scrollIntoView({ behavior: "smooth" });
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
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <li key={index}>
                    <Skeleton
                      isLoaded={false}
                      className="w-full h-40 rounded-md"
                    />
                    <Skeleton
                      isLoaded={false}
                      className="w-3/4 h-6 mt-2 rounded-md"
                    />
                    <Skeleton
                      isLoaded={false}
                      className="w-full h-4 mt-2 rounded-md"
                    />
                    <Skeleton
                      isLoaded={false}
                      className="w-1/2 h-6 mt-2 rounded-md"
                    />
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
                {/* <h2 className="text-xl font-bold mb-4">{tag}</h2> */}
                <ul className="flex flex-col gap-4 ">
                  {products.length > 0 ? (
                    products.map((item) => (
                      <li
                        key={item.id}
                        className="p-4 bg-white rounded-lg h-full  cursor-pointer shadow-box1"
                      >
                        <Link
                          href={`/menu/table/${item.id}`}
                          className="w-full h-fit flex "
                          dir="rtl"
                        >
                          <div className="flex flex-col gap-2 justify-evenly ">
                            <h3 className="text-lg font-semibold flex-1">
                              {item.title}
                            </h3>
                            <p className="text-sm text-gray-600 flex-1">
                              {item.description}
                            </p>
                            <div className="flex-1  flex justify-start items-center gap-5 px-4">
                              <span className="text-3xl bg-teal-300 overflow-hidden rounded-md">
                                <FaRegPlusSquare />
                              </span>
                              <p className="text-md font-bold  ">
                                {item.price} تومان
                              </p>
                            </div>
                          </div>
                          <Image
                            width={200}
                            height={200}
                            src={item.thumbnail || "/fallback-image.jpg"}
                            alt={item.title}
                            className="w-full  flex-1 shadow-box4 h-[145px] object-cover  rounded-md mb-2 bg-gray-500"
                          />
                        </Link>
                      </li>
                    ))
                  ) : (
                    <li className="text-center text-gray-600">
                      هیچ محصولی برای {tag} یافت نشد
                    </li>
                  )}
                </ul>
              </div>
            ))
          )}
        </div>
        {productorder && productorder.length > 0 && (
          <div className="navbot sticky bottom-12 w-full gap-3 right-0 flex bg-gray-300 p-3">
            <div className="flex  w-[95%] mx-auto relative m-0 p-0">
              <span className="absolute top-[10px] cursor-default -right-3 rounded-md bg-red-300 px-2 py-1 z-30 ">
                {productorder.length}
              </span>

              <Popover
                key={"blur"}
                showArrow={false}
                isOpen={closePopover}
                onOpenChange={(open) => setClosePopover(open)}
                backdrop="blur"
                offset={-50}
                containerPadding={0}
                placement="bottom"
                className="z-[1000] m-0 p-0"
              >
                <PopoverTrigger className="">
                  <Button
                    className="capitalize  w-full bg-sky-500 "
                    size="lg"
                    variant="flat"
                    style={{ width: "100%" }}
                    onClick={() => setClosePopover(true)}
                  >
                    تکمیل سبد خرید
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-screen  max-w-none overflow-x-hidden m-0 p-0">
                  {(titleProps) => (
                    <div className="m-0 p-2 w-full ">
                      <span
                        className="absolute top-0 right-2 p-2  bg-pink-400 cursor-pointer"
                        onClick={handlePopverClose}
                      >
                        {" "}
                        <MdClose />
                      </span>
                      <p
                        className="text-small font-bold text-foreground flex gap-2 justify-center items-center"
                        {...titleProps}
                      >
                        سبد خرید
                        <FaShoppingCart />
                      </p>
                      <div
                        className="mt-2 p-2 flex flex-col gap-2 w-full bg-red-300"
                        dir="rtl"
                      >
                        {productorder.map((order) => (
                          <div className="w-full px-3" key={order.id}>
                            <div className="titlee text-xl ">{order.title}</div>
                            <div className=" bg-green-200 flex justify-between">
                              {/*  */}
                              <div className="riht bg-gray-500 flex-1">
                                <div className="subtitle text-lg px-4 ">
                                  {" "}
                                  {order.item1.title}
                                </div>
                                <ul className="px-7 text-lg">
                                  {order.item2.map((it) => (
                                    <li
                                      key={it.id}
                                      className="flex items-center gap-3 bg-blue-300"
                                    >
                                      <span>{it.title}</span>
                                      <span className="flex  items-center p-1">
                                        <MdClose />
                                        {it.counter}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                                <div className="price my-2 flex gap-4 text-medium bg-pink-500">
                                  <span>500 تومان</span>
                                  {/*  */}
                                  {productorder ? (
                                    <span className="text-2xl bg-teal-300 p-2 rounded-md cursor-pointer flex items-center gap-2">
                                      {order.countOrder === 1 ? (
                                        <>
                                          <FaRegPlusSquare
                                            onClick={() =>
                                              handleSelectionChange2(order)
                                            }
                                          />
                                            <span>{order.countOrder}    </span>

                                          <CiTrash
                                            onClick={() =>
                                              handleRemoveItem(order.id)
                                            }
                                            className="cursor-pointer text-red-600"
                                          />
                                        </>
                                      ) : (
                                        <>
                                          <FaRegPlusSquare
                                            onClick={() =>
                                              handleSelectionChange2(order)
                                            }
                                          />
                                            <span>{order.countOrder}    </span>
                                          <FaMinus
                                            onClick={() =>
                                              handleSelectionChange2Minus(order)
                                            }
                                          />
                                        </>
                                      )}
                                    </span>
                                  ) : (
                                    <span
                                      className="text-md bg-teal-300 p-2 rounded-md cursor-pointer"
                                      onClick={() =>
                                        handleSelectionChange2(order)
                                      }
                                    >
                                      افزودن
                                    </span>
                                  )}
                                  {/*  */}
                                </div>
                              </div>
                              {/*  */}
                              <div className="left bg-pink-500 relative w-[120px]  h-[100px] overflow-hidden  rounded-md">
                                <Image
                                  // width={100}
                                  // height={100}
                                  fill
                                  src={
                                    "https://c589564.parspack.net/c589564//Starbucks.png"
                                  }
                                  alt={order.title}
                                  className="w-[120px] flex-1 shadow-box4 absolute  h-full object-cover overflow-hidden  rounded-md mb-2 bg-gray-500"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                        <div className="bottom flex justify-between p-2 gap-1 mx-3">
                          <button className="bg-blue-200 w-[20%] rounded-md py-4 text-medium" onClick={handleFinish}>
                            ثبت سفارش
                          </button>
                          <div className="w-[50%] text-center py-3 flex flex-col text-medium">
                            <span>قیمت کل</span>
                            450 تومان
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tablepage;

import { Popover, PopoverTrigger, PopoverContent, Button } from "@heroui/react";
import { orderedProduct } from "@/types/types";
import { setOrderProduct } from "@/store/orderSlice";import { useRouter } from "next/navigation";

