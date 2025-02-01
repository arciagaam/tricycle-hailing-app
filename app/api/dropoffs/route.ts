import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

    try {
        const data = await req.json()

        const dropoff = await prisma.dropOff.create({
            data: { ...data, status: 'ACTIVE' }
        });

        return NextResponse.json({ message: 'Dropoff successfully created', data: dropoff }, { status: 201 });

    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 401 });
        }

        return NextResponse.json({ message: 'Something went wrong while creating dropoff' }, { status: 401 });

    }

}