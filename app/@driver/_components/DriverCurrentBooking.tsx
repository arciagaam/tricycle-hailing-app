'use client'

import { Spinner } from '@/app/_components/Spinner'
import GoogleMapsDirections from '@/components/google-maps/GoogleMapsDirections'
import { Button } from '@/components/ui/button'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { ResponsiveProvider } from '@/hooks/useResponsive'
import { BookingWithRelations } from '@/lib/types'
import { handleFullName, toTitleCase } from '@/lib/utils'
import { socket } from '@/socket'
import React, { SetStateAction, useState } from 'react'
import toast from 'react-hot-toast'
import { CiMenuKebab } from 'react-icons/ci'
import { FaMotorcycle, FaSchool } from 'react-icons/fa'
import { MdCheckCircle, MdPinDrop, MdSchool } from 'react-icons/md'


export default function DriverCurrentBooking({ booking }: { booking: BookingWithRelations }) {

    const [isLoading, setIsLoading] = useState(false)
    const [passengerDroppedOff, setPassengerDroppedOff] = useState(false);


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

    const handleCancelBooking = async () => {
        const res = await fetch(`/api/bookings`, {
            method: 'PATCH',
            body: JSON.stringify({
                id: booking.id,
                status: 'CANCELLED'
            })
        });

        if (!res.ok) return toast.error('Something went wrong while cancelling this booking. Try again')

        socket.emit('cancel_booking', booking)
        toast.success('Booking cancelled')
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
            setPassengerDroppedOff(true)
        }

        setIsLoading(false);

    }

    return (
        <>
            {isLoading &&
                <div className='fixed z-[999] bg-black/10 inset-0 flex flex-col items-center justify-center'>
                    <div className="flex flex-col rounded-md bg-white p-8">
                        <Spinner />
                    </div>
                </div>
            }

            {
                (booking?.status == 'COMPLETED' && passengerDroppedOff) ? <CompletedScreen booking={booking} setPassengerDroppedOff={setPassengerDroppedOff} /> :
                    <div className="flex flex-col w-full h-full">
                        <ResponsiveProvider>
                            <GoogleMapsDirections destination={{ lat: parseFloat(booking.dropoff.latitude), lng: parseFloat(booking.dropoff.longitude) }} />
                        </ResponsiveProvider>



                        <div className='flex flex-col w-full h-fit absolute bottom-0'>
                            <Drawer>
                                <DrawerTrigger asChild>
                                    <Button className='flex flex-col h-fit py-6 rounded-b-none'>
                                        <p>{booking.status}</p>
                                        <div className={`flex flex-row items-center justify-between relative p-2 w-[180px] pb-4 ${booking.status.toLowerCase() === 'accepted' ? '-scale-x-100' : ''}`}>
                                            <MdPinDrop className={`absolute ${booking.status.toLowerCase() === 'accepted' ? 'left-0' : 'right-0 animate-bounce'} text-lg`} />
                                            <FaMotorcycle className='absolute left-0 animate-moveRight text-lg' />
                                            <FaSchool className={`absolute ${booking.status.toLowerCase() === 'accepted' ? ' animate-bounce right-0' : 'left-0'} text-lg`} />
                                        </div>
                                        <h1>{booking.status.toLowerCase() == 'accepted' ? 'You are on your way to the pickup point' : 'You are on your way to your destination'}</h1>
                                        <p>Click to view details</p>
                                    </Button>
                                </DrawerTrigger>
                                <DrawerContent>
                                    <DrawerHeader>
                                        <DrawerTitle>Current Booking</DrawerTitle>
                                    </DrawerHeader>

                                    <div className="w-full flex flex-col bg-background rounded-md p-4 gap-5">
                                        <div className='flex gap-2 items-center'>
                                            <MdPinDrop className="text-4xl text-primary" />
                                            <span className='flex flex-col'>
                                                <p className='text-sm text-inactive'>Dropoff</p>
                                                <p>{booking?.dropoff?.name}</p>
                                            </span>
                                        </div>

                                        <hr />

                                        <div className='flex flex-col'>
                                            <p className='text-sm text-inactive'>Dropoff Address</p>
                                            <p >{toTitleCase(String(booking?.dropoff?.address))}</p>
                                        </div>
                                        <div className='flex flex-col'>
                                            <p className='text-sm text-inactive'>Fare</p>
                                            <p>P {booking.fareType == 'MULTIPLE' ? Number(booking.fare).toLocaleString() + ' each' : Number(booking.fare).toLocaleString()}</p>
                                        </div>
                                        <div className='flex flex-col'>
                                            <p className='text-sm text-inactive'>Fare Type</p>
                                            <p >{toTitleCase(String(booking.fareType))}</p>
                                        </div>

                                        <hr />
                                        <div className='flex flex-col'>
                                            <p className='text-sm text-inactive'>Passenger Name</p>
                                            <span>{
                                                handleFullName({
                                                    firstName: booking.passenger.firstName,
                                                    middleName: booking.passenger.middleName,
                                                    lastName: booking.passenger.lastName
                                                })}
                                            </span>
                                        </div>



                                        {
                                            booking.status == 'ACCEPTED' &&

                                            <div className="flex flex-col gap-2">
                                                <Button disabled={isLoading} onClick={pickupPassenger}>Pickup Passenger</Button>
                                                <Button variant={'secondary'} disabled={isLoading} onClick={handleCancelBooking}>Cancel Pickup</Button>
                                            </div>

                                        }



                                        {
                                            booking.status == 'ONGOING' && <Button disabled={isLoading} onClick={dropoffPassenger}>Dropoff Passenger</Button>
                                        }
                                    </div>
                                </DrawerContent>
                            </Drawer>


                        </div>
                    </div>
            }

        </>

    )
}

