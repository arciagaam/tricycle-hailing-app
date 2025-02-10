import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const filters: Record<string, unknown> = {};

        if (searchParams.has('name')) {

            filters.OR = [
                {
                    name: {
                        contains: searchParams.get('name'),
                        mode: 'insensitive'
                    }
                },
                {
                    address: {
                        contains: searchParams.get('name'),
                        mode: 'insensitive'

                    }
                }
            ]
        }

        if (searchParams.has('status')) {
            filters.status = searchParams.get('status')
        }

        const dropoffs = await prisma.dropoff.findMany({
            where: Object.keys(filters).length ? filters : undefined,
            take: 5
        });

        return NextResponse.json({ message: 'Dropoff successfully fetched', data: dropoffs }, { status: 200 });


    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 400 });
        }

        return NextResponse.json({ message: 'Something went wrong while fetching dropoffs' }, { status: 400 });
    }
}

export async function POST(req: Request) {

    try {
        const data = await req.json()

        const dropoff = await prisma.dropoff.create({
            data: { ...data, status: 'ACTIVE' }
        });

        return NextResponse.json({ message: 'Dropoff successfully created', data: dropoff }, { status: 201 });

    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 400 });
        }

        return NextResponse.json({ message: 'Something went wrong while creating dropoff' }, { status: 400 });

    }

}

export async function PATCH(req: Request) {
    try {
        const data = await req.json()

        const dropoff = await prisma.dropoff.update({
            where: {
                id: data.id,
            },
            data: { ...data },
        });

        return NextResponse.json({ message: 'Dropoff successfully updated', data: dropoff }, { status: 201 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 400 });
        }

        return NextResponse.json({ message: 'Something went wrong while updating dropoff' }, { status: 400 });
    }
}