'use client'

import React, { useState } from 'react'
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'

type GoogleMapsProps = {
    onMapClick?: (latLng: { lat: number | null | undefined, lng: number | null | undefined }) => void
    center?: { lat: number, lng: number }
}

export default function GoogleMaps({ onMapClick, center }: GoogleMapsProps) {

    const [point, setPoint] = useState<{ lat: number, lng: number } | null>(null);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string,
        version: 'weekly',
    })

    const containerStyle = {
        width: '100%',
        height: '400px'
    };

    const mapOptions = {
        fullscreenControl: false,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
    }


    const handleMapClick = (e: google.maps.MapMouseEvent) => {
        if (!e) {
            setPoint(null);
            return;
        }

        const lat = e.latLng?.lat();
        const lng = e.latLng?.lng();

        if (onMapClick) {
            onMapClick({ lat, lng })
        }

        if (lat && lng) {
            setPoint({ lat: lat, lng: lng });
            return;
        }

        setPoint(null);
    }

    if (isLoaded)
        return (
            <GoogleMap
                mapContainerStyle={containerStyle}
                zoom={16}
                center={point || center || { lat: 14.562339, lng: 121.150040 }}
                options={mapOptions}
                onClick={handleMapClick}
            >
                {center && <Marker position={{ lat: center.lat, lng: center.lng }} />}

                {point && <Marker position={point} />}


            </GoogleMap>
        )
}
