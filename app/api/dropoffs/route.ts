import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const filters: Record<string, unknown> = {};

        if (searchParams.has('name')) {
            filters.name = { contains: searchParams.get('name') }
        }

        if (searchParams.has('status')) {
            filters.status = searchParams.get('status')
        }

        const dropoffs = await prisma.dropOff.findMany({
            where: Object.keys(filters).length ? filters : undefined
        });

        return NextResponse.json({ message: 'Dropoff successfully created', data: dropoffs }, { status: 200 });


    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 401 });
        }

        return NextResponse.json({ message: 'Something went wrong while fetching dropoffs' }, { status: 401 });
    }
}

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