// src\app\(public)\menu\table\[id]\page.tsx
'use server'

import ClientProductPage from "@/components/products/ClientProductPage";
import { notFound } from "next/navigation";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  tags: string[];
}

interface PageProps {
  params:{id:string}
    searchParams?: { [key: string]: string | string[] | undefined };

}

async function fetchProduct(id:string):Promise<Product> {
  try {
    const res = await fetch(`https://dummyjson.com/products/${id}`,{
      signal:AbortSignal.timeout(5000)
    })
    if(!res.ok)
      throw new Error('خطا در دریافت محصول');

    const data = await res.json()
    return data
  } catch (error) {
      if (error instanceof Error && error.message.includes('Failed to fetch')) {
      throw new Error('اینترنت وصل نیست');
    }
    throw error;
  }
}

async function ProductPage({ params }: PageProps ) {

  let product:Product| null = null
  let errorMessage = ''
  try{
    product = await fetchProduct(params.id)
  }catch(error){
       errorMessage = error instanceof Error ? error.message : 'خطایی رخ داده است';
  }
  // اگر محصول وجود نداشته باشد، به صفحه 404 هدایت شو
  if (!product) {
    notFound();
  }


  return (
      <ClientProductPage product={product} errorMessage={errorMessage}/>
  )
}

export default ProductPage