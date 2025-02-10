import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const roles = await prisma.role.findMany();
        return NextResponse.json({ message: 'Dropoff successfully fetched', data: roles }, { status: 200 });

    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 400 });
        }

        return NextResponse.json({ message: 'Something went wrong while fetching roles' }, { status: 400 });
    }
}