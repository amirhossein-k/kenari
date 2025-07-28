import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
// import { ReactNode } from "react";
import { getProductById } from "../../../../../../actions/getProductById";
import { Providers } from "@/app/Providers";

// تعریف نوع دقیق برای params
interface Props {
  params: Promise<{ id: string }> | { id: string }; // پشتیبانی از هر دو حالت Promise و شیء ساده
  children: React.ReactNode;
}
export default async function Layout({ params, children }: Props) {
// اگر params به‌صورت Promise است، آن را await کنید
  const resolvedParams = await Promise.resolve(params);
  const id = resolvedParams.id; // استخراج id
  console.log(id, 'idddd'); // چاپ id برای دیباگ


  
    const queryClient = new QueryClient()

    const productResult = await getProductById(id)

    if(productResult.success && productResult.data){
        await queryClient.prefetchQuery({
            queryKey:['product',id],
            queryFn:async ()=> productResult
        })


        
    }

    const dehydratedState = dehydrate(queryClient)

    return(
        <Providers dehydratedState={dehydratedState}>
            <HydrationBoundary state={dehydratedState}>
                {children}
            </HydrationBoundary>
        </Providers>
    )

}