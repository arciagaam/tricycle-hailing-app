import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'
import DropoffsTable from './_components/DropoffsTable';

export default async function ManageDropoffs() {

  const dropoffs = await prisma.dropoff.findMany();

  return (
    <div className="flex flex-col gap-5">

      <div className="flex w-full justify-between">
        <h1>Manage Dropoffs</h1>
        <Link href={'/dropoffs/create'}>
          <Button>
            Create Dropoff
          </Button>
        </Link>
      </div>

      <DropoffsTable dropoffs={dropoffs} />

    </div>
  )
}
