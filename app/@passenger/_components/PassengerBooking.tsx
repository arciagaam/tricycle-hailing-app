'use client'

import { Input } from '@/components/ui/input'
import React, { useEffect, useState } from 'react'
import { CiMenuKebab } from 'react-icons/ci'
import { MdPinDrop, MdSchool } from 'react-icons/md'
import SearchDropOff from './SearchDropOff'
import GoogleMaps from '@/components/google-maps/GoogleMaps'
import GoogleMapsDirections from '@/components/google-maps/GoogleMapsDirections'
import { baseBookingSchema, baseDropOffSchema, baseUserSchema } from '@/lib/schema'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { $Enums } from '@prisma/client'
import { socket } from '@/socket'
import { ResponsiveProvider } from '@/hooks/useResponsive'


const bookingStatuses = [
    'booking',
    'accepted',
    'ongoing',
]

export default function PassengerBooking({ currentBooking, currentUser }: {
    currentBooking: {
        id: number;
        status: $Enums.BookingStatus;
        createdAt: Date;
        dropoffId: number;
        driverId: number;
        passengerId: number;
        pickupTime: Date;
        dropoffTime: Date;
    } | null,
    currentUser: z.infer<typeof baseUserSchema>
}) {

    const [booking, setBooking] = useState(currentBooking);
    const [selectedDropoff, setSelectedDropoff] = useState<z.infer<typeof baseDropOffSchema> | null>(currentBooking?.dropoff || null);
    const [dropoffs, setDropoffs] = useState<z.infer<typeof baseDropOffSchema>[] | null>();

    const getFetchedDropoffs = (value: z.infer<typeof baseDropOffSchema>[]) => {
        setDropoffs(value);
    }

    useEffect(() => {
        socket.on('new_booking', (booking) => {
            if (currentUser.id == booking.passenger.id) {
                setBooking(booking)
            }
        })

        socket.on('accepted_booking', (booking) => {
            setBooking(booking)
        })

        socket.on('pickup_passenger', (booking) => {
            setBooking(booking)
        })

        socket.on('dropoff_passenger', (booking) => {
            setBooking(booking)
            setSelectedDropoff(null)
        })

        return () => {
            socket.off('new_booking')
            socket.off('accepted_booking')
            socket.off('pickup_passenger')
            socket.off('dropoff_passenger')
        }
    }, [])

    const onBookingSubmit = async () => {

        const res = await fetch('api/bookings', {
            method: 'POST',
            body: JSON.stringify({
                dropoffId: selectedDropoff?.id,
                passengerId: currentUser.id
            })
        })

        if (res.ok) {
            const booking = await res.json();
            socket.emit('new_booking', booking.data)
        }
    }


    return (
        <div className='h-full relative flex flex-col'>
            <ResponsiveProvider>
                {
                    selectedDropoff ? <GoogleMapsDirections destination={{ lat: parseFloat(selectedDropoff.latitude), lng: parseFloat(selectedDropoff.longitude) }} /> : <GoogleMaps />
                }
            </ResponsiveProvider>


            <div className="flex flex-col w-[92dvw] h-fit absolute left-[4vw] bottom-[4dvh]">
                {
                    booking && bookingStatuses.includes(booking?.status.toLowerCase()) && <GetCurrentStatusScreen booking={booking} />
                }

                {
                    (!booking || (booking && !bookingStatuses.includes(booking?.status.toLowerCase()))) &&
                    <div className="flex flex-col gap-2 w-full justify-self-center self-center">
                        {
                            dropoffs &&
                            <div className="flex flex-col absolute left-0 bottom-[100%] p-4 bg-background w-full">
                                {
                                    dropoffs.map((dropoff) => (
                                        <button onClick={() => setSelectedDropoff(dropoff)} key={dropoff.id} className="flex">
                                            {dropoff.name}
                                        </button>
                                    ))
                                }
                            </div>
                        }
                        <div className='w-full flex rounded-md gap-2 p-4 bg-background'>
                            <div className='flex flex-col gap-0.5 justify-center items-center'>
                                <MdSchool size={24} className='min-w-[20px]' />
                                <CiMenuKebab />
                                <label htmlFor='drop-off'>
                                    <MdPinDrop size={24} className='min-w-[20px] text-primary' />
                                </label>
                            </div>

                            <div className='flex flex-col gap-2 w-full'>

                                <Input
                                    className='text-muted-foreground text-ellipsis border-none shadow-none focus:border-none focus-visible:ring-0'
                                    value={'San Beda University - Rizal | Taytay'}
                                    readOnly
                                />
                                <SearchDropOff getFetchedDropoffs={getFetchedDropoffs} setDropoffs={setDropoffs} />
                            </div>
                        </div>
                        <Button onClick={onBookingSubmit} className='w-full focus:bg-primary/80'>
                            Book
                        </Button>

                    </div>
                }
            </div>

        </div>
    )
}

const GetCurrentStatusScreen = ({ booking }: { booking: z.infer<typeof baseBookingSchema> }) => {
    switch (booking.status.toLowerCase()) {
        case 'booking': return <BookingScreen booking={booking} />;
        case 'accepted': return <InProgressScreen booking={booking} />;
        case 'ongoing': return <InProgressScreen booking={booking} />;
        default: return <BookingScreen booking={booking} />;
    }
}


const BookingScreen = ({ booking }: { booking: z.infer<typeof baseBookingSchema> }) => {
    // const [loading, setLoading] = useState<boolean>(false);
    // const [count, setCount] = useState<number>(0);

    // useEffect(() => {
    //     if (booking.status.toLowerCase() === 'booking') {
    //         setLoading(true)
    //     }
    // }, [booking])


    // useEffect(() => {
    //     const animateLoading = () => {
    //         while (loading) {
    //             setTimeout(() => {
    //                 setCount((prev) => prev + 1)
    //                 if (count === 3) {
    //                     setCount(0)
    //                 }
    //             }, 1000)
    //         }
    //     }

    //     animateLoading();
    // }, [])


    return (
        <div className="w-full flex flex-col rounded-md gap-2 p-4 bg-background">
            <p className='text-muted-foreground'>Ride Details</p>

            <p>Dropoff to <span>{booking?.dropoff?.address}</span></p>
            <p><span>P50.00</span></p>

            <hr />

            <div>
                Looking for drivers . . .
                {/* {count === 1 && <p>.</p>}
                {count === 2 && <p>..</p>}
                {count === 3 && <p>...</p>} */}
            </div>

            <Button variant={'destructive'}>Cancel Booking</Button>
        </div>
    )
}

const InProgressScreen = ({ booking }: { booking: z.infer<typeof baseBookingSchema> }) => {
    return (

        <div className="flex flex-col bg-background rounded-md p-4 gap-5">
            <h1>{booking.status.toLowerCase() == 'accepted' ? 'Driver is on its way to your pickup point' : 'You are on your way to your destination'}</h1>

            <hr />

            <div className="w-full flex flex-col  gap-2  ">
                <p>Ride Details</p>
                <p>Dropoff: <span>{booking.dropoff.address}</span></p>
                <p>Fare: <span>P50.00</span></p>

                <hr />
                <p>Driver Details</p>
                <p>Rider: <span>{booking.driver.firstName}</span></p>
            </div>
        </div>
    )
}