import React from 'react'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers';
import { baseUserSchema } from '@/lib/schema';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function DriverActivities() {
    const cookiesStore = await cookies();
    const user = cookiesStore.get('auth')

    const decodedUser = jwt.decode(user!.value) as z.infer<typeof baseUserSchema>;

    const bookings = await prisma.booking.findMany({
        where: {
            driverId: decodedUser.id
        },
        include: {
            passenger: true,
            driver: true,
            dropoff: true
        }
    })

    console.log(bookings)

    return (
        <div className='bg-background w-full h-full'>
            <div className='px-16 py-5 flex items-center'>
                <h1 className='text-lg font-bold px-4'>Activity History</h1>
            </div>
            <div className='flex flex-col items-start justify-center'>
                <div className='flex flex-col gap-2 w-full px-4'>
                    {
                        bookings.length > 0 ? bookings?.map(booking => (
                            <div key={booking.id} className={`border border-collapse border-gray-300 rounded-md flex flex-col gap-2 h-full min-w-dvw p-4`}>
                                <span className='text-muted-foreground flex justify-between '>
                                    <p className='text-black'>Ride to {booking.dropoff.address}</p>
                                    <p className='text-muted-foreground'>
                                        {booking.dropoffTime ? new Date(booking.dropoffTime!).toLocaleString() : booking.status}
                                    </p>
                                </span>
                                <span className='flex justify-between items-center'>
                                    <p className='text-muted-foreground text-xs'>
                                        {new Date(booking.createdAt!).toLocaleString()}
                                    </p>
                                    <Link href={`/activity/${1}`}>
                                        <Button className='bg-primary hover:primary/80 text-white'>View Details</Button>
                                    </Link>
                                </span>
                            </div>
                        )) : (
                            <div className={`flex h-dvh w-dvw items-center justify-center`}>
                                <p className='text-lg font-bold text-muted-foreground'>
                                    No activities to show.
                                </p>
                            </div>
                        )
                    }


                </div>
            </div>
        </div>
    )
}
