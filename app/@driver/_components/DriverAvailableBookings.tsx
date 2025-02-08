'use client'

import PageTitle from '@/app/_components/PageTitle'
import GoogleMapsDirections from '@/components/google-maps/GoogleMapsDirections'
import { Button } from '@/components/ui/button'
import { ResponsiveProvider } from '@/hooks/useResponsive'
import { baseBookingSchema, baseUserSchema } from '@/lib/schema'
import { socket } from '@/socket'
import React, { useEffect, useState } from 'react'
import { FaMotorcycle } from 'react-icons/fa'
import { z } from 'zod'

export default function DriverAvailableBookings({ bookings, user }: { bookings: z.infer<typeof baseBookingSchema>[], user: z.infer<typeof baseUserSchema> }) {
    const [move, setMove] = useState<boolean>(false)
    const acceptBooking = async (booking: z.infer<typeof baseBookingSchema>) => {
        const res = await fetch('api/bookings', {
            method: 'PATCH',
            body: JSON.stringify({
                id: booking.id,
                driverId: user.id,
                status: 'ACCEPTED'
            })
        })

        if (res.ok) {
            const booking = await res.json();
            socket.emit('accepted_booking', booking.data)
        }
    }

    useEffect(() => {
        const moveMotorCycle = () => {
            setTimeout(() => {
                setMove((prev) => !prev)
            }, 1000)
            clearTimeout(1000)
        }

        moveMotorCycle()
    }, [move])

    return (

        <div className='bg-background w-full h-full flex flex-col gap-2 overflow-auto'>
            <PageTitle title='Available Bookings' />
            <div className='flex p-4 w-full h-full'>
                {bookings.length > 0 ? bookings?.map(booking => (
                    <div key={booking.id} className="flex flex-col p-2 rounded-md border gap-5">

                        <div className="h-[300px] w-full">
                            <ResponsiveProvider>
                                <GoogleMapsDirections destination={{ lat: parseFloat(booking.dropoff.latitude), lng: parseFloat(booking.dropoff.longitude) }} />
                            </ResponsiveProvider>
                        </div>

                        <div className="flex flex-col">
                            <div className="flex w-full justify-between">
                                <p>Dropoff: <span>{booking.dropoff.address}</span></p>
                                <p>Fare: <span>P50.00</span></p>
                            </div>

                            <hr />

                            <div className="flex flex-col">
                                <p>Passenger Details</p>
                                <p>Name: <span>{booking.passenger.firstName}</span></p>
                            </div>
                        </div>


                        <Button onClick={() => acceptBooking(booking)} className='ml-auto'>Accept Booking</Button>


                    </div>
                )) :
                    <div className={`flex h-full w-dvw items-center justify-center`}>
                        <span className='text-lg font-bold text-muted-foreground relative'>
                            <div className='absolute -top-10 left-0 bg-background z-10 min-w-10 h-10' />
                            <div className='absolute -top-10 right-0 bg-background z-10 min-w-10 h-10' />
                            <FaMotorcycle className={`text-2xl absolute -top-6 ${move ? 'right-[0px] duration-1000 transition-all' : 'transition-all right-[170px] duration-1000'}`} />
                            No Available bookings.
                        </span>
                    </div>
                }
            </div>
        </div>

    )
}
