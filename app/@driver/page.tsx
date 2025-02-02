import GoogleMapsDirections from '@/components/google-maps/GoogleMapsDirections'
import { Button } from '@/components/ui/button'
import React from 'react'

export default function DriverHomepage() {
  return (

    <div className='bg-background w-full h-full flex flex-col gap-2 p-4 overflow-auto'>
      <h2>Available Bookings</h2>

      {[1, 2, 3, 4, 5, 6, 7].map(booking => (
        <div key={booking} className="flex flex-col p-2 rounded-md border gap-5">

          <div className="h-[300px] w-full">
            <GoogleMapsDirections destination={{ lat: 14.56021890541903, lng: 121.15185416462482 }} />
          </div>

          <div className="flex flex-col">
            <div className="flex w-full justify-between">
              <p>Dropoff</p>
              <p>P50.00</p>
            </div>

            <p>Passenger</p>
          </div>

          <Button className='ml-auto'>Accept Booking</Button>


        </div>
      ))}
    </div>

  )
}
