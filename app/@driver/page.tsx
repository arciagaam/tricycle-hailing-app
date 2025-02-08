import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import DriverBookingWrapper from './_components/DriverBookingWrapper'
import { User } from '@prisma/client'
import { BookingWithRelations } from '@/lib/types'

export default async function DriverHomepage() {

  const cookiesStore = await cookies();
  const user = cookiesStore.get('auth')

  const decodedUser = jwt.decode(user!.value) as User;

  const booking = await prisma.booking.findFirst({
    where: {
      status: { in: ['ACCEPTED', 'ONGOING'] },
      driverId: decodedUser.id
    },
    include: {
      dropoff: true,
      passenger: true,
      driver: true,
    }
  });

  const bookings = await prisma.booking.findMany({
    where: {
      status: 'BOOKING',
    },
    include: {
      dropoff: true,
      passenger: true
    }
  })

  return <DriverBookingWrapper booking={booking as BookingWithRelations} bookings={bookings as BookingWithRelations[]} user={decodedUser} />
}
