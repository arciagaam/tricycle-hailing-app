import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'
import DropoffsTable from './_components/DropoffsTable';
import PageTitle from '@/app/_components/PageTitle';

export default async function ManageDropoffs() {

  const dropoffs = await prisma.dropoff.findMany();

  return (
    <div className="flex flex-col">
      <PageTitle title={"Manage Dropoffs"} />

      <div className='w-full h-full pt-[80px] p-4 gap-2 flex flex-col'>
        <div className='flex w-full justify-end items-center'>
          <Link href={'/dropoffs/create'}>
            <Button>
              Create Dropoff
            </Button>
          </Link>
        </div>
        <DropoffsTable dropoffs={dropoffs} />
      </div>
    </div>
  )
}
