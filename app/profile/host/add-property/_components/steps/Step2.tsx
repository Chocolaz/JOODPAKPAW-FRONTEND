'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  StandaloneSearchBox,
} from '@react-google-maps/api'
import { Input } from '@/components/ui/input'
import { useAddProperty } from '../../_context/AddPropertyContext'
import { StepNavigation } from '../StepNavigation'

const libraries: 'places'[] = ['places']

export function Step2({
  onNext,
  onBack,
}: {
  onNext: () => void
  onBack: () => void
}) {
  const { formData, updateField } = useAddProperty()
  const [center, setCenter] = useState({ lat: 13.736717, lng: 100.523186 }) // default BKK
  const [searchBox, setSearchBox] = useState<any>(null)
  const [address, setAddress] = useState('')
  const [loadingUserLocation, setLoadingUserLocation] = useState(true)

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  })

  // -------------------------------
  // 1) ใช้ location ของ user
  // -------------------------------
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude
          const lng = pos.coords.longitude
          setCenter({ lat, lng })
          updateField('latitude', lat)
          updateField('longitude', lng)
          reverseGeocode(lat, lng)
          setLoadingUserLocation(false)
        },
        () => setLoadingUserLocation(false)
      )
    } else {
      setLoadingUserLocation(false)
    }
  }, [])

  // -------------------------------
  // 2) Reverse Geocoding
  // -------------------------------
  const reverseGeocode = (lat: number, lng: number) => {
    const geocoder = new google.maps.Geocoder()
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results && results.length > 0) {
        setAddress(results[0].formatted_address)
      }
    })
  }

  // -------------------------------
  // 3) SearchBox เลือกตำแหน่ง
  // -------------------------------
  const onPlacesChanged = () => {
    const places = searchBox.getPlaces()
    if (places && places[0]) {
      const location = places[0].geometry.location
      const lat = location.lat()
      const lng = location.lng()
      setCenter({ lat, lng })
      updateField('latitude', lat)
      updateField('longitude', lng)
      setAddress(places[0].formatted_address)
    }
  }

  // -------------------------------
  // 4) ลาก Marker ให้ update
  // -------------------------------
  const onMarkerDragEnd = (e: google.maps.MapMouseEvent) => {
    const lat = e.latLng?.lat() || 0
    const lng = e.latLng?.lng() || 0
    setCenter({ lat, lng })
    updateField('latitude', lat)
    updateField('longitude', lng)
    reverseGeocode(lat, lng)
  }

  if (!isLoaded) return <p className="text-center py-6">Loading map…</p>

  return (
    <>
      <div className="w-full text-center mt-5">
        <h3 className="text-deep-teal text-xl font-semibold">
          Where is your property located?
        </h3>
        <p className="mb-4 text-neutral-gray text-sm">
          Drag the marker or search to choose your location.
        </p>

        {/* Search box */}
        <StandaloneSearchBox
          onLoad={(ref) => setSearchBox(ref)}
          onPlacesChanged={onPlacesChanged}
        >
          <Input
            placeholder="Search location..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-4 mb-3 text-base shadow-sm rounded-xl"
          />
        </StandaloneSearchBox>

        {/* Google Map */}
        <div className="w-full h-[380px] rounded-xl overflow-hidden shadow-md border">
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={center}
            zoom={15}
            options={{
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
            }}
          >
            <Marker
              position={center}
              draggable={true}
              onDragEnd={onMarkerDragEnd}
            />
          </GoogleMap>
        </div>

        {/* Lat/Lng */}
        <div className="text-center text-neutral-gray text-sm my-4">
          <span className="block">
            <b>Latitude:</b> {formData.latitude}
          </span>
          <span className="block">
            <b>Longitude:</b> {formData.longitude}
          </span>
        </div>
      </div>

      <StepNavigation
        onBack={onBack}
        onNext={onNext}
        isNextDisabled={!formData.latitude || !formData.longitude}
      />
    </>
  )
}
