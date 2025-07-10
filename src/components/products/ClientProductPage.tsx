// src\components\products\ClientProductPage.tsx
"use client";
import { RootState } from "@/store";
import { setProducts } from "@/store/productSlice";
import Image from "next/image";
import { notFound, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";
import { Listbox, ListboxItem } from "@heroui/react";
import type { Key, Selection } from "@react-types/shared"; // ✅ دقیق و درست
import { FaChevronLeft } from "react-icons/fa6";
import { orderedProduct } from "@/types/types";
import Link from "next/link";
import { FaRegPlusSquare } from "react-icons/fa";

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
const itemlist2 = [
  {  id: "19",title: "text",des:'loremefeffeeofddewdewdwdwdweofeforfgrogro'},{  id: "20",title: "text2"},{  id: "21",title: "text3",des:'loremefeffeedweofeforfgrogro'},{  id: "22",title: "text4",des:'loremefeffeeofddewdewdwdweforfgrogro'},{  id: "23",title: "text5"},{  id: "24",title: "text6"},{  id: "25",title: "text7"},{  id: "26",title: "text7.5"},
  {  id: "27",title: "text8"},{  id: "28",title: "text9"},{  id: "29",title: "text10"},{  id: "30",title: "text11"},
]

export const ListboxWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
    {children}
  </div>
);

const ClientProductPage = ({ product, errorMessage }: ProductProps) => {
  // for first item
  const [selectedKeysItem2, setSelectedKeysItem2] = useState<Selection>(
    new Set<Key>(["text"])
  );
  

  const selectedValue2 = useMemo(() => {
    if (selectedKeysItem2 === "all") return null;
    
    const seleceteId = Array.from(selectedKeysItem2)[0]
    return itemList.find(item=>item.id === seleceteId)
    // return Array.from(selectedKeysItem2).join(", ");
  }, [selectedKeysItem2]);
  // for second item
  const [selectedKeysItem, setSelectedKeysItem] = useState<Selection>(
    new Set<Key>(["text"])
  );
  const selectedValue = useMemo(() => {
    if (selectedKeysItem === "all") return null;
 
    return Array.from(selectedKeysItem).join(", ");
  }, [selectedKeysItem]);


  const [partTwo, setPartTwo] = useState<boolean>(false);

  const dispatch = useDispatch();
  const products = useSelector((state: RootState) => state.products.products);
const router =useRouter()
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
    setSelectedKeysItem(keys);
  };
  const handleSelectionChange2 = (keys: Selection) => {
    setSelectedKeysItem2(keys);
  };
// رفتن به صفحه دوم برای ادامه انتخاب
  const handleOpenPart2 = () => {
    setPartTwo(!partTwo);
  };

  const handleBack = () => {
    setPartTwo(false);
  };

  // close and to product[id] page
  const handleClose = ()=>{
    router.push(`/menu/table`)
  }

  const handleOrder = ()=>{
    // const data:orderedProduct ={
    //   description:product.description,
    //   id:product.id,
    //   price:product.price,
    //   title:product.title,
    //   userId:0,
    //   item1:[
        
    //   ]

    // } 
    console.log(selectedValue,'valu1')
    console.log(selectedValue2,'valu2')
  }

  return (
    <div
      className="w-full bb lg:w-[50%] mx-auto p-4 flex flex-col gap-8 relative h-screen"
      dir="rtl"
    >
      {errorMessage && (
        <div className="bg-red-500 text-white p-4 rounded-md mb-4 text-center">
          {errorMessage}
        </div>
      )}

      <div className="nav flex items-center justify-between">
        <span className="text-3xl bg-green-300 cursor-pointer z-50 p-2" onClick={handleClose} >
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
  <div className="body  h-full p-2 overflow-y-auto scrollbar-hide">
          <div className="titlee">می توانید حداکثر 99 آیتم را انتخاب کنید :</div>
          
     <ul className="flex flex-col gap-4 my-4">
                    {itemlist2.length > 0 ? (
                      itemlist2.map((item) => (
                        <li
                          key={item.id}
                          className="p-4 rounded-lg h-[140px]  cursor-pointer shadow-box1"
                        >
                          <Link href={`/menu/table/${item.id}`} className='w-full h-full flex justify-between  ' dir='rtl'>
                          
                        <div className="flex flex-col gap-2 justify-evenly w-[70%] ">
                            <h3 className="text-lg font-semibold flex-1">{item.title}</h3>
                            
                        {item.des && (

                          <p className="text-sm text-gray-600 flex-1 break-words leading-tight">{item.des}</p>
                        )}

                          <div className="flex-1  flex justify-start items-center gap-5 px-4">
                            <span className='text-3xl bg-teal-300 overflow-hidden rounded-md'><FaRegPlusSquare /></span>
                          <p className="text-md font-bold  "> تومان</p>
                          </div>
                        </div>
                          <Image
                            width={200}
                            height={200}
                            src={  "https://c589564.parspack.net/c589564//Starbucks.png" }
                            alt={item.title}
                            className="w-[30%]  h-[110px] shadow-box4 object-cover  rounded-md mb-2 bg-gray-500"
                          />
                          </Link>
                        </li>
                      ))
                    ) : (
                      <li className="text-center text-gray-600">هیچ محصولی برای  یافت نشد</li>
                    )}
                  </ul>
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
              selectedKeys={selectedValue2?.title}
              selectionMode="single"
              variant="flat"
              onSelectionChange={handleSelectionChange2}
              className=" "
            >
              {itemList.map((item) => (
                <ListboxItem
                  key={item.id}
                  className={`w-full  text-xl ${
                    selectedValue2?.title === item.title ? "bg-red-400" : ""
                  }`}
                >
                  <div
                    className={`text-lg px-3 py-4 h-full ${
                      selectedValue2?.title === item.title ? "bg-red-400" : ""
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
       {partTwo ? (
         <button
          className="w-[54%] h-full bg-green-300 py-4 rounded-lg"
          onClick={handleOrder}
        >
          افزودن به سبد 
        </button>
       ): (
         <button
          className="w-[54%] h-full bg-green-300 py-4 rounded-lg"
          onClick={handleOpenPart2}
        >
          ادامه
        </button>
       )}
        <div className="price w-[40%] flex  bg-blue-300 h-full items-center gap-2 flex-col">
          <span>قیمت</span>
          <span>{product.price}</span>
        </div>
      </div>
    </div>
  );
};

export default ClientProductPage;
