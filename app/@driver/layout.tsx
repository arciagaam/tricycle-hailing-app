import { MainLayout } from '@/components/ui/main-layout';
import React from 'react'
import UserMenu from '../_components/UserMenu';
import PassengerMenu from '../@passenger/_components/passengermenu';


export default function DriverLayout({ children }: { children: React.ReactNode }) {
    return (
        <MainLayout>
            <PassengerMenu />
            {children}
        </MainLayout>
    )
}
