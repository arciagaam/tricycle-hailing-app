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
                `justify-center items-center flex w-full min-w-dvw h-dvh lg:max-w-[70dvw] 2xl:max-w-[1400px] relative overflow-auto`,
                className
            )
        }>
            {children}
        </div>
    )
}

export { MainLayout }