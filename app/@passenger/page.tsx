
import React from 'react'
import SearchDropOff from './_components/SearchDropOff'
import { Input } from '@/components/ui/input'
import { MdPinDrop, MdSchool } from 'react-icons/md'
import { CiMenuKebab } from 'react-icons/ci'
import BookButton from './_components/BookButton'

export default function PassengerHomepage() {
  return (
    <div className='bg-background w-full h-full p-4 flex flex-col items-end justify-center gap-2'>
      <div className='mt-auto w-full flex border rounded-md gap-2 p-2'>
        <div className='flex flex-col gap-0.5 justify-center items-center'>
          <MdSchool size={24} className='min-w-[20px]' />
          <CiMenuKebab />
          <label htmlFor='drop-off'>
            <MdPinDrop size={24} className='min-w-[20px] text-primary' />
          </label>
        </div>
        <div className='flex flex-col gap-2 w-full'>
          <Input
            className='text-muted-foreground text-ellipsis border-none shadow-none focus:border-none focus-visible:ring-0'
            value={'San Beda University - Rizal | Taytay'}
            readOnly
          />
          <SearchDropOff />
        </div>
      </div>
      <BookButton />
    </div>
  )
}
