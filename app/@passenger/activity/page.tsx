import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import Link from 'next/link'
import React from 'react'
import jwt from 'jsonwebtoken'
import { baseUserSchema } from '@/lib/schema'
import { z } from 'zod'
import PageTitle from '@/app/_components/PageTitle'
import { MdList } from 'react-icons/md'
import { FaMotorcycle } from 'react-icons/fa'
export default async function PassengerActivities() {
    const cookiesStore = await cookies();
    const user = cookiesStore.get('auth')

    const decodedUser = jwt.decode(user!.value) as z.infer<typeof baseUserSchema>;

    const bookings = await prisma.booking.findMany({
        where: {
            passengerId: decodedUser.id
        },
        include: {
            passenger: true,
            driver: true,
            dropoff: true
        }
    })


    if (bookings)
        return (
            <div className={`bg-background w-full flex flex-col items-start gap-2 ${bookings.length > 0 ? 'h-full' : 'h-fit'}`}>
                <PageTitle title='Activity History' />
                <div className='flex flex-col p-4 w-full h-fit gap-5 pt-[80px]'>
                    {
                        bookings.length > 0 ? bookings?.map(booking => (
                            <div key={booking.id} className={`border border-collapse border-gray-300 rounded-md flex flex-col gap-2 flex-1 h-full p-4`}>
                                <span className='text-inactive flex justify-between '>
                                    <span className='flex gap-2 items-center'>
                                        <FaMotorcycle className='text-2xl text-primary' />
                                        <span className='flex flex-col'>
                                            <p className='text-black'>{booking.dropoff.name}</p>
                                            <p className='text-inactive text-sm leading-none'>{booking.dropoff.address}</p>
                                        </span>
                                    </span>
                                    <span className='flex flex-col'>
                                        {booking.dropoffTime ? "P " + (booking.fareType == 'MULTIPLE' ? Number(booking.fare).toLocaleString() + " each" : Number(booking.fare).toLocaleString()) : booking.status}
                                    </span>
                                </span>
                                <span className='flex justify-between items-center'>
                                    <p className='text-inactive text-xs'>
                                        {new Date(booking.createdAt!).toLocaleString()}
                                    </p>
                                    <Link href={`/activity/${1}`}>
                                        <Button className='bg-primary hover:primary/80 text-white'>View Details</Button>
                                    </Link>
                                </span>
                            </div>
                        )) : (
                            <div className={`flex h-[50dvh] w-full items-center justify-center`}>
                                <p className='text-lg font-bold text-inactive flex flex-col items-center justify-center'>
                                    <MdList className='text-2xl animate-bounce' />
                                    No activities to show.
                                </p>
                            </div>
                        )
                    }

                </div>
            </div>
        )
}
