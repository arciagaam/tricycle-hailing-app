import React from 'react'
import AdminMobileMenu from './_components/AdminMobileMenu'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col h-screen">
            <AdminMobileMenu />

            <div className="flex flex-col p-4 h-full">
                {children}
            </div>
        </div>
    )
}
