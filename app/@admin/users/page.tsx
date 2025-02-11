import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'
import PageTitle from '@/app/_components/PageTitle';
import UsersTable from './_components/UsersTable';

export default async function ManageUsers() {

  const users = await prisma.user.findMany({
    include: {
      role: true
    }
  });

  return (
    <div className="flex flex-col">
      <PageTitle title={"Manage Users"} />

      <div className='w-full h-full pt-[80px] p-4 gap-2 flex flex-col'>
        <div className='flex w-full justify-end items-center'>
          <Link href={'/users/create'}>
            <Button>
              Create User
            </Button>
          </Link>
        </div>
        <UsersTable users={users} />
      </div>
    </div>
  )
}
