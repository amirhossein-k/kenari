// src/lib/StoreInitializer.tsx
"use client";

import { useEffect } from "react";
import { POSTTYPERedux } from "@/types/types";
import { useDispatch } from "react-redux";
import { setProducts } from "@/store/productSlice";

interface Props {
  products: POSTTYPERedux[];
}

const StoreInitializer = ({ products }: Props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setProducts(products));
  }, [dispatch, products]);

  return null;
};

export default StoreInitializer;
