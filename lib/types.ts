import { Booking, Dropoff, Role, User } from "@prisma/client"

export type BookingWithRelations = Booking & {
    dropoff: Dropoff,
    passenger: User,
    driver: User,
}

export type UserWithRelations = User & {
    role: Role
}