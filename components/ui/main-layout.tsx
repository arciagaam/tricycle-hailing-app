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
                `justify-center items-center flex w-full min-w-dvh h-dvh lg:max-w-[70dvw] relative overflow-auto`,
                className
            )
        }>
            {children}
        </div>
    )
}

export { MainLayout }