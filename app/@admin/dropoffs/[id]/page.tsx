import React from 'react'

export default function ViewDropoff() {
    return (
        <div className="flex flex-col gap-5">
            <div className="w-full rounded-md bg-red-400 aspect-square p-2">
                <div className="flex gap-2 items-center bg-white py-1 px-3 w-fit rounded-full ml-auto mb-auto">
                    <div className="size-2 bg-green-600 aspect-square rounded-full"></div>
                    <p className='text-sm'>Active</p>
                </div>
            </div>



            <div className="flex flex-col">
                <p className='text-xs font-medium text-black/80'>Dropoff Name</p>
                <p>Valley Golf</p>
            </div>

            <div className="flex flex-col">
                <p className='text-xs font-medium text-black/80'>Address</p>
                <p>Valley Golf</p>
            </div>

            <div className="flex gap-5">
                <div className="flex flex-col">
                    <p className='text-xs font-medium text-black/80'>Longitude</p>
                    <p>0.1525252</p>
                </div>
                <div className="flex flex-col">
                    <p className='text-xs font-medium text-black/80'>Latitude</p>
                    <p>0.1525252</p>
                </div>
            </div>

        </div>
    )
}
