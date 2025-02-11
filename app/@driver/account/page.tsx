import PageTitle from '@/app/_components/PageTitle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React from 'react'

export default function DriverAccount() {
  return (
    <div className='bg-background min-w-full h-full'>
      <PageTitle title='Account' />
      <div className='flex flex-col pt-[80px] p-4 w-full h-fit gap-5'>
        <div className='flex flex-col p-4 rounded-md border border-muted gap-5'>
          <p className='text-primary font-bold'>Personal Information</p>
          <p>Driver Name</p>
          <p>Other Info...</p>
          <hr></hr>
          <p className='text-primary font-bold'>Change Password</p>
          <Input id="old-password" placeholder='Current password' type='password' />
          <Input id="new-password" placeholder='New password' type='password' />
          <Button type='submit' disabled className='disabled:bg-muted-foreground'>Reset</Button>
        </div>
      </div>
    </div>
  )
}
