import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import React from 'react'
import { FaChevronLeft } from "react-icons/fa";
import GoogleMapsDirections from '@/components/google-maps/GoogleMapsDirections';

export default async function ViewDropoff({ params }: { params: { id: string } }) {
    const { id } = await params;

    const dropoff = await prisma.dropoff.findFirst({
        where: {
            id: parseInt(id)
        }
    });



    if (dropoff) return (
        <div className="flex flex-col gap-5">

            <Link href={'..'} rel='path' className='cursor-pointer flex items-center gap-2'>
                <FaChevronLeft />
                <span>Back to Dropoffs</span>
            </Link>


            <div className="relative w-full rounded-md aspect-square">
                {/* <GoogleMaps center={{ lat: parseFloat(dropoff.latitude), lng: parseFloat(dropoff.longitude) }} /> */}
                <GoogleMapsDirections destination={{ lat: parseFloat(dropoff.latitude), lng: parseFloat(dropoff.longitude) }} />

                <div className="absolute flex gap-2 items-center bg-white py-1 px-3 w-fit rounded-full right-2 top-2">
                    <div className="size-2 bg-green-600 aspect-square rounded-full"></div>
                    <p className='text-sm'>{dropoff.status}</p>
                </div>
            </div>



            <div className="flex flex-col">
                <p className='text-xs font-medium text-black/80'>Dropoff Name</p>
                <p>{dropoff.name}</p>
            </div>

            <div className="flex flex-col">
                <p className='text-xs font-medium text-black/80'>Address</p>
                <p>{dropoff.address}</p>
            </div>

        </div>
    )
}
