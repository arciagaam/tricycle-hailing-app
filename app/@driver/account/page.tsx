'use client'
import PageTitle from '@/app/_components/PageTitle'
import React, { useState } from 'react'
import { MdKey, MdPerson } from 'react-icons/md'
import EditDriverAccountForm from './_components/EditDriverAccountForm'
import ResetPasswordForm from '@/app/_components/ResetPasswordForm'

export default function DriverAccount() {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  return (
    <div className='bg-background min-w-full h-full'>
      <PageTitle title='Account' />
      <div className='flex flex-col pt-[80px] p-4 w-full h-fit gap-5'>
        <div className='flex flex-col p-4 rounded-md border border-muted gap-5'>
          <span className='text-primary font-bold flex gap-2 items-center'>
            <MdPerson className='text-2xl' />
            Personal Information
          </span>
          <EditDriverAccountForm isEditing={isEditing} setIsEditing={setIsEditing} />
          <hr></hr>
          <span className='text-primary font-bold flex gap-2 items-center'>
            <MdKey className='text-2xl' />
            Change Password
          </span>

          {
            !isEditing &&
            <ResetPasswordForm />
          }

        </div>
      </div>
    </div>
  )
}
