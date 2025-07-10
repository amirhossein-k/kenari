// src/store/productSlice.ts

import {createSlice,PayloadAction} from '@reduxjs/toolkit'

interface Product{
    id:number
    title: string;
  description: string;
  price: number;
  thumbnail: string;
  tags: string[];
}

// item1 ==> type of  ordermain
interface Item1{
    id:number
    order:number,
    price:number
}

// item2 ==> type of plus in to order


interface orderedProduct extends Omit<Product,'thumbnail'|"tags">{
    userId: number,
    item1: Item1,
    item2: Item1

}


interface ProductState {
    products:Product[]
    loading:boolean,
    productorder:orderedProduct[]
}


const initialState : ProductState ={
    products:[],
    loading:true,
    productorder:[]
}

const productSlice = createSlice({
    name:"products",
    initialState,
    reducers:{
        setProducts: (state,action:PayloadAction<Product[]>) =>{
            state.products = action.payload
        },
        setLoading: (state,action:PayloadAction<boolean> ) =>{
            state.loading = action.payload
        },
        setProductsShopOrder :(state,action:PayloadAction<orderedProduct[]>)=>{
            state.productorder = action.payload
        }
    }
})

export  const {setLoading,setProducts,setProductsShopOrder} =productSlice.actions
export default productSlice.reducer