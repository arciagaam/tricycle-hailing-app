import { MainLayout } from '@/components/ui/main-layout';
import React from 'react'
import PassengerMenu from '../_components/PassengerMenu';


export default function DriverLayout({ children }: { children: React.ReactNode }) {
    return (
        <MainLayout>
            <PassengerMenu appName={
                <span className='flex flex-col'>
                    SBU Toda Tracker
                    <span className='text-xs leading-none'>Driver</span>
                </span>
            }/>
            {children}
        </MainLayout>
    )
}
