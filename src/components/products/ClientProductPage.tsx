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
// import type { Key, Selection } from "@react-types/shared"; // ✅ دقیق و درست
import { FaChevronLeft } from "react-icons/fa6";
import { FaRegPlusSquare } from "react-icons/fa";
import {Spinner} from "@heroui/react";
import { CiTrash } from "react-icons/ci";
import { FaMinus } from "react-icons/fa";
import { Item2, orderedProduct } from "@/types/types";
import {setProductsShopOrder} from '@/store/productSlice'

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  tags: string[];
}

interface Item {
  id: string;
  title: string;
  des?: string;
  counter: number;
    price: number; // ← اضافه شده

}
interface ProductProps {
  product: Product | null;
  errorMessage?: string;
}

const itemList: { id: number; title: string }[] = [
  { id: 1, title: "text" },
  { id: 2, title: "number" },
  { id: 3, title: "date" },
];
const itemlist2: Item[] = [
  {
    id: "19",
    title: "text",
    des: "loremefeffeeofddewdewdwdwdweofeforfgrogro",
    counter: 0,
      price: 5000, 
  },
  { id: "20", title: "text2", counter: 0 , price: 5000,},
  { id: "21", title: "text3", des: "loremefeffeedweofeforfgrogro", counter: 0, price: 5000 },
  {
    id: "22",
    title: "text4",
    des: "loremefeffeeofddewdewdwdweforfgrogro",
    counter: 0, price: 5000
  },
  { id: "23", title: "text5", counter: 0, price: 5000 },
  { id: "24", title: "text6", counter: 0 , price: 5000},
  { id: "25", title: "text7", counter: 0 , price: 5000},
  { id: "26", title: "text7.5", counter: 0, price: 5000 },
  { id: "27", title: "text8", counter: 0, price: 5000 },
  { id: "28", title: "text9", counter: 0 , price: 5000},
  { id: "29", title: "text10", counter: 0, price: 5000 },
  { id: "30", title: "text11", counter: 0, price: 5000 },
];

export const ListboxWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
    {children}
  </div>
);

