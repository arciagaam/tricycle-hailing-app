import { prisma } from "@/lib/prisma";
import { compareSync, genSaltSync, hashSync } from "bcrypt-ts";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
import { User } from "@prisma/client";

export async function POST(req: Request) {
    const cookiesStore = await cookies();

    try {
        const authUser = cookiesStore.get('auth')

        if (!authUser) throw new Error('Invalid request');

        const decodedUser = jwt.decode(authUser.value) as User;

        const { currentPassword, newPassword } = await req.json();

        const userCheck = await prisma.user.findFirst({
            where: {
                id: decodedUser.id
            }
        })

        if (!userCheck) throw new Error('User not found')

        const passwordCheck = compareSync(currentPassword, userCheck.password);
        
        if(!passwordCheck) throw new Error('Old password does not match')

        const user = await prisma.user.update({
            where: {
                id: decodedUser.id
            },
            data: {
                password: hashSync(newPassword, genSaltSync(10))
            },
            omit: {
                createdAt: true,
                updatedAt: true,
                deletedAt: true,
                password: true
            },
            include: {
                role: true
            }
        });

        return NextResponse.json({ message: 'User successfully updated', user: user }, { status: 200 });

    } catch (error) {
        if (error instanceof Error) return NextResponse.json({ message: error.message }, { status: 400 });

        return NextResponse.json({ message: 'Something went wrong while updating this user' }, { status: 400 });
    }

}