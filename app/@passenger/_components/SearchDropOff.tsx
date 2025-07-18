'use client'
import { Input } from '@/components/ui/input'
import { Dropoff } from '@prisma/client';
import React, { useEffect, useRef, useState } from 'react'

type TSearchDropOff = {
    getFetchedDropoffs: (dropoffs: Dropoff[]) => void;
    setDropoffs: React.Dispatch<React.SetStateAction<Dropoff[] | null | undefined>>;
    onFocus?: () => void;
    onBlur?: () => void;
    selectedDropoff?: Dropoff | null;
}

export default function SearchDropOff({ getFetchedDropoffs, setDropoffs, onFocus, onBlur }: TSearchDropOff) {

    const [value, setValue] = useState<string | null>()

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
            onFocus={onFocus}
            onBlur={onBlur}
        // value={String(selectedDropoff ? selectedDropoff.address : "")}
        />

    )
}
