'use client'

import { Spinner } from '@/app/_components/Spinner'
import GoogleMaps from '@/components/google-maps/GoogleMaps'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { editDropoffSchema } from '@/lib/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dropoff } from '@prisma/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'

export default function EditDropoffForm({ dropoff }: { dropoff: Dropoff }) {

    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false)

    const editDropoffForm = useForm<z.infer<typeof editDropoffSchema>>({
        resolver: zodResolver(editDropoffSchema),
        defaultValues: {
            id: dropoff.id,
            name: dropoff.name,
            address: dropoff.address,
            longitude: dropoff.longitude,
            latitude: dropoff.latitude,
            fare: dropoff.fare
        }
    })

    const handleMapClick = (latLng: { lat: number | null | undefined, lng: number | null | undefined }) => {
        const { lat, lng } = latLng;

        if (lat && lng) {
            editDropoffForm.setValue('latitude', `${lat}`)
            editDropoffForm.setValue('longitude', `${lng}`)
        }

    }

    const onSubmit = async (values: z.infer<typeof editDropoffSchema>) => {
        setIsLoading(true)
        const res = await fetch('/api/dropoffs', {
            method: 'PATCH',
            body: JSON.stringify(values)
        });

        const data = await res.json();

        setIsLoading(false)
        if (res.ok) {
            editDropoffForm.reset()
            toast.success(data.message)
            router.push(`/dropoffs/${dropoff.id}`)
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
            
            <div className="w-full h-[400px]">
                <GoogleMaps onMapClick={handleMapClick} center={{ lat: parseFloat(dropoff.latitude), lng: parseFloat(dropoff.longitude) }} />
            </div>

            <Form {...editDropoffForm}>
                <form onSubmit={editDropoffForm.handleSubmit(onSubmit)} className='flex flex-col gap-5'>
                    <FormField
                        control={editDropoffForm.control}
                        name="fare"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Fare</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={editDropoffForm.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Dropoff Name</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={editDropoffForm.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex gap-1 ml-auto">
                        <Link href={'..'} rel='path'>
                            <Button type='button' variant={'destructive'}>Cancel</Button>
                        </Link>

                        <Button>Update Dropoff</Button>
                    </div>
                </form>
            </Form>
        </>
    )
}
