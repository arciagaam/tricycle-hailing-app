import React from 'react'
// import AdminMobileMenu from './_components/AdminMobileMenu'
import AdminMenu from './_components/AdminMenu'
import { MainLayout } from '@/components/ui/main-layout'
import { ResponsiveProvider } from '@/hooks/useResponsive'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <MainLayout>
            <ResponsiveProvider >
                <AdminMenu />
            </ResponsiveProvider>

            <div className="flex flex-col h-full w-full">
                {children}
            </div>
        </MainLayout>
    )
}
