import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'
import { baseUserSchema } from '@/lib/schema'
import { z } from 'zod'
import { cookies } from 'next/headers'
import DriverBookingWrapper from './_components/DriverBookingWrapper'

export default async function DriverHomepage() {

  const cookiesStore = await cookies();
  const user = cookiesStore.get('auth')

  const decodedUser = jwt.decode(user!.value) as z.infer<typeof baseUserSchema>;

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

  return <DriverBookingWrapper booking={booking} bookings={bookings} user={decodedUser} />


}
