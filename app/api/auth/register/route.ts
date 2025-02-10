import { genSaltSync, hashSync } from "bcrypt-ts";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    

    try {
        const data = await req.json();

        data.password = hashSync(data.password, genSaltSync(10))
        data.roleId = 3
    
        console.log(data)
        const user = await prisma.user.create({
            data: data

        });

        return NextResponse.json({ message: 'User succefully registerd', data: user }, { status: 201 });

    } catch (error) {
        if (error instanceof Error) return NextResponse.json({ message: error.message }, { status: 400 });

        return NextResponse.json({ message: 'Something went wrong while registering' }, { status: 400 });
    }

}