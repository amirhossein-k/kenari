"use client";

import { RootState } from "@/store";
import {  useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import useWindowSize from "../../../hooks/size";
import { setOpenNav } from "@/store/navbarSlice";
import { IoClose } from "react-icons/io5";
import Image from "next/image";
import { Accordion, AccordionItem } from "@heroui/react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { width } = useWindowSize();
  const [metr] = useState(768);
  const [mobile, setMobile] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (width) {
      setMobile(width <= metr);
    }
  }, [width, metr]);

  const { openNav } = useSelector((state: RootState) => state.navnar);
  useEffect(() => {
    toast(`${openNav === true ? "باز شد" : "بسته شد"}`, {
      duration: 4000,
      position: "top-center",
    });
  }, [openNav]);
  const navOPEN = () => {
    dispatch(setOpenNav(!openNav));
  };

  const navigate = (path:string)=>{
    
      router.push(path)
 
  }
  return (
    <div
      className={`${
        openNav ? "block" : "hidden"
      } w-full  absolute top-0 right-0 h-full  z-50 `}
      dir="rtl"
    >
      <div
        style={mobile ? { width: "100%" } : { width: `${metr - 300}px` }}
        className={` bg-blue-300 h-full z-50 p-4`}
      >
        <button
          onClick={navOPEN}
          className=" text-2xl rounded-md m-3 bg-gray-200 p-3"
        >
          <IoClose />
        </button>
        <div className="top">
          {/*  */}
          <div className="title flex gap-4  items-center my-4 mx-8">
            <Image
              className="rounded-lg"
              width={80}
              height={80}
              quality={100}
              src={
                "https://c589564.parspack.net/c589564//Starbucks.png"
              }
              alt=""
            />
            <h2 className="text-2xl">کافه کناری</h2>
          </div>
          {/*  */}
          <div className="des flex flex-col gap-4   my-4 mx-8 ">
            <span>اسکن کنید، سفارش دهید و لذت ببرید</span>
            <span>
              برای تجربه سریعترین سفارش و دسترسی به حساب خود وارد شوید.
            </span>
          </div>
        </div>
        <div className="bottom">
          <ul className="flex flex-col gap-4">
            <li>
              <Accordion variant="splitted" className="">
                <AccordionItem
                  key="1"
                  aria-label=" حریم خصوصی"
                  style={{ fontSize: "25px" }}
                  title=" حریم خصوصی"
                  onPress={()=>navigate('/privacyPolicy')}
                ></AccordionItem>
              </Accordion>
            </li>
            <li>
                <Accordion variant="splitted" className="">
                <AccordionItem
                  key="1"
                  aria-label=" شرایط "
                  style={{ fontSize: "25px" }}
                  title="  شرایط"
                ></AccordionItem>
              </Accordion>
            </li>
            <li>
               <Accordion variant="splitted" className="">
                <AccordionItem
                  key="1"
                  aria-label=" ثبت شکایت "
                  style={{ fontSize: "25px" }}
                  title="  ثبت شکایت"
                ></AccordionItem>
              </Accordion>
               </li>
            <li>
              <Accordion variant="splitted" className="">
                <AccordionItem
                  key="1"
                  aria-label="   درباره ما"
                  style={{ fontSize: "25px" }}
                  title="   درباره ما"
                  onPress={()=>navigate('/about')}
                ></AccordionItem>
              </Accordion>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
