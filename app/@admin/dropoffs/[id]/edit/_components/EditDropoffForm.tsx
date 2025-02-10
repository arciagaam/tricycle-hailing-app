'use client'

import GoogleMaps from '@/components/google-maps/GoogleMaps'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { editDropoffSchema } from '@/lib/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dropoff } from '@prisma/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'

export default function EditDropoffForm({ dropoff }: { dropoff: Dropoff }) {

    const router = useRouter();

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

        const res = await fetch('/api/dropoffs', {
            method: 'PATCH',
            body: JSON.stringify(values)
        });

        const data = await res.json();

        if (res.ok) {
            editDropoffForm.reset()
            toast.success(data.message)
            router.push(`/dropoffs/${dropoff.id}`)
        }
    }


    return (
        <>
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
