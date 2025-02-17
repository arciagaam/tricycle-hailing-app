'use client'

import { Input } from '@/components/ui/input'
import React, { SetStateAction, useEffect, useState } from 'react'
import { CiMenuKebab } from 'react-icons/ci'
import { MdCheckCircle, MdPinDrop, MdSchool, MdSearch } from 'react-icons/md'
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { handleFullName, toTitleCase } from '@/lib/utils'
import ElipsisLoading from '@/app/_components/ElipsisLoading'


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
    const [selectedFareType, setSelectedFareType] = useState<'specialFare' | 'multipleFare' | null>(null);

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

        socket.on('booking_cancelled', () => {
            setBooking(null)
            setSelectedDropoff(null)
            toast.error('Driver cancelled')
        })

        return () => {
            socket.off('new_booking')
            socket.off('accepted_booking')
            socket.off('pickup_passenger')
            socket.off('dropoff_passenger')
            socket.off('booking_cancelled')
        }
    }, [])

    const handleSelectDropoff = (dropoff: Dropoff) => {
        setSelectDropoffOpen(false)
        setSelectedDropoff(dropoff)
    }

    const handleFareTypeSelect = (type: 'specialFare' | 'multipleFare') => {
        setSelectedFareType(type)
    }

    const onBookingSubmit = async () => {
        if (!selectedDropoff) return toast('Select a dropoff')
        if (!selectedFareType) return toast('Select a fare type')

        setIsLoading(true);

        const res = await fetch('api/bookings', {
            method: 'POST',
            body: JSON.stringify({
                dropoffId: selectedDropoff?.id,
                passengerId: currentUser.id,
                fare: selectedFareType == 'multipleFare' ? String(selectedDropoff.multipleFare) : String(selectedDropoff.specialFare),
                fareType: selectedFareType == 'multipleFare' ? 'MULTIPLE' : 'SPECIAL'
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
                        selectedDropoff ? <GoogleMapsDirections destination={{ lat: parseFloat(selectedDropoff.latitude), lng: parseFloat(selectedDropoff.longitude) }} /> : <GoogleMaps disableClick={true} />
                    }
                </ResponsiveProvider>


                <div className={`flex flex-col w-full h-fit absolute ${(booking && bookingStatuses.includes(booking?.status.toLowerCase())) ? 'bottom-0' : 'bottom-4'}`}>

                    {
                        (booking?.status == 'COMPLETED' && passengerDroppedOff) && <CompletedScreen booking={booking} setPassengerDroppedOff={setPassengerDroppedOff} />
                    }

                    {
                        booking && bookingStatuses.includes(booking?.status.toLowerCase()) && <GetCurrentStatusScreen booking={booking} />
                    }

                    {
                        (!booking || (booking && !bookingStatuses.includes(booking?.status.toLowerCase()))) &&
                        <div className="flex flex-col gap-2 w-[90%] justify-self-center self-center items-center">
                            {
                                (selectDropoffOpen && dropoffs) &&

                                <div className="flex flex-col absolute bottom-[105%] bg-background w-[90%] rounded-md">
                                    <p className='text-black/50 text-sm p-4'>Select dropoff</p>
                                    <div className="flex flex-col">
                                        {
                                            dropoffs.length > 0 ? dropoffs?.map((dropoff) => (
                                                <button onClick={() => handleSelectDropoff(dropoff)} key={dropoff.id} className="flex flex-col items-start text-left hover:bg-muted py-2 px-4">
                                                    <span>
                                                        {dropoff.name}
                                                    </span>
                                                    <span className='text-sm text-inactive'>
                                                        {dropoff.address}
                                                    </span>
                                                </button>
                                            )) : (
                                                <span className='text-inactive p-4'>No results</span>
                                            )
                                        }
                                    </div>
                                </div>
                            }
                            <div className='w-full flex flex-col rounded-md gap-2 p-4 bg-background'>

                                <div className="flex gap-2">

                                    <div className='flex flex-col gap-0.5 justify-center items-center'>
                                        <MdSchool size={24} className='min-w-[20px]' />
                                        <CiMenuKebab />
                                        <label htmlFor='drop-off'>
                                            <MdPinDrop size={24} className='min-w-[20px] text-primary' />
                                        </label>
                                    </div>

                                    <div className='flex flex-col gap-2 w-full max-w-full'>
                                        <Input
                                            className='text-inactive text-ellipsis border-none shadow-none focus:border-none focus-visible:ring-0'
                                            value={'San Beda University - Rizal | Taytay'}
                                            readOnly
                                        />

                                        <SearchDropOff getFetchedDropoffs={getFetchedDropoffs} setDropoffs={setDropoffs} onFocus={() => setSelectDropoffOpen(true)} selectedDropoff={selectedDropoff || null} />

                                    </div>
                                </div>

                                {
                                    selectedDropoff &&
                                    <div className="flex flex-col mt-5 gap-2">
                                        <p className='text-sm text-inactive'>Select Fare Type</p>
                                        <RadioGroup onValueChange={handleFareTypeSelect}>
                                            {
                                                selectedDropoff.specialFare &&
                                                <div className="flex items-center gap-2 w-full">
                                                    <RadioGroupItem value="specialFare" id="specialFare" />
                                                    <Label htmlFor="specialFare">Special (1-2 Person)</Label>
                                                    <p className='ml-auto text-sm'>P {Number(selectedDropoff.specialFare).toLocaleString()}</p>
                                                </div>
                                            }

                                            {
                                                selectedDropoff.multipleFare &&
                                                <div className="flex items-center gap-2">
                                                    <RadioGroupItem value="multipleFare" id="multipleFare" />
                                                    <Label htmlFor="multipleFare">3 Person Up</Label>
                                                    <p className='ml-auto text-sm'>P {Number(selectedDropoff.multipleFare).toLocaleString() + " each"} </p>
                                                </div>
                                            }
                                        </RadioGroup>
                                    </div>
                                }

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
    
    return (
        <Drawer>
            <DrawerTrigger asChild>
                {/* //TODO: ALLEN DITO MO LAGAY YUNG ANIMATION, TAS LAGYAN MO TEXT NG CURRENT STATUS  */}

                <Button className='flex flex-col justify-center h-fit py-6 rounded-b-none'>
                    <p className='text-lg'>{toTitleCase(booking.status)}</p>
                    <div className='flex flex-row items-center justify-between relative p-2 w-[180px] pb-4'>
                        <MdSearch className='text-lg animate-moveRight' />
                    </div>
                    <span className='flex'>
                        Looking for riders
                        <ElipsisLoading />
                    </span>
                    <p>Click to view details</p>
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>
                        Looking for riders
                        <ElipsisLoading />
                    </DrawerTitle>
                </DrawerHeader>

                <div className="w-full flex flex-col rounded-md gap-2 p-4 bg-background">
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
                </div>

                <DrawerFooter>
                    <Button onClick={handleCancelBooking} variant={'secondary'}>Cancel Booking</Button>
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
                    <p className='text-xl'>{toTitleCase(booking.status)}</p>
                    <div className={`flex flex-row items-center justify-between relative p-2 w-[180px] pb-4 ${booking.status.toLowerCase() === 'accepted' ? '-scale-x-100' : ''}`}>
                        <MdPinDrop className={`absolute ${booking.status.toLowerCase() === 'accepted' ? 'left-0' : 'right-0 animate-bounce'} text-lg`} />
                        <FaMotorcycle className='absolute left-0 animate-moveRight text-lg' />
                        <FaSchool className={`absolute ${booking.status.toLowerCase() === 'accepted' ? ' animate-bounce right-0' : 'left-0'} text-lg`} />
                    </div>
                    <h1>{booking.status.toLowerCase() == 'accepted' ? 'Driver is on its way to your pickup point' : 'You are on your way to your destination'}</h1>
                    <p>Click to view details</p>
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>
                        <>
                            {booking.status.toLowerCase() == 'accepted' ? 'Driver is on its way to your pickup point' : 'You are on your way to your destination'}
                            <ElipsisLoading />
                        </>
                    </DrawerTitle>
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
                        <p className='text-sm text-inactive'>Driver Name</p>
                        <span>{
                            handleFullName({
                                firstName: booking.driver.firstName,
                                middleName: booking.driver.middleName,
                                lastName: booking.driver.lastName
                            })}
                        </span>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
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
                    <p className='text-sm font-medium text-inactive'>Driver</p>
                    <p>{handleFullName({ firstName: booking?.driver?.firstName, middleName: booking?.driver?.middleName, lastName: booking?.driver?.lastName })}</p>
                </div>


                <Button onClick={() => setPassengerDroppedOff(false)} className='w-full mt-auto'>Back to Home</Button>

            </div>
            {/* TODO: allen design here */}
        </div>
    )
}