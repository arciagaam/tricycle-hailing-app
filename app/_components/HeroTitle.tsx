import React from 'react'
import { } from 'react-icons'
import { FaMotorcycle } from 'react-icons/fa'

export default function HeroTitle() {
    return (
        <div className='flex flex-col gap-2 w-full items-center justify-center'>
            <FaMotorcycle className='text-4xl font bold tracking-tighter leading-none text-primary' />
            <h1 className='text-primary font-black text-2xl tracking-tighter leading-none'>
                SBU TodaTracker
            </h1>
        </div>
    )

}
