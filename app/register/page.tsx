'use client'

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { registerUserSchema } from '@/lib/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import HeroTitle from '../_components/HeroTitle';
import toast from 'react-hot-toast';

export default function Register() {
    const router = useRouter();

    const registerForm = useForm<z.infer<typeof registerUserSchema>>({
        resolver: zodResolver(registerUserSchema),
        defaultValues: {
            username: "",
            firstName: "",
            middleName: "",
            lastName: "",
            password: "",
        },
    })

    const onSubmit = async (values: z.infer<typeof registerUserSchema>) => {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(values)
        })

        if (res.ok) {
            toast.success("User successfully registered")
            return router.push('/login')
        }

    }
    return (
        <div className="flex flex-col p-10 gap-4 w-full lg:max-w-[70dvw] 2xl:max-w-[1400px]">
            <HeroTitle />
            <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onSubmit)} className="flex flex-col gap-5">
                    <FormField
                        control={registerForm.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={registerForm.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={registerForm.control}
                        name="middleName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Middle Name</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={registerForm.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit">Register</Button>
                </form>
            </Form>
            <Link href="/login" className="flex items-center justify-center text-center w-full text-muted-foreground text-xs hover:text-primary/80">
                {"Already have an account?"}
            </Link>
        </div>
    )
}
