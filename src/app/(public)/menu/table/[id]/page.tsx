// app/menu/table/[id]/page.tsx

import { notFound } from "next/navigation";
import { PHOTO } from "@/types/types";
import { Metadata } from "next";
import ClientProductPage from "@/components/products/ClientProductPage";
import { getProductById } from "../../../../../../actions/getProductById";


// تعریف نوع دقیق برای params
// تعریف نوع دقیق برای params
interface Props {
  params: Promise<{ id: string }>; // فقط Promise پذیرفته می‌شود
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params; // استخراج id

  console.log(id, 'idddd in generateMetadata'); // چاپ id برای دیباگ
const product = await getProductById(id);
  if (!product) return {};
   const defaultImage = product.data?.productImage && product.data.productImage.length > 0
    ? product.data.productImage.filter((item: PHOTO) => item.defaultImage === true)[0]?.childImage
    : ""; // اگر هیچ تصویری موجود نبود، یک رشته خالی برمی‌گرداند
  return {
    title: product.data?.title,
    description: product.data?.content?.slice(20),
    openGraph: {
         images: [defaultImage], // اضافه کردن تصویر پیش‌فرض
    },
  };
}

// async function getProduct(id: string): Promise<Product | null> {
//   try {
//     const res = await fetch(`https://dummyjson.com/products/${id}`, { cache: "no-store" });
//     if (!res.ok) return null;
//     return await res.json();
//   } catch {
//     return null;
//   }
// }

export default async function ProductPage({ params }: Props) {

  const { id } = await params; // استخراج id

  console.log(id, 'idddd in ProductPage'); // چاپ id برای دیباگ
  const productRes = await getProductById(id);
  // if (!product) return notFound();
  // if (!product?.data) return notFound();
if (!productRes.success || !productRes.data) return notFound();

  return (
     <ClientProductPage product={productRes.data} />

  );
}
