'use client'
import { cn } from '@/lib/utils'
import React from 'react'

export default function ElipsisLoading({className}: {className?: string}) {
    return (
        <div className={cn('inline-flex ml-1 gap-0.5', className)}>
            <span className='animate-fade-in-out'>.</span>
            <span className='animate-fade-in-out delay-300'>.</span>
            <span className='animate-fade-in-out delay-700'>.</span>
        </div>
    )
}
