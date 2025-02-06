import GoogleMapsDirections from '@/components/google-maps/GoogleMapsDirections'
import { Button } from '@/components/ui/button'
import { ResponsiveProvider } from '@/hooks/useResponsive'
import { baseBookingSchema } from '@/lib/schema'
import { socket } from '@/socket'
import React from 'react'
import { z } from 'zod'

export default function DriverCurrentBooking({ booking }: { booking: z.infer<typeof baseBookingSchema> }) {
    const pickupPassenger = async () => {
        const res = await fetch('api/bookings', {
            method: 'PATCH',
            body: JSON.stringify({
                id: booking.id,
                status: 'ONGOING',
                pickupTime: new Date()
            })
        })

        if (res.ok) {
            const booking = await res.json();
            socket.emit('pickup_passenger', booking.data)
        }
    }

    const dropoffPassenger = async () => {
        const res = await fetch('api/bookings', {
            method: 'PATCH',
            body: JSON.stringify({
                id: booking.id,
                status: 'COMPLETED',
                dropoffTime: new Date()
            })
        })

        if (res.ok) {
            const booking = await res.json();
            socket.emit('dropoff_passenger', booking.data)
        }
    }
    return (
        <div className="flex flex-col w-full h-full">
            <ResponsiveProvider>
                <GoogleMapsDirections destination={{ lat: parseFloat(booking.dropoff.latitude), lng: parseFloat(booking.dropoff.longitude) }} />
            </ResponsiveProvider>

            <div className='flex flex-col w-[92dvw] h-fit absolute left-[4vw] bottom-[4dvh]'>
                <div className="w-full flex flex-col bg-background rounded-md p-4 gap-5">
                    <p>Ride Details</p>
                    <p>Dropoff: <span>{booking.dropoff.address}</span></p>
                    <p>Fare: <span>P50.00</span></p>
                    <hr />
                    <p>Passenger Details</p>
                    <p>Rider: <span>{booking.passenger.firstName}</span></p>

                    {
                        booking.status == 'ACCEPTED' && <Button onClick={pickupPassenger}>Pickup Passenger</Button>
                    }

                    {
                        booking.status == 'ONGOING' && <Button onClick={dropoffPassenger}>Dropoff Passenger</Button>
                    }
                </div>
            </div>
        </div>
    )
}
