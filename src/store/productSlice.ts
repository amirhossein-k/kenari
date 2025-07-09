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


interface ProductState {
    products:Product[]
    loading:boolean
}


const initialState : ProductState ={
    products:[],
    loading:true
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
        }
    }
})

export  const {setLoading,setProducts} =productSlice.actions
export default productSlice.reducer