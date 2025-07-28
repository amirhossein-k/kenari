
"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { RootState } from "@/store";
import { setProducts } from "@/store/productSlice";
import { setOrderProduct } from "@/store/orderSlice";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";
import { FaChevronLeft, FaRegSquare, FaMinus } from "react-icons/fa6";
import { CiTrash } from "react-icons/ci";
import { Listbox, ListboxItem, Spinner } from "@heroui/react";
import toast from "react-hot-toast";
import { Item2, orderedProduct, PHOTO, POSTTYPE, GetProductByIdResult, POSTTYPERedux } from "@/types/types";
import { getProductById } from "../../../actions/getProductById";

interface Item {
  id: string;
  title: string;
  des?: string;
  counter: number;
  price: number;
}

interface ProductProps {
  product: POSTTYPE;
}

const itemList: { id: number; title: string }[] = [
  { id: 1, title: "text" },
  { id: 2, title: "number" },
  { id: 3, title: "date" },
];

const itemlist2: Item[] = [
  { id: "19", title: "text", des: "loremefeffeeofddewdewdwdwdweofeforfgrogro", counter: 0, price: 5000 },
  { id: "20", title: "text2", counter: 0, price: 5000 },
  { id: "21", title: "text3", des: "loremefeffeedweofeforfgrogro", counter: 0, price: 5000 },
  { id: "22", title: "text4", des: "loremefeffeeofddewdewdwdweforfgrogro", counter: 0, price: 5000 },
  { id: "23", title: "text5", counter: 0, price: 5000 },
  { id: "24", title: "text6", counter: 0, price: 5000 },
  { id: "25", title: "text7", counter: 0, price: 5000 },
  { id: "26", title: "text7.5", counter: 0, price: 5000 },
  { id: "27", title: "text8", counter: 0, price: 5000 },
  { id: "28", title: "text9", counter: 0, price: 5000 },
  { id: "29", title: "text10", counter: 0, price: 5000 },
  { id: "30", title: "text11", counter: 0, price: 5000 },
];

export const ListboxWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
    {children}
  </div>
);

