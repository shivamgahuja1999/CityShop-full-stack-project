import React, { useEffect, useState } from "react";
import { AxiosToastError } from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import Loading from "../components/Loading";
import SummaryApi from "../common/SummaryApi";
import ProductCardAdmin from "../components/ProductCardAdmin";
import { IoSearch } from "react-icons/io5";


const ProductAdminPage = () => {
  const [productData, setProductData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPageCount,setTotalPageCount]=useState(1)
  const [search,setSearch]=useState("")

  const fetchProductData = async (e) => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProduct,
        data: {
          page: page,
          limit:12,
          search:search
        },
      });
      const { data: responseData } = response;
      //    console.log("Product page data",responseData)
      if (responseData.success) {
        setProductData(responseData.data);
        setTotalPageCount(responseData.totalNoPage)
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProductData();
  }, [page]);

  const handlePrevious=()=>{
    if(page>1){
        setPage(prev=>prev-1)
    }
  }

  const handleNext=()=>{
    if(page!==totalPageCount){
        setPage(prev=>prev+1)
    }
  }

  const handleOnChange=(e)=>{
    e.preventDefault()
    setSearch(e.target.value)
    setPage(1)
  }
   useEffect(() => {
    const timeout=setTimeout(()=>{
        fetchProductData()
        // flag=false
    },300)
    return()=>{
      clearTimeout(timeout)
    }
  }, [search]);
  return (
    <section>
      <div className="p-2 bg-white shadow-md flex items-center justify-between gap-4">
        <h2 className="font-semibold">Product</h2>
        <div className="h-full min-w-24 max-w-60 w-full bg-blue-50 flex justify-between items-center border px-2 py-2 gap-3 focus-within:border-primary-200 rounded">
          <IoSearch size={20}/>
          <input 
          type="text"
          placeholder="Search product here..." 
          className="h-full w-full outline-none bg-transparent"
          value={search}
          onChange={handleOnChange}/>
        </div>
      </div>
      {loading && <Loading />}

      <div className="p-4 bg-blue-50 mt-1">
        <div className="min-h-[55vh]">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {productData.map((prod, index) => {
            return <ProductCardAdmin key={prod._id} data={prod} fetchProductData={fetchProductData} />;
          })}
        </div>
        </div>
        <div className="flex justify-between my-4">
            <button onClick={handlePrevious} className="border border-primary-200 hover:bg-primary-200 px-4 py-1 font-semibold">Previous</button>
            <button className="w-full bg-slate-100 ">{page}/{totalPageCount}</button>
            <button onClick={handleNext} className="border border-primary-200 hover:bg-primary-200 px-4 font-semibold">Next</button>
        </div>
      </div>
    </section>
  );
};

export default ProductAdminPage;
