import React from 'react'
import noDataImage from '../assets/nothing here yet.webp'

const NoData = () => {
  return (
    <div className='flex flex-col justify-center items-center p-4 gap-1'>
      <img 
      src={noDataImage} 
      alt="No data"
      className='w-60'/>
      <p className='text-neutral-500'>No data</p>
    </div>
  )
}

export default NoData
