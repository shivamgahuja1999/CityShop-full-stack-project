import React, { useState } from 'react'
import EditProductAdmin from './EditProductAdmin'
import Confirmbox from './Confirmbox';
import { AxiosToastError } from '../utils/AxiosToastError';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';

const ProductCardAdmin = ({data,fetchProductData}) => {
  const [editOpen,setEditOpen]=useState(false);
  const [openDelete,setOpenDelete]=useState(false);

  const handleDeleteProduct=async()=>{
    try {
      const response=await Axios({
        ...SummaryApi.deleteProduct,
        data:{
          _id:data._id
        }
      })
      const {data:responseData}=response
      if(responseData.success){
        toast.success(responseData.message)
        if(fetchProductData){
          fetchProductData()
          setOpenDelete(false)
        }
      }
    } catch (error) {
      AxiosToastError(error);
    }
  }
  return (
    <div className='lg:w-44 w-40 p-4 bg-white'>
     <div className=''>
      <img 
      src={data?.image[0]} 
      alt={data.name}
      className='w-full h-full object-scale-down' />
     </div>
     <p className='text-ellipsis line-clamp-2 font-semibold'>{data?.name}</p>
     <p className='text-slate-400'>{data?.unit}</p>
     <div className='grid grid-cols-2 py-2 gap-3'>
      <button onClick={()=>setEditOpen(true)} className='border text-sm px-1 py-1 border-green-700 bg-green-100 text-green-700 hover:bg-green-200'>Edit</button>
      <button onClick={()=>setOpenDelete(true)} className='border text-sm px-1 py-1 border-red-600 bg-red-100 text-red-600 hover:bg-red-200'>Delete</button>
     </div>
     {
      editOpen &&  <EditProductAdmin data={data} fetchProductData={fetchProductData} close={()=>setEditOpen(false)}/>
     }
     {
      openDelete &&(
        <Confirmbox
        close={()=>setOpenDelete(false)}
        cancel={()=>setOpenDelete(false)}
        confirm={handleDeleteProduct}/>
      )
     }
    </div>
  )
}

export default ProductCardAdmin
