import Image from 'next/image'
import React from 'react'
import { } from 'react-icons'
import logo from '../../public/logo.png'

export default function HeroTitle() {
    return (
        <div className='flex flex-col gap-2 w-full items-center justify-center'>
            <Image src={logo} alt="logo" width={50} height={50} />
            <h1 className='text-primary font-black text-2xl tracking-tighter leading-none'>
                SBU TodaTracker
            </h1>
        </div>
    )

}
