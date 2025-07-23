import React from 'react'
import UserMenu from '../components/UserMenu'
import { IoClose } from "react-icons/io5";

const UserMenuMobileVersion = () => {
  return (
    <section className='bg-white h-full w-full py-3'>
        <button onClick={()=>window.history.back()} className='text-neutral-800 block ml-auto w-fit'>
          <IoClose size={26}/>
        </button>
        <div className='container mx-auto px-3 pb-4'>
            <UserMenu />
        </div>
    </section>
  )
}

export default UserMenuMobileVersion
