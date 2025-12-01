export interface BookingDetail {
  propertyId: number
  checkInDate: string
  checkOutDate: string
  numberOfPets: number
  selectedRooms: { [key: string]: number }
  roomNames: { [key: string]: string }
}
