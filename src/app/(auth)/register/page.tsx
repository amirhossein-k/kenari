// src\app\(auth)\register\page.tsx
"use client";

import { useState } from "react";
import { signUp } from "@/../actions/signup";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { userType } from "@/types/types";

export default function RegisterPage() {
  const [errorMessage, setErrorMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [code, setCode] = useState<string>();
  const [continuee, setContinuee] = useState<boolean>();
const [phone, setPhone] = useState<string>("");
const [name, setName] = useState<string>("");

  const router = useRouter();

  // valid phoneNumber
  const validPhone = (phone: string) => {
    const phoneReg = /^(\+98|0)?9\d{9}$/;
    return phoneReg.test(phone);
  };

  const signhUpMutaton  = useMutation({
    mutationFn:()=>signUp(phone,name),
    onMutate:()=>setPending(true),
    onSuccess: async (data)=>{
      if(data.data&& data.success){
        console.log(data.data.user.code,'signup register code')
        setCode(data.data.user.code)
        toast.success('کد با موفقیت ارسال شد.')
        setContinuee(true)
      }else{
        toast.error(data.error || 'خطا در ارسال کد ')
        setErrorMessage(data.error || 'خطا در ارسال کد ' )
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "خطا در ثبت‌نام");
      setErrorMessage(error.message);
    },
    onSettled:()=>{
      setPending(false)
    }
  })

  const verifyCode = async({code}:{code:string,phone:string})=>{

    const res = await fetch('/api/auth/verify',{
      method:"POST",
      headers:{
         "Content-Type": "application/json",
      },
      body:JSON.stringify({code,phone})
    })

    const data = await res.json()
    if(!res.ok){
      throw new Error(data.error || 'ورود ناموفق')
    }
    return data

  }


  const verifyMutation = useMutation({
    mutationFn:  verifyCode,
    onSuccess:  (data:{user:userType}) => {
      toast.success(`خوش اومدی ${data.user.name}`)
      if(data.user.admin===true){
        router.push('/profile/admin')
      }else{
        router.replace('profile/cart')
      }
    },
    onError: (error: Error) => {
      toast.error(error.message);
      setErrorMessage(error.message || "خطا در ورود");
    },
    onSettled: () => {
      setPending(false);
    },
  });

  async function handleSubmitt(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true)
    const formData = new FormData(e.currentTarget);
      const nameInput = formData.get("name") as string;
    const phone_numer = formData.get("phone") as string;

    if (!phone_numer) {
      setErrorMessage("شماره تلفن الزامیه کاربر محترم");
      setPending(false);
      return;
    }
    if (!validPhone(phone_numer)) {
      setErrorMessage("شماره یییای که وارد کردی به فرمتی که ذکر شده فرق دارد");
      setPending(false);
      return;
    }

setPhone(phone_numer)
  setName(nameInput);

signhUpMutaton.mutate()
}

  const handleOK = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const userCode = formData.get("code") as string;
    console.log(userCode, "userCode");


    if (userCode === code) {
      toast.success("کد تأیید شد. در حال ورود...");

  setPending(true)
      verifyMutation.mutate({code:userCode,phone})
     

    } else {
      toast.error("کد وارد شده صحیح نیست!");
    }
  };

  return (
    <div className="w-full h-screen lg:w-[50%] mx-auto px-3" dir="rtl">
      <h1 className="text-center text-xl shadow-md my-2 py-2 ">
        فرم ثبت نام
      </h1>
      {errorMessage && <div className="mb-4 text-red-500">{errorMessage}</div>}
      {continuee ? (
        <div className="">
          <form onSubmit={handleOK} className="space-y-4 text-black">
            <div className="mb-4 p-2 flex flex-col gap-4">
              <span>کد ارسال شده را وارد کنید</span>

              <input
                type="tel"
                name="code"
                id="code"
                required
                placeholder="09xxxxxxxxx or +989xxxxxxxxx"
                className="border-2 p-2 w-full"
              />
            </div>

            <button
              className="text-white font-bold text-lg border rounded-lg px-2 py-2 inline w-full bg-blue-500"
              disabled={pending}
              type="submit"
            >
              {pending ? "منتظر باشید" : "ورود"}
            </button>
          </form>
        </div>
      ) : (
        <form onSubmit={handleSubmitt} className="space-y-4 text-black">
          <div className="mb-4 p-2 flex flex-col gap-4">
            <span>
              لطفا شماره موبایل خود را وارد کنید تا وارد حساب کاربری خود شوید .
            </span>
            <label htmlFor="phone" className="block mb-1 ">
              شماره موبایل:
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              required
              placeholder="09xxxxxxxxx or +989xxxxxxxxx"
              className="border-2 p-2 w-full"
            />
          </div>
           <div className="mb-4 p-2 flex flex-col gap-4">
            {/* <span>لطفا نام خود را بنویسید            </span> */}
            <label htmlFor="name" className="block mb-1 ">
              نام و نام خوانوادگی
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              placeholder="نام"
              className="border-2 p-2 w-full"
            />
          </div>

          <button
            className="text-white font-bold text-lg border rounded-lg px-2 py-2 inline w-full bg-blue-500"
            disabled={pending}
            type="submit"
          >
            {pending ? "منتظر باشید" : "ادامه"}
          </button>
        </form>
      )}
    </div>
  );
}
