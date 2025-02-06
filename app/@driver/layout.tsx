import { MainLayout } from '@/components/ui/main-layout';
import React from 'react'
import PassengerMenu from '../_components/PassengerMenu';


export default function DriverLayout({ children }: { children: React.ReactNode }) {
    return (
        <MainLayout>
            <PassengerMenu />
            {children}
        </MainLayout>
    )
}
