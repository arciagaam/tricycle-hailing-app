
import React from 'react'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken'
import { z } from 'zod';
import { baseUserSchema } from '@/lib/schema';
import PassengerBooking from './_components/PassengerBooking';

export default async function PassengerHomepage() {

  const cookiesStore = await cookies();
  const user = cookiesStore.get('auth')

  const decodedUser = jwt.decode(user!.value) as z.infer<typeof baseUserSchema>;

  const booking = await prisma.booking.findFirst({
    where: {
      passengerId: decodedUser.id,
    },
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      dropoff: true,
      driver: true,
      passenger: true
    }
  })

  return (
    <div className='w-full h-full flex flex-col gap-2'>
      <PassengerBooking currentBooking={booking} currentUser={decodedUser} />
    </div>
  )
}
