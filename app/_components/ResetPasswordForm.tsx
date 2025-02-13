'use client'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { resetPasswordSchema } from '@/lib/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'


export default function ResetPasswordForm() {

    const resetPasswordForm = useForm<z.infer<typeof resetPasswordSchema>>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
        },
    })


    const onSubmit = async (values: z.infer<typeof resetPasswordSchema>) => {

        const res = await fetch('/api/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify(values)
        })

        if (!res.ok) {
            const error = await res.json();
            return toast.error(error.message)
        }

        toast.success('Success')
        resetPasswordForm.reset()
    }

    return (
        <Form {...resetPasswordForm}>
            <form onSubmit={resetPasswordForm.handleSubmit(onSubmit)} className="flex flex-col gap-5">
                <FormField
                    control={resetPasswordForm.control}
                    name="currentPassword"

                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Current Password</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={resetPasswordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type='submit' variant={'secondary'}>Reset</Button>
            </form>
        </Form>
    )
}
