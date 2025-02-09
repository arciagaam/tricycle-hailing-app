import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import Link from 'next/link'
import React from 'react'
import jwt from 'jsonwebtoken'
import { baseUserSchema } from '@/lib/schema'
import { z } from 'zod'
import PageTitle from '@/app/_components/PageTitle'
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
            <div className='bg-background w-full h-full'>
                <PageTitle title='Activity History'/>
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
                                <div className={`flex h-full w-dvw items-center justify-center`}>
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
