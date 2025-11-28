'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  GoogleMap,
  Marker,
  StandaloneSearchBox,
  useJsApiLoader,
} from '@react-google-maps/api'
import { Input } from '@/components/ui/input'
import { useAddProperty } from '../../_context/AddPropertyContext'
import { StepNavigation } from '../StepNavigation'
import { AddressComponents } from '@/types'

const libraries: 'places'[] = ['places']

export function Step2({
  onNext,
  onBack,
}: {
  onNext: () => void
  onBack: () => void
}) {
  const { formData, updateField } = useAddProperty()

  // -------------------------------
  // 1) State
  // -------------------------------
  const [center, setCenter] = useState({
    lat: Number(formData.latitude) || 13.736717,
    lng: Number(formData.longitude) || 100.523186,
  })
  const [searchBox, setSearchBox] =
    useState<google.maps.places.SearchBox | null>(null)
  const [address, setAddress] = useState(formData.address || '')

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  })

  // -------------------------------
  // 3) Reverse Geocoding
  // -------------------------------
  const reverseGeocode = useCallback(
    (lat: number, lng: number) => {
      if (!window.google || !window.google.maps) return

      const geocoder = new window.google.maps.Geocoder()
      geocoder.geocode(
        { location: { lat, lng }, language: 'en' },
        (results, status) => {
          if (status === 'OK' && results && results.length > 0) {
            const place = results[0]
            const components: AddressComponents = {}

            place.address_components.forEach((c) => {
              const types = c.types
              if (types.includes('country')) components.country = 'Thailand' // lock country
              if (types.includes('administrative_area_level_1')) {
                let prov = c.long_name
                if (/krung\s*thep/i.test(prov)) prov = 'Bangkok'
                components.province = prov
              }
              if (types.includes('administrative_area_level_2'))
                components.district = c.long_name
              if (
                types.includes('sublocality_level_1') ||
                types.includes('locality')
              )
                components.subdistrict = c.long_name
              if (types.includes('route')) components.route = c.long_name
              if (types.includes('street_number'))
                components.street_number = c.long_name
              if (types.includes('postal_code'))
                components.zipcode = c.long_name
            })

            updateField('country', components.country || 'Thailand')
            updateField('province', components.province || '')
            updateField('district', components.district || '')
            updateField('subdistrict', components.subdistrict || '')
            updateField(
              'address',
              `${components.street_number || ''} ${components.route || ''}`.trim()
            )
            updateField('zipcode', components.zipcode || '')

            setAddress(place.formatted_address || '')
          }
        }
      )
    },
    [updateField]
  )

  // -------------------------------
  // 2) Use user's location if not set
  // -------------------------------
  useEffect(() => {
    const handleLocation = (lat: number, lng: number) => {
      setCenter({ lat, lng })
      updateField('latitude', String(lat))
      updateField('longitude', String(lng))
      reverseGeocode(lat, lng)
    }

    if (!formData.latitude && !formData.longitude) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) =>
          handleLocation(pos.coords.latitude, pos.coords.longitude)
        )
      }
    }
  }, [formData.latitude, formData.longitude, reverseGeocode, updateField])

  // -------------------------------
  // 4) SearchBox change
  // -------------------------------
  const onPlacesChanged = () => {
    if (!searchBox) return
    const places = searchBox.getPlaces()
    if (places && places[0]?.geometry?.location) {
      const location = places[0].geometry.location
      const lat = location.lat()
      const lng = location.lng()
      setCenter({ lat, lng })
      updateField('latitude', String(lat))
      updateField('longitude', String(lng))
      setAddress(places[0].formatted_address || '')
      reverseGeocode(lat, lng)
    }
  }

  // -------------------------------
  // 5) Drag Marker
  // -------------------------------
  const onMarkerDragEnd = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return
    const lat = e.latLng.lat()
    const lng = e.latLng.lng()
    setCenter({ lat, lng })
    updateField('latitude', String(lat))
    updateField('longitude', String(lng))
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
          Drag the marker or search to choose your location (within Thailand).
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
            className="w-full mb-3"
          />
        </StandaloneSearchBox>

        {/* Google Map */}
        <div className="w-full h-[380px] rounded-xl overflow-hidden shadow-md border">
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={{ lat: Number(center.lat), lng: Number(center.lng) }}
            zoom={15}
            options={{
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
              restriction: {
                latLngBounds: {
                  north: 20.5,
                  south: 5.5,
                  west: 97.5,
                  east: 105.5,
                },
                strictBounds: true,
              },
            }}
          >
            <Marker
              position={{ lat: Number(center.lat), lng: Number(center.lng) }}
              draggable
              onDragEnd={onMarkerDragEnd}
            />
          </GoogleMap>
        </div>

        {/* Lat/Lng */}
        <div className="text-center text-neutral-gray text-sm my-4">
          <span className="block">
            <b>Latitude:</b> {formData.latitude || ''}
          </span>
          <span className="block">
            <b>Longitude:</b> {formData.longitude || ''}
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
