'use client'

import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import { CiMenuKebab } from 'react-icons/ci'
import { MdPinDrop, MdSchool } from 'react-icons/md'
import SearchDropOff from './SearchDropOff'
import GoogleMaps from '@/components/google-maps/GoogleMaps'
import GoogleMapsDirections from '@/components/google-maps/GoogleMapsDirections'
import { baseDropOffSchema } from '@/lib/schema'
import { z } from 'zod'
import { Button } from '@/components/ui/button'

export default function BookingForm() {

    const [selectedDropoff, setSelectedDropoff] = useState<z.infer<typeof baseDropOffSchema> | null>(null);
    const [dropoffs, setDropoffs] = useState<z.infer<typeof baseDropOffSchema>[] | null>();

    const getFetchedDropoffs = (value: z.infer<typeof baseDropOffSchema>[]) => {
        setDropoffs(value);
    }

    return (
        <div className='h-full relative flex flex-col'>
            {
                selectedDropoff ? <GoogleMapsDirections destination={{ lat: parseFloat(selectedDropoff.latitude), lng: parseFloat(selectedDropoff.longitude) }} /> : <GoogleMaps />
            }
            <div className="flex flex-col w-[92dvw] h-fit absolute left-[4vw] bottom-[4dvh]">
                <div className="flex flex-col gap-2 w-full justify-self-center self-center">
                    {
                        dropoffs &&
                        <div className="flex flex-col absolute left-0 bottom-[100%] p-4 bg-white w-full">
                            {
                                dropoffs.map((dropoff) => (
                                    <button onClick={() => setSelectedDropoff(dropoff)} key={dropoff.id} className="flex">
                                        {dropoff.name}
                                    </button>
                                ))
                            }
                        </div>
                    }
                    <div className='w-full flex rounded-md gap-2 p-4 bg-background'>
                        <div className='flex flex-col gap-0.5 justify-center items-center'>
                            <MdSchool size={24} className='min-w-[20px]' />
                            <CiMenuKebab />
                            <label htmlFor='drop-off'>
                                <MdPinDrop size={24} className='min-w-[20px] text-primary' />
                            </label>
                        </div>

                        <div className='flex flex-col gap-2 w-full'>

                            <Input
                                className='text-muted-foreground text-ellipsis border-none shadow-none focus:border-none focus-visible:ring-0'
                                value={'San Beda University - Rizal | Taytay'}
                                readOnly
                            />
                            <SearchDropOff getFetchedDropoffs={getFetchedDropoffs} setDropoffs={setDropoffs}/>
                        </div>
                    </div>
                    <Button className='w-full focus:bg-primary/80'>
                        Book
                    </Button>

                </div>

            </div>
        </div>
    )
}
