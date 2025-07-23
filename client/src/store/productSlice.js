import { createSlice } from "@reduxjs/toolkit";

const initialState={
    allCategory:[],
    allSubCategory:[],
    product:[],
    loadingCategory:false,
}

export const productSlice=createSlice({
    name:'product',
    initialState,
    reducers:{
        setAllCategory:(state,action)=>{
            // console.log('all category redux store',action.payload)
            state.allCategory=[...action.payload]
        },
        setLoadingCategory:(state,action)=>{
            state.loadingCategory=action.payload
        },
        setAllSubCategory:(state,action)=>{
            state.allSubCategory=[...action.payload]
        }
    }
})

export const {setAllCategory,setAllSubCategory,setLoadingCategory} =productSlice.actions;
export default productSlice.reducer