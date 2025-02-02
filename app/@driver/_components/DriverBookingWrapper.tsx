'use client'

import React, { useEffect, useState } from 'react'
import DriverCurrentBooking from './DriverCurrentBooking'
import DriverAvailableBookings from './DriverAvailableBookings'
import { z } from 'zod';
import { baseUserSchema } from '@/lib/schema';
import { socket } from '@/socket';

export default function DriverBookingWrapper({ booking, bookings, user }: { booking: any, bookings: any, user: z.infer<typeof baseUserSchema> }) {

    const [currentBooking, setCurrentBooking] = useState(booking);
    const [currentBookings, setCurrentBookings] = useState(bookings);

    useEffect(() => {
        socket.on('new_booking', (booking) => {
            setCurrentBookings((prev) => ([...prev, booking]))
        })

        socket.on('accepted_booking', (booking) => {
            setCurrentBooking(booking)
            setCurrentBookings((prev) => ([...prev, prev.filter(prevFilter => prevFilter.id != booking.id)]))
        })

        socket.on('pickup_passenger', (booking) => {
            setCurrentBooking(booking)
        })

        socket.on('dropoff_passenger', (booking) => {
            setCurrentBooking(booking)
        })

        return () => {
            socket.off('new_booking')
            socket.off('accepted_booking')
            socket.off('pickup_passenger')
            socket.off('dropoff_passenger')
        }
    }, []);

    return currentBooking ? <DriverCurrentBooking booking={currentBooking} /> : <DriverAvailableBookings bookings={currentBookings} user={user} />


}
