'use client'

import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { UserWithRelations } from '@/lib/types'
import { DropdownMenu } from '@radix-ui/react-dropdown-menu'
import { LucideMenu } from 'lucide-react'
import Link from 'next/link'
import React from 'react'


export default function UsersTable({ users }: { users: UserWithRelations[] }) {

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    users.map((user, index) => (
                        <UserRow key={index} user={user} />
                    ))
                }
            </TableBody>
        </Table>
    )
}

const UserRow = ({ user }: { user: UserWithRelations }) => {

    return (
        <TableRow>
            <TableCell className="font-medium">{user.username}</TableCell>
            <TableCell>
                {user.role.name}
            </TableCell>
            <TableCell>
                <DropdownMenu>
                    <DropdownMenuTrigger><LucideMenu size={18} /></DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem>
                            <Link href={`/users/${user.id}`}>View User</Link>
                        </DropdownMenuItem>

                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    )
}
