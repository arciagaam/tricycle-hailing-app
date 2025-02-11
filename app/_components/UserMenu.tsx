'use client'

import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@/components/ui/navigation-menu'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { MdHome, MdList, MdPerson } from 'react-icons/md'


export default function UserMenu() {
    const pathname = usePathname()

    return (
        <NavigationMenu className='border-t drop-shadow-sm border-t-muted p-1 flex justify-center'>
            <NavigationMenuList className='w-full flex flex-1 justify-evenly gap-4'>
                <NavigationMenuItem>
                    <Link href={"/"} legacyBehavior passHref>
                        <NavigationMenuLink active className={`flex flex-col items-center leading-tight ${pathname === '/' ? 'text-primary' : 'text-inactive'}`}>
                            <MdHome size={24} /> Home
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <Link href={"/activity"} legacyBehavior passHref>
                        <NavigationMenuLink className={`flex flex-col items-center leading-tight ${pathname === '/activity' ? 'text-primary' : 'text-inactive'}`}>
                            <MdList size={24} /> Activity
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <Link href={"/account"} legacyBehavior passHref>
                        <NavigationMenuLink className={`flex flex-col items-center leading-tight ${pathname === '/account' ? 'text-primary' : 'text-inactive'}`}>
                            <MdPerson size={24} /> Account
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}
