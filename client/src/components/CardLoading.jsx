import React from 'react'

const CardLoading = () => {
  return (
    <div className='border py-2 lg:p-4 grid gap-1 lg:gap-3 min-w-36 lg:min-w-52 rounded cursor-pointer bg-white animate-pulse'>
      <div className='min-h-24 bg-blue-50 rounded'>
      </div>
       {/* 10 min */}
      <div className='lg:p-3 p-2 bg-blue-50 rounded w-20'>
      </div>
      <div className='lg:p-3 p-2 bg-blue-100 rounded'>

      </div>
      {/* Unit */}
      <div className='lg:p-3 p-2 bg-blue-50 rounded w-16'>

      </div>
      <div className='flex items-center justify-between gap-3'>
        {/* Price */}
        <div className='lg:p-3 p-2 bg-blue-50 roundedw w-20'>

        </div>
        {/* Add to Cart */}
       <div className='lg:p-3 p-2 bg-blue-50 roundedw w-20'>

        </div>
      </div>
    </div>
  )
}

export default CardLoading
