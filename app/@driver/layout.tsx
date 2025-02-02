import { MainLayout } from '@/components/ui/main-layout';
import React from 'react'
import UserMenu from '../_components/UserMenu';


export default function DriverLayout({ children }: { children: React.ReactNode }) {
    return (
        <MainLayout>
            {children}
            <UserMenu />
        </MainLayout>
    )
}
