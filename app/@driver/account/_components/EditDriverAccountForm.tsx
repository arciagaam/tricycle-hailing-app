'use client'

import { Input } from '@/components/ui/input';
import React from 'react'

type TEditAccountForm = {
    isEditing: boolean;
    setIsEditing?: React.Dispatch<React.SetStateAction<boolean>>
}

export default function EditDriverAccountForm({isEditing} : TEditAccountForm) {
  return (
    <form className='flex flex-col gap-2'>
      <div className='flex flex-col'>
        <label className='text-inactive'>Username</label>
        <p className='pl-3'>passenger</p>
      </div>
      <div className='flex flex-col'>
        <label className='text-inactive'>First Name</label>
        <Input disabled={!isEditing} id="first-name" placeholder='First Name' value="John" className={`disabled:bg-none disabled:!text-black disabled:border-none disabled:shadow-none disabled:focus:border-none disabled:focus-visible:ring-0`}/>
      </div>
      <div className='flex flex-col'>
        <label className='text-inactive'>Middle Name</label>
        <Input disabled={!isEditing} id="middle-name" placeholder='Middle Name' value="Michael" className={`disabled:bg-none disabled:!text-black disabled:border-none disabled:shadow-none disabled:focus:border-none disabled:focus-visible:ring-0`}/>
      </div>
      <div className='flex flex-col'>
        <label className='text-inactive'>Last Name</label>
        <Input disabled={!isEditing} id="last-name" placeholder='Last Name' value="Doe" className={`disabled:bg-none disabled:!text-black disabled:border-none disabled:shadow-none disabled:focus:border-none disabled:focus-visible:ring-0`}/>
      </div>
    </form>
  )
}
