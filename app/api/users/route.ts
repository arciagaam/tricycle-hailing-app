import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { genSaltSync, hashSync } from "bcrypt-ts";

const prisma = new PrismaClient();

export async function GET() {
  const users = await prisma.user.findMany({
    include: {
      role: true
    }
  });
  return NextResponse.json(users);
}

export async function POST(req: Request) {

  try {
    const data = await req.json();


    data.password = hashSync(data.username, genSaltSync(10))
    const newUser = await prisma.user.create({ data: data });

    return NextResponse.json(newUser, { status: 201 });

  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Something went wrong while creating user' }, { status: 400 });
  }


}

export async function PATCH(req: Request) {
  try {
    const data = await req.json()

    const dropoff = await prisma.user.update({
      where: {
        id: data.id,
      },
      data: { ...data },
    });

    return NextResponse.json({ message: 'User successfully updated', data: dropoff }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Something went wrong while updating user' }, { status: 400 });
  }
}