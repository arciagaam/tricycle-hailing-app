import { z } from "zod"

const dropOffStatusEnum = z.enum(['ACTIVE', 'DISABLED']);
const bookingStatusEnum = z.enum(['PENDING', 'ACCEPTED', 'ONGOING', 'COMPLETED', 'CANCELLED'])

export const baseDropOffSchema = z.object({
    id: z.coerce.number(),
    name: z.string(),
    longitude: z.string(),
    latitude: z.string(),
    status: dropOffStatusEnum.default("ACTIVE"),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime().nullable(),
    deletedAt: z.string().datetime().nullable(),
})

export const roleSchema = z.object({
    id: z.coerce.number(),
    name: z.string(),
})

export const baseUserSchema = z.object({
    id: z.coerce.number(),
    username: z.string(),
    password: z.string(),
    firstName: z.string(),
    middleName: z.string().optional(),
    lastName: z.string().optional(),
    role: roleSchema,
    roleId: z.coerce.number(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime().nullable(),
    deletedAt: z.string().datetime().nullable(),
})

export const baseBookingSchema = z.object({
    id: z.coerce.number(),
    dropOffId: z.coerce.number(),
    dropOff: baseDropOffSchema,
  
    driverId: z.number().int().positive(),
    driver: baseUserSchema,
  
    passengerId: z.number().int().positive(),
    passenger: baseUserSchema,
  
    status: bookingStatusEnum,
    pickupTime: z.string().datetime(),
    dropoffTime: z.string().datetime(),
    createdAt: z.string().datetime(),
})


export const userBookingRelationSchema = baseUserSchema.extend({
    bookingsAsDriver: z.array(baseBookingSchema),
    bookingsAsPassenger: z.array(baseBookingSchema)
})

export const dropOffBookingRelationSchema = baseDropOffSchema.extend({
    bookings: z.array(baseBookingSchema)
})

export const loginSchema = baseUserSchema.pick({
    username: true,
    password: true
})