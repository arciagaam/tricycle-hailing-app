import { z } from "zod"

const dropoffStatusEnum = z.enum(['ACTIVE', 'DISABLED']);
const bookingStatusEnum = z.enum(['PENDING', 'ACCEPTED', 'ONGOING', 'COMPLETED', 'CANCELLED'])

export const baseDropOffSchema = z.object({
    id: z.coerce.number(),
    name: z.string().min(1, 'Required'),
    address: z.string().min(1, 'Required'),
    longitude: z.string(),
    latitude: z.string(),
    status: dropoffStatusEnum.default("ACTIVE"),
    fare: z.string().min(1, 'Required'),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime().nullable(),
    deletedAt: z.string().datetime().nullable(),
})

export const createDropoffSchema = baseDropOffSchema.omit({
    id: true,
    status: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
})

export const editDropoffSchema = baseDropOffSchema.omit({
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
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

export const registerUserSchema = baseUserSchema.omit({
    id: true,
    role: true,
    roleId: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
})

export const createUserSchema = baseUserSchema.omit({
    id: true,
    role: true,
    password: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
})

export const editUserSchema = baseUserSchema.omit({
    password: true,
    role: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
})

export const baseBookingSchema = z.object({
    id: z.coerce.number(),
    dropoffId: z.coerce.number(),
    dropoff: baseDropOffSchema,

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

export const dropoffBookingRelationSchema = baseDropOffSchema.extend({
    bookings: z.array(baseBookingSchema)
})

export const loginSchema = baseUserSchema.pick({
    username: true,
    password: true
})