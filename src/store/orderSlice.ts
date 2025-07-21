import { orderedProduct } from "@/types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface order{
    orderProduct: orderedProduct[]
}

const  initialState : order ={
    orderProduct:[]
}

const orderSlice = createSlice({
    name:"order",
    initialState,
    reducers:{
        setOrderProduct :(state,action:PayloadAction<orderedProduct[]>)=>{
            state.orderProduct = action.payload
        }
    }
})

export const {setOrderProduct } =orderSlice.actions
export default orderSlice.reducer