// app/providers.tsx
'use client';

import {
  //  useContext, useEffect,
  
  useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Head from 'next/head';
// import { MainContext } from '@/context/MainContext';
// import CartDrawer from '@/components/cart/CartDrawer';
// import { UserProvider } from '@/context/UserContext2';
<Head>
  <link rel="stylesheet" href="https://unpkg.com/swiper/css/swiper.min.css" />
  <link rel="stylesheet" href="https://unpkg.com/swiper/css/pagination.css" />
</Head>
import "swiper/css";
import "swiper/css/pagination";
export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
      // const {loading} = useContext(MainContext)

 


  
  return (
    <QueryClientProvider client={queryClient}>
           {/* <UserProvider>  */}
          
           
       {children}

      {/* </UserProvider> */}


    </QueryClientProvider>
  );
}