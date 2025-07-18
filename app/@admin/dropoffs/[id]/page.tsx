import { prisma } from '@/lib/prisma';
import React from 'react'
import PageTitle from '@/app/_components/PageTitle';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import GoogleMaps from '@/components/google-maps/GoogleMaps';
import HandleDropoffStatusChange from './edit/_components/HandleDropoffStatusChange';
import { notFound } from 'next/navigation';


export default async function ViewDropoff(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const { id } = params;

    const dropoff = await prisma.dropoff.findFirst({
        where: {
            id: parseInt(id)
        }
    });


    if (!dropoff) return notFound();


    if (dropoff) return (
        <>
            <PageTitle title={dropoff.name} showBackButton={true} />
            <div className="flex flex-col pt-[80px] lg:pt-[100px] p-4 lg:p-8 gap-5">

                <div className="relative w-full rounded-md sm:max-h-[40dvh] aspect-square ">
                    <GoogleMaps disableClick center={{ lat: parseFloat(dropoff.latitude), lng: parseFloat(dropoff.longitude) }} />

                    {/* <GoogleMapsDirections destination={{ lat: parseFloat(dropoff.latitude), lng: parseFloat(dropoff.longitude) }} /> */}


                    <div className="absolute flex gap-2 items-center bg-white py-1 px-3 w-fit rounded-full right-2 top-2">
                        <div className={`size-2 ${dropoff.status == 'ACTIVE' ? 'bg-green-600' : 'bg-red-600'} aspect-square rounded-full`}></div>
                        <p className='text-sm'>{dropoff.status}</p>
                    </div>
                </div>


                <div className="flex flex-col gap-5 p-4">
                    <div className="flex flex-col">
                        <p className='text-xs font-medium text-black/80'>Dropoff Name</p>
                        <p>{dropoff.name}</p>
                    </div>

                    <div className="flex flex-col">
                        <p className='text-xs font-medium text-black/80'>Address</p>
                        <p>{dropoff.address}</p>
                    </div>

                    <div className="flex flex-col">
                        <p className='text-xs font-medium text-black/80'>Special Fare {"(1-2 person)"}</p>
                        <p>{dropoff.specialFare}</p>
                    </div>

                    <div className="flex flex-col">
                        <p className='text-xs font-medium text-black/80'>Multiple Fare {"(3 person above)"}</p>
                        <p>{dropoff.multipleFare} each</p>
                    </div>

                    <hr />
                    <p>Actions</p>


                    <div className="flex flex-col gap-1">
                        <Link href={`/dropoffs/${dropoff.id}/edit`}>
                            <Button className='w-fit'>
                                Edit Dropoff
                            </Button>
                        </Link>

                        <HandleDropoffStatusChange dropoff={dropoff} />
                    </div>
                </div>

            </div>
        </>
    )
}
