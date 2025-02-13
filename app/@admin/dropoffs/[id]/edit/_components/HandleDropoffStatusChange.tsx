'use client'

import { Spinner } from '@/app/_components/Spinner';
import { Button } from '@/components/ui/button';
import { Dropoff } from '@prisma/client'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

export default function HandleDropoffStatusChange({ dropoff }: { dropoff: Dropoff }) {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false)

    const handleDropoffStatusChange = async () => {
        setIsLoading(true)
        const res = await fetch('/api/dropoffs', {
            method: 'PATCH',
            body: JSON.stringify({ id: dropoff.id, status: dropoff.status == 'ACTIVE' ? 'DISABLED' : 'ACTIVE' })
        });

        const data = await res.json();

        setIsLoading(false)

        if (res.ok) {
            toast.success(data.message)
            router.refresh()
        }
    }

    return (

        <>
            {isLoading &&
                <div className='fixed z-[999] bg-black/10 inset-0 flex flex-col items-center justify-center'>
                    <div className="flex flex-col rounded-md bg-white p-8">
                        <Spinner />
                    </div>
                </div>
            }

            <Button variant={'secondary'} onClick={handleDropoffStatusChange} className='w-fit'>
                {dropoff.status == 'ACTIVE' ? 'Disable' : 'Enable'} Dropoff
            </Button>
        </>

    )
}
