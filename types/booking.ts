export interface BookingDetail {
  propertyId: number
  checkInDate: string
  checkOutDate: string
  numberOfPets: number
  selectedRooms: { [key: string]: number }
  roomNames: { [key: string]: string }
}

export interface RoomCategoryBooked {
  id: number;
  name: string;
  roomsBooked: number;
}

export interface PropertyBooked {
  id: number;
  title: string;
  roomCategories: RoomCategoryBooked[];
}

export interface Booking {
  id: number;
  checkInDate: string;
  checkOutDate: string;
  numberOfPets: number;
  totalPrice: number;
  bookingStatus: string;
  property: PropertyBooked;
  createdAt: string;
}

export interface BookingsResponse {
  bookings: Booking[];
}
