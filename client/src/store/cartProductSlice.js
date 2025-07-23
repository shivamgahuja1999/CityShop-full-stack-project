import { createSlice } from "@reduxjs/toolkit";

const initialState={
    cart:[]
}
const cartSlice=createSlice({
    name:"cartItem",
    initialState,
    reducers:{
        handleAddItemToCart:(state,action)=>{
            state.cart=[...action.payload]
        },
    }
})
export const {handleAddItemToCart}=cartSlice.actions
export default cartSlice.reducer