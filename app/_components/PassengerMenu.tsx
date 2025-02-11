'use client'

import { Button } from '@/components/ui/button'
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@/components/ui/navigation-menu'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { ReactElement, useEffect, useState } from 'react'
import { IconType } from 'react-icons/lib'
import { MdClose, MdHome, MdList, MdLogout, MdMenu, MdPerson } from 'react-icons/md'

export default function PassengerMenu() {
    const router = useRouter()

    const handleLogout = async () => {
        await fetch('api/auth/logout')
        router.refresh()
    }

    const pathname = usePathname()
    const [navOpen, setNavOpen] = useState<boolean>(false);

    type TRoutes = {
        icon: ReactElement<IconType>;
        label: string | React.ReactNode;
        href: string;
    }[]

    const routes: TRoutes = [
        {
            icon: <MdHome className='text-[24px]' />,
            label: 'Home',
            href: '/'
        },
        {
            icon: <MdList className='text-[24px]' />,
            label: 'Activity',
            href: '/activity'
        },
        {
            icon: <MdPerson className='text-[24px]' />,
            label: 'Account',
            href: '/account'
        },
    ]

    useEffect(() => {
        setNavOpen(false)
    }, [pathname])

    return (
        <div className={`relative h-full`}>
            {!navOpen ? (
                <Button className={`${!navOpen ? 'block' : 'hidden'} fixed left-4 top-4 z-[999]`} onClick={() => setNavOpen(true)}>
                    <MdMenu size={24} />
                </Button>

            ) : (
                <>
                    <div onClick={() => setNavOpen(false)} className='w-[100dvw] lg:max-w-[70dvw] 2xl:max-w-[1400px] min-h-full z-[9998] bg-black/50 absolute left-0 top-0' />
                    <div className='absolute z-[9999] max-w-fit top-0 flex flex-col shadow-md border-t-muted min-h-dvh bg-background'>

                        <div className='flex gap-2 w-full p-4 items-center justify-between'>
                            <h1 className='text-lg text-primary font-bold tracking-tighter'>IT MOVE <span>RIDER</span></h1>
                            <Button onClick={() => setNavOpen(false)} type='button' className='!focus:text-primary bg-transparent hover:bg-muted shadow-none w-fit h-fit p-0.5'>
                                <MdClose className='text-black/80 focus:text-primary text-[24px]' />
                            </Button>
                        </div>

                        <NavigationMenu className="border-r flex justify-start">
                            <NavigationMenuList className='w-[30dvh] flex flex-col flex-1 justify-start items-start gap-2 !m-0'>
                                {routes.map((route, i) => (
                                    <NavigationMenuItem key={i} className='w-full hover:bg-muted px-4 py-2'>
                                        <Link href={route.href} legacyBehavior passHref>
                                            <NavigationMenuLink
                                                className={`flex gap-2 items-center leading-tight ${pathname === route.href ? 'text-primary' : 'text-inactive'}`}>
                                                {route.icon} {route.label}
                                            </NavigationMenuLink>
                                        </Link>
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>
                        <div className='mt-auto w-full p-4'>
                            <Button onClick={handleLogout} className='hover:bg-muted border-muted bg-transparent shadow-none text-red-500 w-full flex'>
                                <MdLogout className='text-[24px] ' />
                                Logout
                            </Button>
                        </div>
                    </div>
                </>
            )}

        </div>
    )
}
