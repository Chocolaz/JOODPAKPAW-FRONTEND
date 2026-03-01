import { Bell, User, Home, CalendarPlus, CreditCard, Star } from 'lucide-react'
import React from 'react'

export type Tab = 'all' | 'guest' | 'host'

export const TABS: { id: Tab; label: string; Icon: React.ElementType }[] = [
  { id: 'all', label: 'All', Icon: Bell },
  { id: 'guest', label: 'Guest', Icon: User },
  { id: 'host', label: 'Host', Icon: Home },
]

export const ACTION_CONFIG: Record<
  string,
  {
    Icon: React.ElementType
    guest: { color: string; bg: string }
    host: { color: string; bg: string }
  }
> = {
  booking: {
    Icon: CalendarPlus,
    guest: { color: 'text-blue-500', bg: 'bg-blue-100' },
    host: { color: 'text-deep-teal', bg: 'bg-deep-teal/10' },
  },
  payment: {
    Icon: CreditCard,
    guest: { color: 'text-purple-500', bg: 'bg-purple-100' },
    host: { color: 'text-emerald-600', bg: 'bg-emerald-100' },
  },
  review: {
    Icon: Star,
    guest: { color: 'text-yellow-500', bg: 'bg-yellow-100' },
    host: { color: 'text-yellow-500', bg: 'bg-yellow-100' },
  },
}

/** Actions that navigate to the booking detail page when tapped */
export const BOOKING_DETAIL_ACTIONS = new Set([
  'booking',
  'payment',
  'review',
  'reminder',
  'cancel',
])
