import { MainLayout } from '@/components/ui/main-layout';
import React from 'react'
import PassengerMenu from '../_components/PassengerMenu';
import { ResponsiveProvider } from '@/hooks/useResponsive';


export default function DriverLayout({ children }: { children: React.ReactNode }) {
    return (
        <MainLayout>
            <ResponsiveProvider>
                <PassengerMenu appName={
                    <span className='flex flex-col'>
                        SBU Toda Tracker
                        <span className='text-xs leading-none'>Driver</span>
                    </span>
                } />
            </ResponsiveProvider>
            {children}
        </MainLayout>
    )
}
