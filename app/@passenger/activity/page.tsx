import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import { MdPinDrop, MdSchool } from 'react-icons/md'

export default function ActivityPage() {
    return (
        <div className='bg-background w-full h-full'>
            <div className='px-16 py-5 flex items-center'>
                <h1 className='text-lg font-bold px-4'>Activity history</h1>
            </div>
            <div className='flex flex-col items-start justify-center'>
                <div className='flex flex-col gap-2 w-full'>
                    {/* for each booking */}
                    <div>
                        <p className='p-4 text-base'>February 2</p>
                        <div className={`border-y border-collapse border-muted-foreground/50 flex flex-col gap-2 h-full min-w-dvw p-4`}>
                            <span className='text-muted-foreground flex justify-between'>
                                <p className='font-bold text-lg'>Booking #1234567890</p>
                                <p className='text-muted-foreground'>100 Php</p>
                            </span>
                            <div className='flex flex-col gap-2'>
                                <p className='flex items-center gap-2'>
                                    <MdSchool size={24} />
                                    San Beda University - Rizal
                                </p>
                                <p className='flex items-center gap-2'>
                                    <MdPinDrop size={24} />
                                    Montserrat Villa
                                </p>
                            </div>
                            <span className='flex justify-between items-center'>
                                <p className='text-muted-foreground'>11:32 AM - 11:45 AM</p>
                                <Link href={`/activity/${1}`}>
                                    <Button className='bg-primary hover:primary/80 text-white'>View Details</Button>
                                </Link>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
