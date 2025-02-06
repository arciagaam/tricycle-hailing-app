'use client'

import Link from 'next/link'
import React from 'react'
import { MdArrowBack } from 'react-icons/md'

type TPageTitle = {
    title: string;
    showBackButton?: boolean;
    returnUrl?: string;
}

export default function PageTitle({ title, showBackButton = false, returnUrl  }: TPageTitle) {
    return (
        <div className='px-16 py-5 flex items-center'>
            <span className='text-lg font-bold  flex items-center gap-2 px-4'>
                {showBackButton &&
                    <Link href={`${returnUrl}`}>
                        <MdArrowBack className='text-[24px] hover:text-primary' />
                    </Link>
                }
                {title}
            </span>
        </div>
    )
}
