'use client'

import React, { useEffect, useState } from 'react'
import DriverCurrentBooking from './DriverCurrentBooking'
import DriverAvailableBookings from './DriverAvailableBookings'
import { socket } from '@/socket';
import { BookingWithRelations } from '@/lib/types';
import { User } from '@prisma/client';

export default function DriverBookingWrapper({ booking, bookings, user }: { booking: BookingWithRelations, bookings: BookingWithRelations[], user: User }) {
    const [currentBooking, setCurrentBooking] = useState<BookingWithRelations | null>(booking);
    const [currentBookings, setCurrentBookings] = useState<BookingWithRelations[]>(bookings);

    useEffect(() => {
        if (currentBooking) {
            socket.emit('reconnect', booking)
        }

        socket.on('new_booking', (booking) => {
            setCurrentBookings((prev) => ([...prev, booking]))
        })

        socket.on('accepted_booking', (booking) => {
            setCurrentBooking(booking);
            setCurrentBookings((prev) => prev.filter(prevFilter => prevFilter.id !== booking.id));
        });

        socket.on('pickup_passenger', (booking) => {
            setCurrentBooking(booking)
        })

        socket.on('dropoff_passenger', (booking) => {
            setCurrentBooking(booking)
        })

        socket.on('booking_cancelled', (booking) => {
            setCurrentBooking(null)
            setCurrentBookings(prev => ([...prev.filter(prevBookings => prevBookings.id != booking.id)])) 
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
