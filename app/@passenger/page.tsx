
import React from 'react'
import SearchDropOff from './_components/SearchDropOff'
import { Input } from '@/components/ui/input'
import { MdPinDrop, MdSchool } from 'react-icons/md'
import { CiMenuKebab } from 'react-icons/ci'
import BookButton from './_components/BookButton'
import BookingForm from './_components/BookingForm'

export default function PassengerHomepage() {
  return (
    <div className='bg-background w-full h-full flex flex-col gap-2'>
      <BookingForm />
    </div>
  )
}
