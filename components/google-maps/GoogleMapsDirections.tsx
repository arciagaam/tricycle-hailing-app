'use client'

import { useResponsive } from '@/hooks/useResponsive';
import { DirectionsRenderer, DirectionsService, GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import React, { useState } from 'react'

export default function GoogleMapsDirections({ origin = { lat: 14.562339, lng: 121.150040 }, destination }: { origin?: { lat: number; lng: number }, destination: { lat: number; lng: number } }) {
    const { isMobile } = useResponsive();

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string,
        version: 'weekly',
    })

    const containerStyle = {
        width: '100%',
        height: '100%'
    };

    const mapOptions = {
        fullscreenControl: false,
        zoomControl: isMobile && false,
        maxZoom: 15,
        minZoom: 14,
        streetViewControl: false,
        mapTypeControl: false,
        libraries: ['directions'],
    }


    const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
    const [fetchDirections, setFetchDirections] = useState(true);


    const handleDirectionsCallback = (result: google.maps.DirectionsResult | null, status: google.maps.DirectionsStatus) => {
        if (status === "OK" && result) {
            setDirections(result);
            setFetchDirections(false);
        } else {
            console.error("Directions request failed due to " + status);
        }
    };

    if (isLoaded) return (
        <GoogleMap options={mapOptions} mapContainerStyle={containerStyle} zoom={12}>
            {fetchDirections && (
                <DirectionsService options={{
                    origin: origin,
                    destination: destination,
                    travelMode: google.maps.TravelMode.DRIVING,
                }} callback={handleDirectionsCallback} />
            )}
            {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
    )
}
