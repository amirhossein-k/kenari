// app/providers.tsx
"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider, HydrationBoundary,
  DehydratedState,} from "@tanstack/react-query";

import { Provider } from "react-redux";
import { store } from "@/store";
import { PersistGate } from "redux-persist/integration/react"; // وارد کردن PersistGate
import { persistor } from "@/store"; // وارد کردن persistor از store

import "swiper/css";
import "swiper/css/pagination";
import Navbar from "@/components/navbar/Navbar";
export function Providers({ children,  dehydratedState,
 }: { children: React.ReactNode,dehydratedState: DehydratedState; }) {
  // const [queryClient] = useState(() => new QueryClient());
   const [queryClient] = useState(() =>
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000, // ۵ دقیقه
          refetchOnWindowFocus: false, // جلوگیری از refetch
          retry: 1, // کاهش تلاش‌های retry
        },
      },
    })
  );

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
                <PersistGate loading={null} persistor={persistor}>

        <Navbar />
<HydrationBoundary state={dehydratedState}>

        {children}
 </HydrationBoundary>
                </PersistGate>

      </QueryClientProvider>
    </Provider>
  );
}
