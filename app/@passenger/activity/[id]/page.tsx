import PageTitle from '@/app/_components/PageTitle'
import React from 'react'

export default function page() {
  return (
    <div className='bg-background w-full h-full flex flex-col'>
      <PageTitle title='Activity History' returnUrl='/activity' showBackButton={true}/>
      <div className='border border-gray-300 rounded-md m-4'>

      </div>
    </div>
  )
}
