import React from 'react'
// import AdminMobileMenu from './_components/AdminMobileMenu'
import AdminMenu from './_components/AdminMenu'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col h-full w-full">
            <AdminMenu />

            <div className="flex flex-col h-full">
                {children}
            </div>
        </div>
    )
}
