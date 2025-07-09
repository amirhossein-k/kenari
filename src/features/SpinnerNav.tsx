// src\features\SpinnerNav.tsx
  'use client';
import { RootState } from '@/store';
  import { Spinner } from '@heroui/react';
import { useSelector } from 'react-redux';

  const SpinnersNav = () => {
    const  { loading} = useSelector((state:RootState)=>state.products)

    return (
      <div
        className={`loading ${loading ? 'block' : 'hidden'} fixed gap-4 text-center rounded-lg z-50 w-[300px] h-[50px] flex justify-center items-center top-2 right-2 bg-gray-400`}
        dir="rtl"
      >
        <Spinner classNames={{ label: 'text-foreground mt-4' }} variant="wave" />
        <span>لطفا کمی صبر کنید</span>
      </div>
    );
  };

  export default SpinnersNav;
