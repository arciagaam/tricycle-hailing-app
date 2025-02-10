'use client'

import { Spinner } from '@/app/_components/Spinner'
import GoogleMapsDirections from '@/components/google-maps/GoogleMapsDirections'
import { Button } from '@/components/ui/button'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { ResponsiveProvider } from '@/hooks/useResponsive'
import { BookingWithRelations } from '@/lib/types'
import { socket } from '@/socket'
import React, { useState } from 'react'


export default function DriverCurrentBooking({ booking }: { booking: BookingWithRelations }) {

    const [isLoading, setIsLoading] = useState(false)

    const pickupPassenger = async () => {
        setIsLoading(true);

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

        setIsLoading(false);

    }

    const dropoffPassenger = async () => {
        setIsLoading(true);

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

        setIsLoading(false);

    }
    return (
        <>
            {isLoading &&
                <div className='absolute z-[999] bg-black/10 inset-0 flex flex-col items-center justify-center'>
                    <div className="flex flex-col rounded-md bg-white p-8">
                        <Spinner />
                    </div>
                </div>
            }

            <div className="flex flex-col w-full h-full">
                <ResponsiveProvider>
                    <GoogleMapsDirections destination={{ lat: parseFloat(booking.dropoff.latitude), lng: parseFloat(booking.dropoff.longitude) }} />
                </ResponsiveProvider>



                <div className='flex flex-col w-full h-fit absolute bottom-0'>
                    <Drawer>
                        <DrawerTrigger asChild>

                            <Button className='flex flex-col h-fit py-6 rounded-b-none'>
                                <p>ANIMATION</p>
                                <p>Click to view details</p>
                            </Button>
                        </DrawerTrigger>
                        <DrawerContent>
                            <DrawerHeader>
                                <DrawerTitle>Current Booking</DrawerTitle>
                            </DrawerHeader>

                            <div className="w-full flex flex-col bg-background rounded-md p-4 gap-5">
                                <p>Ride Details</p>
                                <p>Dropoff: <span>{booking.dropoff.address}</span></p>
                                <p>Fare: <span>P50.00</span></p>
                                <hr />
                                <p>Passenger Details</p>
                                <p>Rider: <span>{booking.passenger.firstName}</span></p>

                                {
                                    booking.status == 'ACCEPTED' && <Button disabled={isLoading} onClick={pickupPassenger}>Pickup Passenger</Button>
                                }

                                {
                                    booking.status == 'ONGOING' && <Button disabled={isLoading} onClick={dropoffPassenger}>Dropoff Passenger</Button>
                                }
                            </div>
                        </DrawerContent>
                    </Drawer>


                </div>
            </div>
        </>

    )
}
