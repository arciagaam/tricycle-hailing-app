import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import Link from 'next/link'
import React from 'react'
import { MdPinDrop, MdSchool } from 'react-icons/md'
import jwt from 'jsonwebtoken'
import { baseUserSchema } from '@/lib/schema'
import { z } from 'zod'
export default async function ActivityPage() {
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
                <div className='px-16 py-5 flex items-center'>
                    <h1 className='text-lg font-bold px-4'>Activity history</h1>
                </div>
                <div className='flex flex-col items-start justify-center'>
                    <div className='flex flex-col gap-2 w-full'>
                        {
                            bookings?.map(booking => (
                                <div key={booking.id} className={`border-y border-collapse border-muted-foreground/50 flex flex-col gap-2 h-full min-w-dvw p-4`}>
                                    <span className='text-muted-foreground flex justify-between'>
                                        <p className='font-bold text-lg'>Booking ID: {booking.id}</p>
                                        <p className='text-muted-foreground'>100 Php</p>
                                    </span>
                                    <div className='flex flex-col gap-2'>
                                        <p className='flex items-center gap-2'>
                                            <MdSchool size={24} />
                                            San Beda University - Rizal
                                        </p>
                                        <p className='flex items-center gap-2'>
                                            <MdPinDrop size={24} />
                                            {booking.dropoff.address}
                                        </p>
                                    </div>
                                    <span className='flex justify-between items-center'>
                                        <p className='text-muted-foreground'>{new Date(booking.createdAt!).toLocaleString()}</p>
                                        <Link href={`/activity/${1}`}>
                                            <Button className='bg-primary hover:primary/80 text-white'>View Details</Button>
                                        </Link>
                                    </span>
                                </div>
                            ))
                        }


                    </div>
                </div>
            </div>
        )
}
