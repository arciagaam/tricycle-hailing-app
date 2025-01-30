import React from 'react'
import { twMerge } from 'tailwind-merge';

type MainLayoutTypes = {
    children: React.ReactNode;
    className?: string;
}

const MainLayout = ({ children, className }: MainLayoutTypes) => {
    return (
        <div className={
            twMerge(
                `justify-center items-center flex flex-col w-dvh h-dvh`,
                className
            )
        }>
            {children}
        </div>
    )
}

export { MainLayout }