const ClientProductPage = ({ product, errorMessage }: ProductProps) => {

  const productorder = useSelector((state:RootState)=>state.products.productorder)

  // for first item
  const [selectedKeysItem, setSelectedKeysItem] = useState<Set<number>>(
    new Set([1])
  );

  const selectedValue = useMemo(() => {
    const selectedId = Array.from(selectedKeysItem)[0];
    return itemList.find((item) => item.id === selectedId);
  }, [selectedKeysItem]);

  // for second item
  const [selectedKeysItem2, setSelectedKeysItem2] = useState<Item[]>([]);
  // const selectedValue2 = useMemo(() => {

  //   return (

  //   )
  // }, [selectedKeysItem2]);

  const [partTwo, setPartTwo] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [counterOrderOpen, setCounterOrderOpen] = useState<boolean>(false);

  const dispatch = useDispatch();
  const products = useSelector((state: RootState) => state.products.products);
  const router = useRouter();
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

  // const handleSelectionChange = (keys: Selection) => {
  //   setSelectedKeysItem(keys);
  // };

  const [hydrated, setHydrated] = useState(false);
useEffect(() => {
  setHydrated(true);
}, []);


  const handleSelectionChange2 = (item:Item) => {
    setSelectedKeysItem2((prev) => {
      // اگر آیتم با همان id وجود دارد، counter را افزایش بده
      if (prev.some((selected) => selected.id === item.id)) {
        return prev.map((selected) =>
          selected.id === item.id
            ? { ...selected, title: item.title, des: item.des, counter: selected.counter + 1 }
            : selected
        );
      }
      // اگر آیتم جدید است، آن را با counter=1 اضافه کن
      setCounterOrderOpen(true);
      return [...prev, { ...item, counter: 1 }];
    });
  };


  const handleSelectionChange2Minus = (item: Item) => {
  setSelectedKeysItem2((prev) => {
    return prev
      .map((select) =>
        select.id === item.id
          ? { ...select, counter: select.counter - 1 }
          : select
      )
      .filter((select) => select.counter > 0); // حذف آیتم‌هایی که counter آنها صفر شد
  });
};
const handleRemoveItem = (itemId: string) => {
  setSelectedKeysItem2((prev) => prev.filter((item) => item.id !== itemId));
};
  // رفتن به صفحه دوم برای ادامه انتخاب
  const handleOpenPart2 = () => {
    setPartTwo(!partTwo);
  };

  const handleBack = () => {
    setPartTwo(false);
  };

  // close and to product[id] page
  const handleClose = () => {
    router.push(`/menu/table`);
  };

  // open order counter
  //   const handleOpenCounter = ()=>{
  // setCounterOrderOpen()
  //   }
  const handleOrder = () => {
    if(selectedValue){

        const item2: Item2[] = selectedKeysItem2.map((item) => ({
      id: Number(item.id), // چون typeش عدد هست
      title: item.title,
      price: item.price,
      counter: item.counter,
    }));
      const data:orderedProduct ={
        description:product.description,
        id:product.id,
        price:product.price,
        title:product.title,
        userId:0,
        item1:{id:selectedValue?.id ,title:selectedValue?.title},
        item2
  
      }
          const existingProductIndex = productorder.findIndex(p => p.id === product.id);
              if (existingProductIndex !== -1) {
      const updatedOrder = [...productorder];
      updatedOrder[existingProductIndex] = {
        ...updatedOrder[existingProductIndex],
        item2: data.item2,
        item1:data.item1
      };
      dispatch(setProductsShopOrder(updatedOrder));
              }else{
                // محصول وجود ندارد → به سبد اضافه کن
      dispatch(setProductsShopOrder([...productorder, data]));
              }


      console.log(data,'data')
      router.push('/menu/table')
    }
    console.log(selectedValue, "valu1 item1");
    console.log(selectedKeysItem2, "vaue2 item2");
  };

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
        <span
          className="text-3xl bg-green-300 cursor-pointer z-50 p-2"
          onClick={handleClose}
        >
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
        // {/* item2 */}
        <div className="body  h-full p-2 overflow-y-auto scrollbar-hide">
          <div className="titlee">
            می توانید حداکثر 99 آیتم را انتخاب کنید :
          </div>
          <ul className="flex flex-col gap-4 my-4">
            {itemlist2.length > 0 ? (
              itemlist2.map((item) => {
                const selectedItem = selectedKeysItem2.find((selected) => selected.id === item.id);
                return (
                  <li
                    key={item.id}
                    className={`w-full p-4 rounded-lg flex items-start shadow-box1 ${
                      selectedItem ? "bg-gray-100" : "bg-white"
                    }`}
                  >
                    <div className="flex-1 flex flex-col gap-2">
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      {item.des && (
                        <p className="text-sm text-gray-600 w-full break-words leading-tight">
                          {item.des}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-2">
                        {selectedItem ? (
                          <span
                            className="text-2xl bg-teal-300 p-2 rounded-md cursor-pointer flex items-center gap-2"
                           
                          >
                            {
                              selectedItem.counter===1 ? (
                                <>
             
<FaRegPlusSquare  onClick={() => handleSelectionChange2(item)}/>
<span>{selectedItem.counter}</span>
                   <CiTrash
      onClick={() => handleRemoveItem(item.id)}
      className="cursor-pointer text-red-600"
    />
                                </>
                              ): (
                                <>

<FaRegPlusSquare onClick={() => handleSelectionChange2(item)} />
<span>{selectedItem.counter}</span>
<FaMinus  onClick={() => handleSelectionChange2Minus(item)} />
                                </>
                              )
                            }
                          </span>
                        ) : (
                          <span
                            className="text-md bg-teal-300 p-2 rounded-md cursor-pointer"
                            onClick={() => handleSelectionChange2(item)}
                          >
                            افزودن
                          </span>
                        )}
                        <p className="text-md font-bold">... تومان</p>
                      </div>
                    </div>
                      <Image
                        width={100}
                        height={100}
                        src={"https://c589564.parspack.net/c589564//Starbucks.png"}
                        alt={item.title}
                        className="shadow-box4 object-cover h-[95px] w-[100px] rounded-md bg-gray-500"
                      />
                  </li>
                );
              })
            ) : (
              <li className="text-center text-gray-600">هیچ محصولی برای یافت نشد</li>
            )}

          </ul>
        </div>
      ) : (
        // item1
        <div className="body bg-pink-300 h-full p-2">
          <Image
            width={200}
            height={200}
            src={product.thumbnail || "/fallback-image.jpg"}
            alt={product.title}
            className="w-full h-64 object-cover rounded-md mb-4"
          />
          <h1 className="text-2xl font-bold mb-4">{product.title}</h1>
{
  hydrated ? (

          <ListboxWrapper>
            <Listbox
              aria-label="Single selection example"
              selectedKeys={selectedKeysItem}
              selectionMode="single"
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0];
                setSelectedKeysItem(new Set([Number(selected)])); // حتما به number تبدیل شود
              }}
            >
              {itemList.map((item) => (
                <ListboxItem key={item.id}
                className={`w-full  text-xl ${selectedValue?.title === item.title ? "bg-red-400" : ""}` }
                textValue={item.title}
                
                >
                    <div
                    className={`text-lg px-3 py-4 h-full ${selectedValue?.title === item.title ? "bg-red-400" : ""
                      }`}
                  >
                    {item.title}
                  </div>
                </ListboxItem>
              ))}
            </Listbox>
          </ListboxWrapper>
  ): (
          <Spinner classNames={{label: "text-foreground mt-4"}} label="gradient" variant="gradient" />

  )
}

          <p className="text-small text-default-500">
            Selected value: {selectedValue?.title}
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
        ) : (
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