const ClientProductPage = ({ product }: ProductProps) => {
  
  const router = useRouter();
  const dispatch = useDispatch();
  const productorder = useSelector((state: RootState) => state.orderShop.orderProduct);
  const products = useSelector((state: RootState) => state.products.products);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const prevErrorMessage = useRef<string>("");


  // دریافت محصول با useQuery برای هیدراتاسیون
  // دریافت محصول با useQuery برای هیدراتاسیون
 
  // دریافت محصول با useQuery برای هیدراتاسیون
  const {
    data: productResult,
    isLoading,
    isError,
    error,
  } = useQuery<GetProductByIdResult>({
    queryKey: ["product", product.id.toString()],
    queryFn: () => getProductById(product.id.toString()),
    initialData: { success: true, status: 200, message: "", data: product },
    staleTime: 5 * 60 * 1000,
  });

// افزودن محصول به Redux store


  useEffect(() => {
    if (productResult?.data && !products.some((p) => p.id === productResult.data.id)) {
      const reduxProduct: POSTTYPERedux = {
        ...productResult.data,
        createdAt: productResult.data.createdAt instanceof Date
          ? productResult.data.createdAt.toISOString()
          : String(productResult.data.createdAt),
        updatedAt: productResult.data.updatedAt instanceof Date
          ? productResult.data.updatedAt.toISOString()
          : String(productResult.data.updatedAt),
      };
      dispatch(setProducts([...products, reduxProduct]));
    }
  }, [productResult, products, dispatch]);

  // نمایش پیام خطا با toast
  useEffect(() => {
    if (isError && error) {
      const message = error.message || "خطا در دریافت محصول";
      if (message !== prevErrorMessage.current) {
        toast.error(message, { duration: 4000, position: "top-center" });
        prevErrorMessage.current = message;
      }
      setErrorMessage(message);
    } else if (errorMessage !== "") {
      setErrorMessage("");
      prevErrorMessage.current = "";
    }
  }, [isError, error, errorMessage]);

  // انتخاب item1
  const [selectedKeysItem, setSelectedKeysItem] = useState<Set<number>>(new Set([1]));
  const selectedValue = useMemo(() => {
    const selectedId = Array.from(selectedKeysItem)[0];
    return itemList.find((item) => item.id === selectedId);
  }, [selectedKeysItem]);

  // انتخاب item2
  const [selectedKeysItem2, setSelectedKeysItem2] = useState<Item[]>([]);
  const [partTwo, setPartTwo] = useState<boolean>(false);

  const handleSelectionChange2 = (item: Item) => {
    setSelectedKeysItem2((prev) => {
      if (prev.some((selected) => selected.id === item.id)) {
        return prev.map((selected) =>
          selected.id === item.id
            ? { ...selected, title: item.title, des: item.des, counter: selected.counter + 1 }
            : selected
        );
      }
      return [...prev, { ...item, counter: 1 }];
    });
  };

  const handleSelectionChange2Minus = (item: Item) => {
    setSelectedKeysItem2((prev) =>
      prev
        .map((select) =>
          select.id === item.id ? { ...select, counter: select.counter - 1 } : select
        )
        .filter((select) => select.counter > 0)
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setSelectedKeysItem2((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleOpenPart2 = () => {
    setPartTwo(!partTwo);
  };

  const handleBack = () => {
    setPartTwo(false);
  };

  const handleClose = () => {
    router.push("/menu/table");
  };

  const handleOrder = () => {
    if (selectedValue && productResult?.data) {
      const item2: Item2[] = selectedKeysItem2.map((item) => ({
        id: Number(item.id),
        title: item.title,
        price: item.price,
        counter: item.counter,
      }));

      const data: orderedProduct = {
        description: productResult.data.content ?? "",
        id: Number(productResult.data.id),
        price: productResult.data.price,
        title: productResult.data.title,
        userId: 0,
        item1: { id: selectedValue.id, title: selectedValue.title },
        item2,
        countOrder: 1,
      };

      const existingProductIndex = productorder.findIndex((p) => p.id === Number(productResult.data.id));
      let updatedOrder: orderedProduct[];
      if (existingProductIndex !== -1) {
        updatedOrder = [...productorder];
        updatedOrder[existingProductIndex] = {
          ...updatedOrder[existingProductIndex],
          item2: data.item2,
          item1: data.item1,
          countOrder: updatedOrder[existingProductIndex].countOrder + 1,
        };
      } else {
        updatedOrder = [...productorder, data];
      }

      dispatch(setOrderProduct(updatedOrder));
      sessionStorage.setItem("productorder", JSON.stringify(updatedOrder));
      router.push("/menu/table");
    }
  };

  if (isLoading) {
    return (
      <div className="w-full lg:w-[50%] mx-auto p-4 flex flex-col gap-8 relative h-screen" dir="rtl">
        <Spinner classNames={{ label: "text-foreground mt-4" }} label="gradient" variant="gradient" />
      </div>
    );
  }

  if (isError || !productResult?.data) {
    return (
      <div className="w-full lg:w-[50%] mx-auto p-4 flex flex-col gap-8 relative h-screen text-center text-red-600" dir="rtl">
        محصول یافت نشد
      </div>
    );
  }

  const item = productResult.data;

  return (
    <div className="w-full lg:w-[50%] mx-auto p-4 flex flex-col gap-8 relative h-screen" dir="rtl">
      {errorMessage && (
        <div className="bg-red-500 text-white p-4 rounded-md mb-4 text-center">
          {errorMessage}
        </div>
      )}

      {/* nav */}
      <div className="nav flex items-center justify-between">
        <span className="text-3xl bg-green-300 cursor-pointer z-50 p-2" onClick={handleClose}>
          <IoClose />
        </span>
        <div className="titlee text-lg font-bold">جزئیات</div>
        {partTwo ? (
          <button className="" onClick={handleBack}>
            <FaChevronLeft />
          </button>
        ) : (
          <div className=""></div>
        )}
      </div>

      {partTwo ? (
        // item2
        <div className="body h-full p-2 overflow-y-auto scrollbar-hide">
          <div className="titlee">می‌توانید حداکثر 99 آیتم را انتخاب کنید:</div>
          <ul className="flex flex-col gap-4 my-4">
            {itemlist2.length > 0 ? (
              itemlist2.map((item2) => {
                const selectedItem = selectedKeysItem2.find((selected) => selected.id === item2.id);
                return (
                  <li
                    key={item2.id}
                    className={`w-full p-4 rounded-lg flex items-start shadow-box1 ${
                      selectedItem ? "bg-gray-100" : "bg-white"
                    }`}
                  >
                    <div className="flex-1 flex flex-col gap-2">
                      <h3 className="text-lg font-semibold">{item2.title}</h3>
                      {item2.des && (
                        <p className="text-sm text-gray-600 w-full break-words leading-tight">{item2.des}</p>
                      )}
                      <div className="flex items-center gap-3 mt-2">
                        {selectedItem ? (
                          <span className="text-2xl bg-teal-300 p-2 rounded-md cursor-pointer flex items-center gap-2">
                            {selectedItem.counter === 1 ? (
                              <>
                                <FaRegSquare onClick={() => handleSelectionChange2(item2)} />
                                <span>{selectedItem.counter}</span>
                                <CiTrash
                                  onClick={() => handleRemoveItem(item2.id)}
                                  className="cursor-pointer text-red-600"
                                />
                              </>
                            ) : (
                              <>
                                <FaRegSquare onClick={() => handleSelectionChange2(item2)} />
                                <span>{selectedItem.counter}</span>
                                <FaMinus onClick={() => handleSelectionChange2Minus(item2)} />
                              </>
                            )}
                          </span>
                        ) : (
                          <span
                            className="text-md bg-teal-300 p-2 rounded-md cursor-pointer"
                            onClick={() => handleSelectionChange2(item2)}
                          >
                            افزودن
                          </span>
                        )}
                        <p className="text-md font-bold">{item2.price} تومان</p>
                      </div>
                    </div>
                    <Image
                      width={100}
                      height={100}
                      src="https://c589564.parspack.net/c589564//Starbucks.png"
                      alt={item2.title}
                      className="shadow-box4 object-cover h-[95px] w-[100px] rounded-md bg-gray-500"
                    />
                  </li>
                );
              })
            ) : (
              <li className="text-center text-gray-600">هیچ محصولی یافت نشد</li>
            )}
          </ul>
        </div>
      ) : (
        // item1
        <div className="body bg-pink-300 h-full p-2">
          <Image
            width={200}
            height={200}
            src={
              item.productImage.length !== 0
                ? item.productImage.filter((photo: PHOTO) => photo.defaultImage)[0]?.childImage
                : ""
            }
            alt={item.title}
            className="w-full h-64 object-cover rounded-md mb-4"
          />
          <h1 className="text-2xl font-bold mb-4">{item.title}</h1>
          <ListboxWrapper>
            <Listbox
              aria-label="Single selection example"
              selectedKeys={selectedKeysItem}
              selectionMode="single"
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0];
                setSelectedKeysItem(new Set([Number(selected)]));
              }}
            >
              {itemList.map((listItem) => (
                <ListboxItem
                  key={listItem.id}
                  className={`w-full text-xl ${selectedValue?.title === listItem.title ? "bg-red-400" : ""}`}
                  textValue={listItem.title}
                >
                  <div
                    className={`text-lg px-3 py-4 h-full ${
                      selectedValue?.title === listItem.title ? "bg-red-400" : ""
                    }`}
                  >
                    {listItem.title}
                  </div>
                </ListboxItem>
              ))}
            </Listbox>
          </ListboxWrapper>
          <p className="text-small text-default-500">Selected value: {selectedValue?.title}</p>
        </div>
      )}

      <div className="navbot absolute bottom-12 w-full gap-3 right-0 flex bg-gray-300 p-3">
        {partTwo ? (
          <button className="w-[54%] h-full bg-green-300 py-4 rounded-lg" onClick={handleOrder}>
            افزودن به سبد
          </button>
        ) : (
          <button className="w-[54%] h-full bg-green-300 py-4 rounded-lg" onClick={handleOpenPart2}>
            ادامه
          </button>
        )}
        <div className="price w-[40%] flex bg-blue-300 h-full items-center gap-2 flex-col">
          <span>قیمت</span>
          <span>{item.price} تومان</span>
        </div>
      </div>
    </div>
  );
};

export default ClientProductPage;
