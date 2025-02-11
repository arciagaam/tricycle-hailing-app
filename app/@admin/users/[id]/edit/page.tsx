import PageTitle from '@/app/_components/PageTitle';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import React from 'react'
import EditUserForm from './_components/EditUserForm';

export default async function EditUser(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const { id } = params;

    const user = await prisma.user.findFirst({
        where: {
            id: parseInt(id)
        },
        include: {
            role: true
        }
    })

    if (!user) return notFound()

    return (
        <div className="flex flex-col w-full">
            <PageTitle title="Edit User" showBackButton />

            <div className='flex flex-col w-full pt-[80px] h-full p-4 gap-5'>
                <EditUserForm user={user} />
            </div>
        </div>
    )
}
