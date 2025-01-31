'use client'
import { Input } from '@/components/ui/input'
import React from 'react'

export default function SearchDropOff() {
    
    const debounceSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTimeout(() => {
            console.log(e.target.value)
        }, 1000)
    }

    return (
        <Input
            name='drop-off'
            id='drop-off'
            className='shadow-none focus:!border focus:border-primary focus-visible:ring-0 overflow-ellipsis'
            onChange={(e) => debounceSearch(e)}
            placeholder="Select drop off location"
        />

    )
}
