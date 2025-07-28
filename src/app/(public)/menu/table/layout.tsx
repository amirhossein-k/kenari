// src/app/(public)/menu/table/layout.tsx

import {Providers} from '@/app/Providers'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getProductAll } from '../../../../../actions/getProductAll';




export default async function Layout({ children }: { children: React.ReactNode }) {
const queryClient = new QueryClient()

await queryClient.prefetchQuery({
  queryKey:['products'],
  queryFn:getProductAll
})

const dehydratedState = dehydrate(queryClient)


     return (
      <Providers dehydratedState={dehydratedState}>
        <HydrationBoundary state={dehydratedState} >

        {children}
        </HydrationBoundary>
      </Providers>
    );
        
   
  
}
