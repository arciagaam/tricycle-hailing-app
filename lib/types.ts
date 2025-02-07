import { Booking, Dropoff, User } from "@prisma/client"

export type BookingWithRelations = Booking & {
    dropoff: Dropoff,
    passenger: User,
    driver: User,
}