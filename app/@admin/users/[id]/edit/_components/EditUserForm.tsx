'use client'

import { Spinner } from '@/app/_components/Spinner';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { editUserSchema } from '@/lib/schema';
import { UserWithRelations } from '@/lib/types'
import { zodResolver } from '@hookform/resolvers/zod';
import { Role } from '@prisma/client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

export default function EditUserForm({ user }: { user: UserWithRelations }) {

    const [roles, setRoles] = useState<Role[]>();
    const [isLoading, setIsLoading] = useState(false)
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

    const router = useRouter();

    const editUserForm = useForm<z.infer<typeof editUserSchema>>({
        resolver: zodResolver(editUserSchema),
        defaultValues: {
            id: user.id,
            username: user.username,
            firstName: user.firstName,
            middleName: user.middleName,
            lastName: user.lastName,
            roleId: user.roleId,
        }
    })

    const onSubmit = async (values: z.infer<typeof editUserSchema>) => {

        setIsLoading(true)

        const res = await fetch('/api/users', {
            method: 'PATCH',
            body: JSON.stringify(values)
        });

        const data = await res.json();

        setIsLoading(false)

        if (res.ok) {
            editUserForm.reset()
            toast.success(data.message)
            router.push(`/users/${user.id}`)
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
            <Form {...editUserForm}>
                <form onSubmit={editUserForm.handleSubmit(onSubmit)} className="flex flex-col gap-5">
                    <FormField
                        control={editUserForm.control}
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
                        control={editUserForm.control}
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
                        control={editUserForm.control}
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
                        control={editUserForm.control}
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
                        control={editUserForm.control}
                        name="roleId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Role</FormLabel>

                                {
                                    roles &&

                                    <Select onValueChange={field.onChange} defaultValue={String(user.roleId)} >
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


                    <Button type="submit">Edit User</Button>
                </form>
            </Form>
        </>
    )
}
