'use client'

import Link from 'next/link'
import React from 'react'
import { MdArrowBack } from 'react-icons/md'

type TPageTitle = {
    title: string | React.ReactNode;
    showBackButton?: boolean;
    returnUrl?: string;
}

export default function PageTitle({ title, showBackButton = false, returnUrl }: TPageTitle) {
    return (
        <>
            <div className='px-16 py-5 flex items-center w-dvw mx-auto left-1 top-0 fixed bg-background z-[10]'>
                <span className='text-lg font-bold flex items-center gap-2 px-4 w-full'>
                    {showBackButton &&
                        <Link href={`${returnUrl || '..'}`} rel={returnUrl ? '' : 'path'}>
                            <MdArrowBack className='text-[24px] hover:text-primary' />
                        </Link>
                    }
                    {title}
                </span>
            </div>
        </>
    )
}
