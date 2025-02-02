import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {

    try {
        const data = await req.json()

        const dropoff = await prisma.dropoff.update({
            where: {
                id: data.id
            },
            data: {
                status: 'DISABLED'
            }
        })

        return NextResponse.json({ message: 'Dropoff status updated to DISABLED', data: dropoff }, { status: 200 });

    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 401 });
        }

        return NextResponse.json({ message: 'Something went wrong while updating dropoff status' }, { status: 401 });

    }

}