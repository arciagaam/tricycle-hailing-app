import React from 'react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { LucideMenu } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'

export default async function ManageDropoffs() {

  const dropoffs = await prisma.dropOff.findMany();

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

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Dropoff</TableHead>
            <TableHead>Status</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            dropoffs.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger><LucideMenu size={18} /></DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />

                      <DropdownMenuItem>
                        <Link href={`/dropoffs/${item.id}`}>View Dropoff</Link>
                      </DropdownMenuItem>


                      <DropdownMenuSeparator />

                      <DropdownMenuGroup>
                        <DropdownMenuLabel className='font-normal'>Change status to:</DropdownMenuLabel>
                        <DropdownMenuItem disabled={item.status.toLowerCase() == 'active'}>Active</DropdownMenuItem>
                        <DropdownMenuItem disabled={item.status.toLowerCase() == 'disabled'}>Disabled</DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>

    </div>
  )
}
