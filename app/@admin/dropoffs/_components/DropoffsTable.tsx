'use client'

import { DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { $Enums } from '@prisma/client'
import { DropdownMenu } from '@radix-ui/react-dropdown-menu'
import { LucideMenu } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'


export default function DropoffsTable({ dropoffs }: {
    dropoffs: {
        id: number;
        name: string;
        address: string;
        longitude: string;
        latitude: string;
        status: $Enums.DropOffStatus;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
    }[]
}) {

    return (
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
                        <DropoffRow key={index} row={item} />
                    ))
                }
            </TableBody>
        </Table>
    )
}

const DropoffRow = ({ row }: {
    row: {
        id: number;
        name: string;
        address: string;
        longitude: string;
        latitude: string;
        status: $Enums.DropOffStatus;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
    }
}) => {

    const [dropoff, setDropoff] = useState(row)

    const updateDropoffStatus = async (id: number, currentStatus: string) => {
        const res = await fetch(`/api/dropoffs/${id}/${currentStatus.toLowerCase() == 'active' ? 'disable' : 'enable'}`, {
            method: 'PUT',
            body: JSON.stringify({ id })
        });

        if (res.ok) {
            setDropoff((prev) => ({ ...prev, status: prev.status.toLowerCase() == 'active' ? 'DISABLED' : 'ACTIVE' }))
        }
    }

    return (
        <TableRow>
            <TableCell className="font-medium">{dropoff.name}</TableCell>
            <TableCell>{dropoff.status.toLowerCase()}</TableCell>
            <TableCell>
                <DropdownMenu>
                    <DropdownMenuTrigger><LucideMenu size={18} /></DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem>
                            <Link href={`/dropoffs/${dropoff.id}`}>View Dropoff</Link>
                        </DropdownMenuItem>


                        <DropdownMenuSeparator />

                        <DropdownMenuGroup>
                            <DropdownMenuLabel className='font-normal'>Change status to:</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => updateDropoffStatus(dropoff.id, dropoff.status)} disabled={dropoff.status.toLowerCase() == 'active'}>Active</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateDropoffStatus(dropoff.id, dropoff.status)} disabled={dropoff.status.toLowerCase() == 'disabled'}>Disable</DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    )
}
