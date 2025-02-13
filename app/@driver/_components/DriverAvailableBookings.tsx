'use client'

import PageTitle from '@/app/_components/PageTitle'
import { Spinner } from '@/app/_components/Spinner'
import GoogleMapsDirections from '@/components/google-maps/GoogleMapsDirections'
import { Button } from '@/components/ui/button'
import { ResponsiveProvider } from '@/hooks/useResponsive'
import { BookingWithRelations } from '@/lib/types'
import { handleFullName } from '@/lib/utils'
import { socket } from '@/socket'
import { User } from '@prisma/client'
import React, { useEffect, useState } from 'react'
import { FaMotorcycle } from 'react-icons/fa'
import { MdPinDrop } from 'react-icons/md'

export default function DriverAvailableBookings({ bookings, user }: { bookings: BookingWithRelations[], user: User }) {
    const [isLoading, setIsLoading] = useState(false)

    const [move, setMove] = useState<boolean>(false)
    const acceptBooking = async (booking: BookingWithRelations) => {
        setIsLoading(true)
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
        setIsLoading(false)
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
        <>
            {isLoading &&
                <div className='fixed z-[999] bg-black/10 inset-0 flex flex-col items-center justify-center'>
                    <div className="flex flex-col rounded-md bg-white p-8">
                        <Spinner />
                    </div>
                </div>
            }

            <div className={`bg-background w-full flex flex-col items-start gap-2 ${bookings.length > 0 ? 'h-full' : 'h-fit'}`}>
                <PageTitle title='Available Bookings' />

                <div className='flex flex-col pt-[80px] p-4 w-full h-fit gap-5'>
                    {bookings.length > 0 ? bookings?.map(booking => (
                        <div key={booking.id} className="flex flex-col p-4 rounded-md border gap-5">
                            <div className='flex justify-between'>
                                <div className='flex gap-2 items-center'>
                                    <MdPinDrop className="text-4xl text-primary" />
                                    <span className='flex flex-col'>
                                        <p className='text-sm text-inactive'>Dropoff</p>
                                        <p>{booking?.dropoff?.name}</p>
                                    </span>
                                </div>

                                <span className='text-right'>
                                    <p>
                                        P {Number(booking.fareType == 'MULTIPLE' ? booking.dropoff.multipleFare : booking.dropoff.specialFare).toLocaleString()}
                                        {booking.fareType == 'MULTIPLE' && ' each'}
                                    </p>
                                    <p className='text-inactive'>{booking.fareType == 'MULTIPLE' ? '3 Person Up' : 'Special'}</p>
                                </span>

                            </div>


                            <div className="h-[300px] w-full">
                                <ResponsiveProvider>
                                    <GoogleMapsDirections destination={{ lat: parseFloat(booking.dropoff.latitude), lng: parseFloat(booking.dropoff.longitude) }} />
                                </ResponsiveProvider>
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="flex flex-col">

                                    <div className="flex w-full justify-between">
                                        <span>
                                            <p className='text-sm text-inactive'>Dropoff address</p>
                                            <span>{booking.dropoff.address}</span>
                                        </span>
                                    </div>

                                </div>

                                <hr />

                                <div className="flex flex-col">
                                    <p className='text-sm text-inactive'>Passenger Name</p>
                                    <span>{
                                        handleFullName({
                                            firstName: booking.passenger.firstName,
                                            middleName: booking.passenger.middleName,
                                            lastName: booking.passenger.lastName
                                        })}
                                    </span>
                                </div>
                            </div>


                            <Button disabled={isLoading} onClick={() => acceptBooking(booking)} className='ml-auto'>Accept Booking</Button>


                        </div>
                    )) :
                        <div className={`flex flex-col h-[50dvh] w-full items-center justify-center`}>
                            <FaMotorcycle className='text-2xl text-primary animate-bounce' />
                            <p className='text-lg text-inactive font-bold'>No bookings available.</p>
                        </div>
                    }
                </div>
            </div>
        </>

    )
}
