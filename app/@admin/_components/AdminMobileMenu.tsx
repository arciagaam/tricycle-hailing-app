'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { MdOutlineMenu } from "react-icons/md";

export default function AdminMobileMenu() {
    const pathname = usePathname();
    const router = useRouter()
    const [open, setOpen] = useState(false);


    const handleLogout = async () => {
        await fetch('api/auth/logout')
        router.refresh()
    }

    return (

        <div key={pathname} className="flex flex-col">
            <div className={`flex items-center h-[10lvh] px-4 ${open ? 'shadow-none justify-between' : 'shadow justify-end'}`}>

                {
                    open && <h2>Menu</h2>
                }
                <button onClick={() => setOpen(!open)} className='py-2 px-2 h-fit'>
                    <MdOutlineMenu size={26} />
                </button>

            </div>

            {
                open &&
                <div className="flex flex-col h-[90lvh]">
                    <Link onClick={() => setOpen(false)} href={'/dropoffs'} className='py-4 px-4'>Manage Dropoffs</Link>
                    <Link onClick={() => setOpen(false)} href={'/users'} className='py-4 px-4'>Manage Users</Link>
                    <button onClick={handleLogout} className='py-4 px-4 text-left' >Logout</button>
                </div>
            }
        </div>

    )
}
