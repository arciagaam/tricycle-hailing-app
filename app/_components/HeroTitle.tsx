import Image from 'next/image'
import React from 'react'
import { } from 'react-icons'

export default function HeroTitle() {
    return (
        <div className='flex flex-col gap-2 w-full items-center justify-center'>
            <Image src="/logo.png" alt="logo" width={40} height={40} unoptimized/>
            <h1 className='text-primary font-black text-2xl tracking-tighter leading-none'>
                SBU TodaTracker
            </h1>
        </div>
    )

}
