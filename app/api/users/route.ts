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
  const data = await req.json();
  data.password =  hashSync(data.password, genSaltSync(10))
  const newUser = await prisma.user.create(data);
  return NextResponse.json(newUser, { status: 201 });
}