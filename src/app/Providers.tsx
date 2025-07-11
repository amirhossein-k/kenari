// app/providers.tsx
"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "@/store";
import { PersistGate } from "redux-persist/integration/react"; // وارد کردن PersistGate
import { persistor } from "@/store"; // وارد کردن persistor از store

import "swiper/css";
import "swiper/css/pagination";
import Navbar from "@/components/navbar/Navbar";
export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
                <PersistGate loading={null} persistor={persistor}>

        <Navbar />
        {children}
                </PersistGate>

      </QueryClientProvider>
    </Provider>
  );
}
