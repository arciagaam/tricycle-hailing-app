'use client'

import PageTitle from '@/app/_components/PageTitle'
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createUserSchema } from '@/lib/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Role } from '@prisma/client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

export default function CreateUser() {
    const router = useRouter();

    const [roles, setRoles] = useState<Role[]>();

    useEffect(() => {
        const getRoles = async () => {
            const res = await fetch('/api/roles');

            if (res.ok) {
                const { data } = await res.json()
                setRoles(data);
            }

        }

        getRoles();
    }, [])

    const createUserForm = useForm<z.infer<typeof createUserSchema>>({
        resolver: zodResolver(createUserSchema),
        defaultValues: {
            username: "",
            firstName: "",
            middleName: "",
            lastName: "",
            roleId: 1,
        },
    })

    const onSubmit = async (values: z.infer<typeof createUserSchema>) => {
        const res = await fetch('/api/users', {
            method: 'POST',
            body: JSON.stringify(values)
        });


        if (res.ok) {
            const user = await res.json();
            createUserForm.reset()
            toast.success('User successfully created')

            return router.push(`/users/${user.id}`)
        }

    }
    return (
        <div className="flex flex-col gap-5">
            <PageTitle title={'Create User'} showBackButton={true} />

            <div className="flex flex-col gap-5 p-4">
                <Form {...createUserForm}>
                    <form onSubmit={createUserForm.handleSubmit(onSubmit)} className="flex flex-col gap-5">

                        <FormField
                            control={createUserForm.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormDescription> {"The username will be this user's default password."}</FormDescription>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={createUserForm.control}
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
                            control={createUserForm.control}
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
                            control={createUserForm.control}
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

                        <hr />

                        <FormField
                            control={createUserForm.control}
                            name="roleId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>

                                    {
                                        roles &&

                                        <Select onValueChange={field.onChange} defaultValue={String(0)} >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {
                                                    roles?.map(role => (
                                                        <SelectItem key={role.id} value={String(role.id)}>{role.name}</SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>
                                    }
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit">Create User</Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}
