import PageTitle from '@/app/_components/PageTitle'
import React from 'react'

export default function page() {
  return (
    <div className='bg-background w-full h-full flex flex-col'>
      <PageTitle title='Activity History' returnUrl='/activity' showBackButton={true} />
      <div className='border border-gray-300 rounded-md p-4 m-4 flex flex-col gap-2'>
        <div className='min-h-[200px] border border-gray-300 rounded-md flex items-center justify-center'>
          {/* google maps yung direction ng ride */}
          asd
        </div>
        <div className='flex flex-col gap-2'>
          <div className='flex justify-between'>
            <p>Ride to Montserrat Villa</p>
            <p className='text-muted-foreground'>P100</p>
          </div>
          <p>Pickup time</p>
          <p>Drop off time</p>
        </div>
        <div>Rider Details:</div>
      </div>
    </div>
  )
}
