'use client'

import { Input } from '@/components/ui/input'
import React, { useEffect, useState } from 'react'
import { CiMenuKebab } from 'react-icons/ci'
import { MdPinDrop, MdSchool } from 'react-icons/md'
import SearchDropOff from './SearchDropOff'
import GoogleMaps from '@/components/google-maps/GoogleMaps'
import GoogleMapsDirections from '@/components/google-maps/GoogleMapsDirections'
import { Button } from '@/components/ui/button'
import { socket } from '@/socket'
import { ResponsiveProvider } from '@/hooks/useResponsive'
import { BookingWithRelations } from '@/lib/types'
import { Dropoff, User } from '@prisma/client'
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { FaMotorcycle, FaSchool } from 'react-icons/fa'
import { Spinner } from '@/app/_components/Spinner'
import toast from 'react-hot-toast'


const bookingStatuses = [
    'booking',
    'accepted',
    'ongoing',
]

export default function PassengerBooking({ currentBooking, currentUser }: {
    currentBooking: BookingWithRelations | null,
    currentUser: User
}) {

    const [booking, setBooking] = useState(currentBooking);
    const [selectedDropoff, setSelectedDropoff] = useState<Dropoff | null>();
    const [dropoffs, setDropoffs] = useState<Dropoff[] | null>();
    const [selectDropoffOpen, setSelectDropoffOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false);
    const [passengerDroppedOff, setPassengerDroppedOff] = useState(false);

    const getFetchedDropoffs = (value: Dropoff[]) => {
        setDropoffs(value);
        setSelectDropoffOpen(true)
    }

    useEffect(() => {
        if (currentBooking) {
            if (currentBooking.status == 'BOOKING' || currentBooking.status == 'ONGOING' || currentBooking.status != 'ACCEPTED') {
                setSelectedDropoff(currentBooking.dropoff)
            }

            setSelectedDropoff(null)
        }
    }, [currentBooking])

    useEffect(() => {
        if (booking) {
            socket.emit('reconnect', booking)
        }

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
            setPassengerDroppedOff(true)
        })

        return () => {
            socket.off('new_booking')
            socket.off('accepted_booking')
            socket.off('pickup_passenger')
            socket.off('dropoff_passenger')
        }
    }, [])

    const handleSelectDropoff = (dropoff: Dropoff) => {
        setSelectDropoffOpen(false)
        setSelectedDropoff(dropoff)
    }

    const onBookingSubmit = async () => {
        if (!selectedDropoff) return toast('Select a dropoff')
        setIsLoading(true);

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

        setIsLoading(false)
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

            <div className='h-full relative flex flex-col'>
                <ResponsiveProvider>
                    {
                        selectedDropoff ? <GoogleMapsDirections destination={{ lat: parseFloat(selectedDropoff.latitude), lng: parseFloat(selectedDropoff.longitude) }} /> : <GoogleMaps />
                    }
                </ResponsiveProvider>


                <div className={`flex flex-col w-full h-fit absolute ${(booking && bookingStatuses.includes(booking?.status.toLowerCase())) ? 'bottom-0' : 'bottom-4'}`}>

                    {
                        (booking?.status == 'COMPLETED' && passengerDroppedOff) && <CompletedScreen booking={booking} />
                    }
                    
                    {
                        booking && bookingStatuses.includes(booking?.status.toLowerCase()) && <GetCurrentStatusScreen booking={booking} />
                    }

                    {
                        (!booking || (booking && !bookingStatuses.includes(booking?.status.toLowerCase()))) &&
                        <div className="flex flex-col gap-2 w-[90%] justify-self-center self-center items-center">
                            {
                                (selectDropoffOpen && dropoffs) &&

                                <div className="flex flex-col absolute  bottom-[105%] p-4 bg-background w-[90%] rounded-md gap-2">
                                    <p className='text-black/50 text-sm'>Select dropoff</p>
                                    <div className="flex flex-col">
                                        {
                                            dropoffs?.map((dropoff) => (
                                                <button onClick={() => handleSelectDropoff(dropoff)} key={dropoff.id} className="flex flex-col items-start text-left">
                                                    <span>
                                                        {dropoff.name}
                                                    </span>
                                                    <span className='text-sm text-black/50'>
                                                        {dropoff.address}
                                                    </span>
                                                </button>
                                            ))
                                        }
                                    </div>
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

                                <div className='flex flex-col gap-2 w-full max-w-full'>

                                    <Input
                                        className='text-muted-foreground text-ellipsis border-none shadow-none focus:border-none focus-visible:ring-0'
                                        value={'San Beda University - Rizal | Taytay'}
                                        readOnly
                                    />
                                    <SearchDropOff getFetchedDropoffs={getFetchedDropoffs} setDropoffs={setDropoffs} onFocus={() => setSelectDropoffOpen(true)} />
                                </div>
                            </div>
                            <Button onClick={onBookingSubmit} className='w-full focus:bg-primary/80'>
                                Book
                            </Button>

                        </div>
                    }
                </div>

            </div>
        </>
    )
}

