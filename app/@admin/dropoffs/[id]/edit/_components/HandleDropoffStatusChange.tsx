'use client'

import { Button } from '@/components/ui/button';
import { Dropoff } from '@prisma/client'
import { useRouter } from 'next/navigation';
import React from 'react'
import toast from 'react-hot-toast';

export default function HandleDropoffStatusChange({ dropoff }: { dropoff: Dropoff }) {
    const router = useRouter();

    const handleDropoffStatusChange = async () => {
        const res = await fetch('/api/dropoffs', {
            method: 'PATCH',
            body: JSON.stringify({ id: dropoff.id, status: dropoff.status == 'ACTIVE' ? 'DISABLED' : 'ACTIVE' })
        });

        const data = await res.json();

        if (res.ok) {

            toast.success(data.message)
            router.refresh()
        }
    }

    return (

        <Button onClick={handleDropoffStatusChange} className='w-fit'>
            {dropoff.status == 'ACTIVE' ? 'Disable' : 'Enable'} Dropoff
        </Button>
    )
}
