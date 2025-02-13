import PageTitle from '@/app/_components/PageTitle';
import GoogleMapsDirections from '@/components/google-maps/GoogleMapsDirections';
import { prisma } from '@/lib/prisma';
import { handleFullName, toTitleCase } from '@/lib/utils';
import { notFound } from 'next/navigation';
import React from 'react'
import { MdPinDrop } from 'react-icons/md';

export default async function DriverActivity(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
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
        <div className={`bg-background w-full flex flex-col items-start gap-2 h-full`}>
            <PageTitle title='Activity History' returnUrl='/activity' showBackButton={true} />
            <div className='w-full h-fit flex flex-col justify-start pt-[80px] '>
                <div className='border border-gray-300 rounded-md p-4 m-4 flex flex-col gap-2'>
                    <div className="flex justify-between items-start">
                        <div className='flex items-center gap-2'>
                            <MdPinDrop className='text-primary text-4xl leading-none tracking-tighter p-0 m-0' />
                            <span className="flex flex-col w-full">
                                <span className='text-inactive text-sm'>Dropoff</span>
                                <p className='font-bold'>{activity.dropoff.name}</p>
                            </span>
                        </div>
                        <span className='flex flex-col justify-end text-right'>
                            <p>P {activity.fareType == 'MULTIPLE' ? `${activity.fare} each` : `${activity.fare}`}</p>
                            <span className='text-inactive text-sm'>{toTitleCase(String(activity.fareType))}</span>
                        </span>
                    </div>
                    <div className='min-h-[400px] border border-muted rounded-md flex items-center justify-center'>
                        <GoogleMapsDirections destination={{ lat: parseFloat(activity.dropoff.latitude), lng: parseFloat(activity.dropoff.longitude) }} />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <span className="flex flex-col w-full">
                            <span className='text-inactive text-sm'>Dropoff Address</span>
                            <p>{activity.dropoff.address}</p>
                        </span>

                        <span className="flex flex-col">
                            <span className='text-inactive text-sm'>Pickup Time</span>
                            <p>{new Date(String(activity.pickupTime)).toLocaleString()}</p>
                        </span>

                        <span className="flex flex-col">
                            <span className='text-inactive text-sm'>Drop Off Time</span>
                            <p>{new Date(String(activity.dropoffTime)).toLocaleString()}</p>
                        </span>
                    </div>
                    <hr></hr>
                    <span className="flex flex-col">
                        <span className='text-inactive text-sm'>Passenger Details</span>
                        <p>{handleFullName({ firstName: activity.passenger?.firstName, middleName: activity.passenger?.middleName, lastName: activity.passenger?.lastName })}</p>
                    </span>
                </div>
            </div>
        </div>
    )
}