const GetCurrentStatusScreen = ({ booking }: { booking: BookingWithRelations }) => {

    switch (booking.status.toLowerCase()) {
        case 'booking': return <BookingScreen booking={booking} />;
        case 'accepted': return <InProgressScreen booking={booking} />;
        case 'ongoing': return <InProgressScreen booking={booking} />;
        default: return <BookingScreen booking={booking} />;
    }
}


const BookingScreen = ({ booking }: { booking: BookingWithRelations }) => {
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
        <Drawer>
            <DrawerTrigger asChild>
                {/* //TODO: ALLEN DITO MO LAGAY YUNG ANIMATION, TAS LAGYAN MO TEXT NG CURRENT STATUS  */}

                <Button className='flex flex-col h-fit py-6 rounded-b-none'>
                    <p>ANIMATION</p>
                    <p>Looking for riders...</p>
                    <p>Click to view details</p>
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle> Looking for drivers . . .</DrawerTitle>
                </DrawerHeader>

                <div className="w-full flex flex-col rounded-md gap-2 p-4 bg-background">
                    <p className='text-muted-foreground'>Ride Details</p>

                    <p>Dropoff to <span>{booking?.dropoff?.address}</span></p>
                    <p><span>P50.00</span></p>

                    <hr />

                    <div>

                        {/* {count === 1 && <p>.</p>}
                {count === 2 && <p>..</p>}
                {count === 3 && <p>...</p>} */}
                    </div>

                </div>

                <DrawerFooter>
                    <Button variant={'destructive'}>Cancel Booking</Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>

    )
}

const InProgressScreen = ({ booking }: { booking: BookingWithRelations }) => {
    return (
        <Drawer>
            <DrawerTrigger asChild>
                {/* //TODO: ALLEN DITO MO LAGAY YUNG ANIMATION, TAS LAGYAN MO TEXT NG CURRENT STATUS  */}
                <Button className='flex flex-col h-fit py-6 rounded-b-none'>
                    <div className='flex flex-row items-center justify-between relative p-2 w-[180px] pb-4'>
                        <FaSchool className='absolute left-0 animate-in text-lg' />
                        <FaMotorcycle className='absolute left-0 animate-moveRight text-lg' />
                        <MdPinDrop className='absolute right-0 animate-bounce text-lg' />
                    </div>
                    <h1>{booking.status.toLowerCase() == 'accepted' ? 'Driver is on its way to your pickup point' : 'You are on your way to your destination'}</h1>
                    <p>Click to view details</p>
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>
                        {booking.status.toLowerCase() == 'accepted' ? 'Driver is on its way to your pickup point' : 'You are on your way to your destination'}
                    </DrawerTitle>
                </DrawerHeader>

                <div className="w-full flex flex-col bg-background rounded-md p-4 gap-5">
                    <p>Ride Details</p>
                    <p>Dropoff: <span>{booking.dropoff.address}</span></p>
                    <p>Fare: <span>P50.00</span></p>

                    <hr />
                    <p>Driver Details</p>
                    <p>Rider: <span>{booking.driver.firstName}</span></p>
                </div>
            </DrawerContent>
        </Drawer>
    )
}

const CompletedScreen = ({ booking }: { booking: BookingWithRelations }) => {

    console.log(booking)

    return (
        <div className="fixed inset-0 overflow-auto bg-red-500">
            {/* TODO: allen design here */}
        </div>
    )
}