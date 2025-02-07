import PageTitle from '@/app/_components/PageTitle'
import GoogleMapsDirections from '@/components/google-maps/GoogleMapsDirections';
import { prisma } from '@/lib/prisma'
import { handleFullName } from '@/lib/utils';
import { notFound } from 'next/navigation';
import React from 'react'

export default async function PassengerActivity({ params }: { params: { id: string } }) {
  const { id } = params;

  const activity = await prisma.booking.findFirst({
    where: {
      id: Number(id)
    },
    include: {
      driver: true,
      passenger: true,
      dropoff: true
    }
  })

  if (!activity) return notFound();


  return (
    <div className='bg-background w-full h-full flex flex-col'>
      <PageTitle title='Activity History' returnUrl='/activity' showBackButton={true} />
      <div className='border border-gray-300 rounded-md p-4 m-4 flex flex-col gap-2'>
        <div className='min-h-[300px] border border-gray-300 rounded-md flex items-center justify-center'>
          <GoogleMapsDirections destination={{ lat: parseFloat(activity.dropoff.latitude), lng: parseFloat(activity.dropoff.longitude) }} />
        </div>
        <div className='flex flex-col gap-2'>
          <div className='flex justify-between'>
            <p>Ride to {activity.dropoff.address}</p>
            <p className='text-muted-foreground'>P{Number(activity.dropoff.fare).toLocaleString()}</p>
          </div>
          <p>Pickup time: <span>{new Date(String(activity.pickupTime)).toLocaleString()}</span></p>
          <p>Drop off time: <span>{new Date(String(activity.dropoffTime)).toLocaleString()}</span></p>
        </div>

        <div className="flex flex-col">
          <div>Driver Details:</div>
          <p>{handleFullName({ firstName: activity.driver?.firstName, middleName: activity.driver?.middleName, lastName: activity.driver?.lastName })}</p>
        </div>
      </div>
    </div>
  )
}
