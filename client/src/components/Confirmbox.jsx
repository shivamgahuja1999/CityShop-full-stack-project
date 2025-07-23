import React from 'react'
import { IoClose } from "react-icons/io5";

const Confirmbox = ({cancel,confirm,close}) => {
  return (
    <section className='fixed top-0 bottom-0 left-0 right-0 bg-neutral-800 bg-opacity-70 flex items-center justify-center mt-23'>
      <div className='bg-white max-w-md w-full p-4 rounded'>
         <div className='flex items-center justify-between'>
          <h1 className='font-semibold'>Permanent delete</h1>
          <button>
            <IoClose 
            size={25}
            onClick={close}/>
          </button>
         </div>
          <p>Are you sure Permanent delete ?</p>
          <div className='flex ml-auto items-center w-fit gap-3'>
          <button onClick={cancel} className='border px-3 py-1 rounded border-red-500 text-red-500 hover:bg-red-500 hover:text-white'>Cancel</button>
          <button onClick={confirm} className='border px-3 py-1 rounded border-green-600 text-green-600 hover:bg-green-600 hover:text-white'>Confirm</button>
         </div>
      </div>
    </section>
  )
}

export default Confirmbox
