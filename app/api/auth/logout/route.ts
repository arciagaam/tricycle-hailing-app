import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {

    try {
        const cookieStore = await cookies();
        cookieStore.delete('auth')

        return NextResponse.json({ message: 'User logged out' }, { status: 200 });
    } catch (error) {
        if (error instanceof Error) return NextResponse.json({ message: error.message }, { status: 400 });

        return NextResponse.json({ message: 'Invalid username or password' }, { status: 400 });
    }
}