const CompletedScreen = ({ booking, setPassengerDroppedOff }: { booking: BookingWithRelations, setPassengerDroppedOff: React.Dispatch<SetStateAction<boolean>> }) => {

    return (
        <div className="fixed w-full inset-0 overflow-auto bg-black/50 z-[999] flex flex-col items-center justify-center lg:py-2">

            <div className="bg-white p-6 lg:px-16 lg:max-w-[70dvw] 2xl:max-w-[1400px] w-full h-full flex flex-col items-center rounded-lg gap-5">
                <span className='uppercase font-bold flex gap-2 text-lg items-center'>
                    <MdCheckCircle size={24} className='text-green-500 text-2xl' />
                    Completed
                </span>

                <hr className='w-full' />

                <div className="flex flex-col items-start gap-1 w-full">

                    <div className="flex gap-2 items-center">
                        <MdSchool className='min-w-[20px] text-2xl' />
                        <p className='font-medium text'>San Beda University - Rizal | Taytay</p>
                    </div>

                    <CiMenuKebab className='ml-1' />

                    <div className='flex gap-2 justify-center items-start'>
                        <MdPinDrop className='min-w-[20px] text-primary text-2xl' />
                        <div className="flex flex-col gap-1">
                            <p className='font-medium'>{booking.dropoff.name}</p>
                            <p className='text-sm text-inactive'>{booking.dropoff.address}</p>
                        </div>
                    </div>

                </div>

                <hr className='w-full' />

                <div className="flex flex-col w-full gap-5">
                    <div className="flex flex-col ">
                        <p className='text-sm font-medium text-inactive'>Fare Type</p>
                        <p>{booking.fareType == 'MULTIPLE' ? '3 Person Up' : 'Special'}</p>
                    </div>

                    <div className="flex flex-col">
                        <p className='text-sm font-medium text-inactive'>Fare</p>
                        <p>P {booking.fareType == 'MULTIPLE' ? `${Number(booking.fare).toLocaleString()} each` : `${Number(booking.fare).toLocaleString()}`}</p>
                    </div>
                </div>

                <hr className='w-full' />

                <div className="flex flex-col w-full">
                    <p className='text-sm font-medium text-inactive'>Passenger Details</p>
                    <p>{handleFullName({ firstName: booking?.passenger?.firstName, middleName: booking?.passenger?.middleName, lastName: booking?.passenger?.lastName })}</p>
                </div>


                <Button onClick={() => setPassengerDroppedOff(false)} className='w-full mt-auto'>Back to Home</Button>

            </div>
            {/* TODO: allen design here */}
        </div>
    )
}
