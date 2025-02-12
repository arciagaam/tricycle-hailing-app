import PageTitle from '@/app/_components/PageTitle';
import { prisma } from '@/lib/prisma';
import React from 'react'
import EditDropoffForm from './_components/EditDropoffForm';
import { notFound } from 'next/navigation';

export default async function EditDropoff(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const { id } = params;


    const dropoff = await prisma.dropoff.findFirst({
        where: {
            id: parseInt(id)
        }
    });

    if (!dropoff) return notFound()

    return (
        <>
            <PageTitle title="Edit Dropoff" showBackButton returnUrl={`/dropoffs/${id}`} />
            <div className="flex flex-col pt-[80px] lg:pt-[100px] p-4 lg:p-8 gap-5">

                <div className='flex flex-col w-full h-full p-4 gap-5'>
                    <EditDropoffForm dropoff={dropoff} />
                </div>
            </div>
        </>
    )
}
