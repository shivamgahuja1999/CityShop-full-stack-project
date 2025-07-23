import React from 'react'
import { IoClose } from "react-icons/io5";

const ViewImage = ({url,close}) => {
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-neutral-800 bg-opacity-70 flex items-center justify-center mt-32 lg:z-30 z-50 p-4">
      <div className='bg-white max-w-md max-h-[75vh] w-full p-4 rounded'>
        <button onClick={close} className='w-fit block ml-auto'>
            <IoClose size={25}/>
        </button>
        <img 
        src={url} alt="full screen" 
        className='w-full h-full object-scale-down'/>
      </div>
    </div>
  )
}

export default ViewImage
