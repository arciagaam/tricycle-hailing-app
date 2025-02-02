import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

    try {
        const data = await req.json()
        
        const booking = await prisma.booking.create({
            data: { ...data, status: 'BOOKING' },
            include: {
                dropoff: true,
                passenger: true,
                driver: true,
            }
        });

        return NextResponse.json({ message: 'Booking successfully created', data: booking }, { status: 201 });

    } catch (error) {
        console.log('ERROR', error)

        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 400 });
        }

        return NextResponse.json({ message: 'Something went wrong while creating booking' }, { status: 400 });
    }

}

export async function PATCH(req: Request) {
    try {
        const data = await req.json()

        const booking = await prisma.booking.update({
            where: {
                id: data.id,
            },
            data: { ...data },
            include: {
                dropoff: true,
                driver: true,
                passenger: true
            }
        });

        return NextResponse.json({ message: 'Booking successfully updated', data: booking }, { status: 201 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 400 });
        }

        return NextResponse.json({ message: 'Something went wrong while updating booking' }, { status: 400 });
    }
}