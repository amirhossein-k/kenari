"use client";
import { RootState } from "@/store";
import { setProducts } from "@/store/productSlice";
import Image from "next/image";
import { notFound } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";
import { Listbox, ListboxItem } from "@heroui/react";
import type { Key, Selection } from "@react-types/shared"; // ✅ دقیق و درست
import { FaChevronLeft } from "react-icons/fa6";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  tags: string[];
}

interface ProductProps {
  product: Product | null;
  errorMessage?: string;
}

const itemList = [
  {
    id: "1",
    title: "text",
  },
  {
    id: "2",
    title: "number",
  },
  {
    id: "3",
    title: "date",
  },
];

export const ListboxWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
    {children}
  </div>
);

const ClientProductPage = ({ product, errorMessage }: ProductProps) => {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(
    new Set<Key>(["text"])
  );

  const selectedValue = useMemo(() => {
    if (selectedKeys === "all") return "همه";
    return Array.from(selectedKeys).join(", ");
  }, [selectedKeys]);

  const [partTwo, setPartTwo] = useState<boolean>(false);

  const dispatch = useDispatch();
  const products = useSelector((state: RootState) => state.products.products);

  useEffect(() => {
    if (product && !products.some((p) => p.id === product.id)) {
      dispatch(setProducts([...products, product]));
    }
  }, [product, products, dispatch]);

  useEffect(() => {
    if (errorMessage) {
      toast(errorMessage, { duration: 4000, position: "top-center" });
    }
  }, [errorMessage]);

  if (!product) {
    notFound();
  }

  const handleSelectionChange = (keys: Selection) => {
    setSelectedKeys(keys);
  };

  const handleOpenPart2 = () => {
    setPartTwo(!partTwo);
  };

  const handleBack = () => {
    setPartTwo(false);
  };

  return (
    <div
      className="w-full lg:w-[50%] mx-auto p-4 flex flex-col gap-8 bg-red-300 relative h-screen"
      dir="rtl"
    >
      {errorMessage && (
        <div className="bg-red-500 text-white p-4 rounded-md mb-4 text-center">
          {errorMessage}
        </div>
      )}

      <div className="nav flex items-center justify-between">
        <span className="text-3xl">
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
        <div className="">
          <div className="title">می توانید حداکثر 99 آیتم را انتخاب کنید :</div>
          
        </div>
      ) : (
        <div className="body bg-pink-300 h-full p-2">
          <Image
            width={200}
            height={200}
            src={product.thumbnail || "/fallback-image.jpg"}
            alt={product.title}
            className="w-full h-64 object-cover rounded-md mb-4"
          />
          <h1 className="text-2xl font-bold mb-4">{product.title}</h1>

          <ListboxWrapper>
            <Listbox
              disallowEmptySelection
              aria-label="Single selection example"
              selectedKeys={selectedKeys}
              selectionMode="single"
              variant="flat"
              onSelectionChange={handleSelectionChange}
              className=" "
            >
              {itemList.map((item) => (
                <ListboxItem
                  key={item.title}
                  className={`w-full  text-xl ${
                    selectedValue === item.title ? "bg-red-400" : ""
                  }`}
                >
                  <div
                    className={`text-lg px-3 py-4 h-full ${
                      selectedValue === item.title ? "bg-red-400" : ""
                    }`}
                  >
                    {item.title}
                  </div>
                </ListboxItem>
              ))}
            </Listbox>
          </ListboxWrapper>

          <p className="text-small text-default-500">
            Selected value: {selectedValue}
          </p>
        </div>
      )}

      <div className="navbot absolute bottom-12 w-full gap-3 right-0 flex bg-gray-300 p-3">
        <button
          className="w-[54%] h-full bg-green-300 py-4 rounded-lg"
          onClick={handleOpenPart2}
        >
          ادامه
        </button>
        <div className="price w-[40%] flex  bg-blue-300 h-full items-center gap-2 flex-col">
          <span>قیمت</span>
          <span>{product.price}</span>
        </div>
      </div>
    </div>
  );
};

export default ClientProductPage;
