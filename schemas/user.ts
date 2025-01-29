import { z } from "zod";

export const baseUserSchema = z.object({
    id: z.coerce.number(),
    username: z.string(),
    password: z.string(),
    firstName: z.string(),
    middleName: z.string().optional(),
    lastName: z.string().optional(),
    // role: ,
    roleId: z.coerce.number(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    deletedAt: z.string().datetime(),
    // bookingsAsDriver: 
    // bookingsAsPassenger: 
})

export const createUserSceham = baseUserSchema.omit({
    id: true,
    role: true,
})
