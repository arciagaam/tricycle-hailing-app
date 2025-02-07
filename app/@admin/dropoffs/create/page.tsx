'use client'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { createDropoffSchema } from '@/lib/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import toast from 'react-hot-toast';
import Link from 'next/link'
import GoogleMaps from '@/components/google-maps/GoogleMaps'
import PageTitle from '@/app/_components/PageTitle'

export default function CreateDropoff() {

    const createDropoffForm = useForm<z.infer<typeof createDropoffSchema>>({
        resolver: zodResolver(createDropoffSchema),
        defaultValues: {
            name: '',
            address: '',
            longitude: '',
            latitude: '',
            fare: ''
        }
    })

    const handleMapClick = (latLng: { lat: number | null | undefined, lng: number | null | undefined }) => {
        const { lat, lng } = latLng;

        if (lat && lng) {
            createDropoffForm.setValue('latitude', `${lat}`)
            createDropoffForm.setValue('longitude', `${lng}`)
        }

    }

    const onSubmit = async (values: z.infer<typeof createDropoffSchema>) => {

        const res = await fetch('/api/dropoffs', {
            method: 'POST',
            body: JSON.stringify(values)
        });

        const data = await res.json();

        if (res.ok) {
            createDropoffForm.reset()
            return toast.success(data.message)
        }
    }

    return (

        <div className="flex flex-col w-full">
            <PageTitle title="Create Dropoff" showBackButton returnUrl='/dropoffs' />

            <div className='flex flex-col w-full h-full p-4 gap-5'>
                <div className="w-full h-[400px]">
                    <GoogleMaps onMapClick={handleMapClick} />
                </div>

                <Form {...createDropoffForm}>
                    <form onSubmit={createDropoffForm.handleSubmit(onSubmit)} className='flex flex-col gap-5'>
                        <FormField
                            control={createDropoffForm.control}
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
                            control={createDropoffForm.control}
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
                            control={createDropoffForm.control}
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
                            <Button>Submit</Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}
