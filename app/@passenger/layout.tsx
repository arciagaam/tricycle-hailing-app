import { MainLayout } from '@/components/ui/main-layout';
import React from 'react'
// import UserMenu from '../_components/UserMenu';
import PassengerMenu from '../_components/PassengerMenu';
import { ResponsiveProvider } from '@/hooks/useResponsive';

type PassengerLayoutTypes = {
    children: React.ReactNode;
}

export default function PassengerLayout({ children }: PassengerLayoutTypes) {
    return (
        <MainLayout>
            <ResponsiveProvider>
                <PassengerMenu appName={
                    <span className='flex flex-col'>
                        SBU Toda Tracker
                        <span className='text-xs leading-none'>Passenger</span>
                    </span>
                } />
            </ResponsiveProvider>
            {children}
        </MainLayout>
    )
}
