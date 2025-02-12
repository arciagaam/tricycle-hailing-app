import PageTitle from '@/app/_components/PageTitle';
import { Button } from '@/components/ui/button';
import { prisma } from '@/lib/prisma';
import { handleFullName } from '@/lib/utils';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import React from 'react'

export default async function ViewUser(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const { id } = params;

    const userId = parseInt(id, 10);

    if (isNaN(userId)) {
        return notFound(); 
    }

    const user = await prisma.user.findFirst({
        where: {
            id: parseInt(id)
        },
        include: {
            role: true
        }
    })

    if (!user) return notFound()

    if (user) return (
        <>
            <PageTitle title={user.username} showBackButton={true} returnUrl={`/users`}/>

            <div className="flex flex-col pt-[80px] gap-5 p-4">
                <div className="flex flex-col">
                    <p className='text-xs font-medium text-black/80'>Full Name</p>
                    <p>{handleFullName({ firstName: user.firstName, middleName: user.middleName, lastName: user.lastName })}</p>
                </div>

                <div className="flex flex-col">
                    <p className='text-xs font-medium text-black/80'>Username</p>
                    <p>{user.username}</p>
                </div>

                <div className="flex flex-col">
                    <p className='text-xs font-medium text-black/80'>Role</p>
                    <p>{user.role.name}</p>
                </div>

                <hr />
                <p>Actions</p>


                <div className="flex flex-col gap-1">
                    <Link href={`/users/${user.id}/edit`}>
                        <Button className='w-fit'>
                            Edit User
                        </Button>
                    </Link>
                </div>
            </div>

        </>
    )
}
