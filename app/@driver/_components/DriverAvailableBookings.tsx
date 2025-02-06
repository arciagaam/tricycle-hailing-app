'use client'

import PageTitle from '@/app/_components/PageTitle'
import GoogleMapsDirections from '@/components/google-maps/GoogleMapsDirections'
import { Button } from '@/components/ui/button'
import { ResponsiveProvider } from '@/hooks/useResponsive'
import { baseBookingSchema, baseUserSchema } from '@/lib/schema'
import { socket } from '@/socket'
import React from 'react'
import { z } from 'zod'

export default function DriverAvailableBookings({ bookings, user }: { bookings: z.infer<typeof baseBookingSchema>[], user: z.infer<typeof baseUserSchema> }) {

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

    return (

        <div className='bg-background w-full h-full flex flex-col gap-2 p-4 overflow-auto'>
            <PageTitle title='Available Bookings'/>

            {bookings?.map(booking => (
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
            ))}
        </div>

    )
}
