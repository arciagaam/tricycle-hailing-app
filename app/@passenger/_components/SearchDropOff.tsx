'use client'
import { Input } from '@/components/ui/input'
import { baseDropOffSchema } from '@/lib/schema';
import React, { useEffect, useRef, useState } from 'react'
import { z } from 'zod';

type TSearchDropOff = {
    getFetchedDropoffs: (dropoffs: z.infer<typeof baseDropOffSchema>[]) => void; 
    setDropoffs: React.Dispatch<React.SetStateAction<z.infer<typeof baseDropOffSchema>[]|null|undefined>>;
}

export default function SearchDropOff({ getFetchedDropoffs, setDropoffs }: TSearchDropOff) {

    const [value, setValue] = useState<string | null>(null)


    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    const debounceSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
        debounceTimeout.current = setTimeout(() => {
            setValue(e.target.value)
        }, 500); // Reduced to 500ms for better UX
    };

    useEffect(() => {
        if (value) {
            const getDropoffs = async () => {

                if (value) {
                    const res = await fetch(`api/dropoffs?name=${value}`)

                    if (res.ok) {

                        const resDropoff = await res.json();

                        getFetchedDropoffs(resDropoff.data)
                    }
                    // console.log(dropoffs)
                }
            }

            getDropoffs();
        } else {
            setDropoffs(null)
        }
    }, [value])

    return (
        <Input
            name='drop-off'
            id='drop-off'
            className='shadow-none focus:!border focus:border-primary focus-visible:ring-0 overflow-ellipsis'
            onChange={debounceSearch}
            placeholder="Select drop off location"
        />

    )
}
