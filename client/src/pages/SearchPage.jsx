import React, { useEffect, useState } from 'react'
import CardLoading from '../components/CardLoading';
import { AxiosToastError } from '../utils/AxiosToastError';
import Axios from "../utils/Axios.js"
import SummaryApi from '../common/SummaryApi';
import CardProduct from '../components/CardProduct.jsx';
import InfiniteScroll from "react-infinite-scroll-component";
import { useLocation } from 'react-router-dom';
import NoData from "../assets/nothing here yet.webp"

const SearchPage = () => {
  const [data,setData]=useState([]);
  const [loading,setLoading]=useState(true);
  const loadingCardArray=new Array(12).fill(null)
  const [page,setPage]=useState(1)
  const [totalPage,setTotalPage]=useState(1)
  const params=useLocation()
  const searchText=params.search.slice(3)

  // console.log(params.search.slice(3))

  const fetchData=async()=>{
    try {
      setLoading(true)
      const response=await Axios({
        ...SummaryApi.searchProduct,
        data:{
          search:searchText,
          page:page
        }
      })
      const {data:responseData}=response
      if(responseData.success){
        setTotalPage(responseData.totalPage);
        if(responseData.page ==1){
          setData(responseData.data)
        }
        else(
          setData((prev)=>{
            return[
              ...prev,
              ...responseData.data
            ]
          })
        )
        console.log(responseData)
      }
    } catch (error) {
      AxiosToastError(error)
    }finally{
      setLoading(false)
    }
  }

  useEffect(()=>{
    fetchData();
  },[page,searchText])
  console.log("page",page)
  const handleFetchMore=()=>{
    if(totalPage >page){
      setPage(prev=>prev+1)
    }
  }
  return (
    <section className='bg-white'>
      <div className='conainer mx-auto p-4 '>
        <p className='font-semibold'>Search Results: {data.length}</p>
      </div>
      <InfiniteScroll
      dataLength={data.length}
      next={handleFetchMore}
      hasMore={true}>
      <div className='grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2 py-4 gap-4'>
        {
          data.map((p,index)=>{
            return (
              <CardProduct data={p} key={p?._id+"searchproduct"+index}/>
            )
          })
        }
        {/* Loading data */}
        {
          loading &&(
            loadingCardArray.map((_,index)=>{
              return(
                <CardLoading key={"loadingsearchproduct"+index}/>
              )
            })
          )
        }
      </div>
      </InfiniteScroll>
       {
          // No data
          !data[0] && !loading &&(
            <div className='flex flex-col justify-center items-center w-full mx-auto'>
              <img src={NoData} alt="No data"
              className='w-full h-full max-w-xs' />
              <p className='font-semibold my-2'>No Data</p>
            </div>
          )
      }
    </section>
  )
}

export default SearchPage
