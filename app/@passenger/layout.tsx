import { MainLayout } from '@/components/ui/main-layout';
import React from 'react'
import UserMenu from '../_components/UserMenu';
import PassengerMenu from './_components/passengermenu';

type PassengerLayoutTypes = {
    children: React.ReactNode;
}

export default function PassengerLayout({ children }: PassengerLayoutTypes) {
    return (
        <MainLayout>
            <PassengerMenu />
            {children}
        </MainLayout>
    )
}
