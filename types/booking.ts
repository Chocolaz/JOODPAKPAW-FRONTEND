export interface BookingDetail {
  propertyId: number
  checkInDate: string
  checkOutDate: string
  numberOfPets: number
  selectedRooms: { [key: string]: number }
  roomNames: { [key: string]: string }
}

export interface RoomCategoryBooked {
  id: number
  name: string
  roomsBooked: number
}

export interface PropertyBooked {
  id: number
  title: string
  roomCategories: RoomCategoryBooked[]
}

export interface Booking {
  id: number
  checkInDate: string
  checkOutDate: string
  numberOfPets: number
  totalPrice: number
  bookingStatus: string
  property: PropertyBooked
  createdAt: string
}

export interface BookingsResponse {
  bookings: Booking[]
}

export interface Guest {
  id: number
  firstName: string
  lastName: string
  email: string
}

export interface BookingOrderProperty {
  id: number
  title: string
  address: string
}

export interface BookingOrderRoomCategory {
  id: number
  name: string
}

export interface BookingOrder {
  id: number
  checkInDate: string
  checkOutDate: string
  roomsBooked: number
  pricePerRoom: number
  totalPrice: number
  propertyId: number
  property: BookingOrderProperty
  roomCategoryId: number
  roomCategory: BookingOrderRoomCategory
}

export interface FullBookingDetail {
  id: number
  checkInDate: string
  checkOutDate: string
  numberOfPets: number
  totalPrice: number
  bookingStatus: string
  guestId: number
  guest: Guest
  bookingOrders: BookingOrder[]
  createdAt: string
  updatedAt: string
}
