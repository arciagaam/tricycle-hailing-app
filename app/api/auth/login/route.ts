import { PrismaClient } from "@prisma/client";
import { compareSync } from "bcrypt-ts";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function POST(req: Request) {

    const cookiesStore = await cookies()

    try {
        const { username, password: inputPassword } = await req.json();

        const user = await prisma.user.findUniqueOrThrow({
            where: {
                username: username
            },
            omit: {
                createdAt: true,
                updatedAt: true,
                deletedAt: true,
            },
            include: {
                role: true
            }
        });

        const passwordCheck = compareSync(inputPassword, user.password);

        if (!passwordCheck) throw new Error('Invalid username or password');


        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...returnUser } = user;

        const token = jwt.sign(
            returnUser,
            process.env.JWT_SECRET as string,
            { expiresIn: '1h' }
        );

        cookiesStore.set('auth', token, {
            maxAge: 30 * 24 * 60 * 60, // 30 days
            path: '/',
        });

        return NextResponse.json({ token, user: returnUser }, { status: 200 });

    } catch (error) {
        if (error instanceof Error) return NextResponse.json({ message: error.message }, { status: 400 });

        return NextResponse.json({ message: 'Invalid username or password' }, { status: 400 });
    }

}