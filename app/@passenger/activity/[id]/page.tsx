import Link from 'next/link'
import React from 'react'
import { MdArrowBack } from 'react-icons/md'

export default function page() {
  return (
    <div className='bg-background w-full h-full'>
      <div className='px-16 py-5 flex items-center'>
        <span className='text-lg font-bold  flex items-center gap-2 px-4'>
          <Link href="/activity">
            <MdArrowBack className='text-[24px] hover:text-primary' />
          </Link>
          Activity history
        </span>
      </div>
    </div>
  )
}
