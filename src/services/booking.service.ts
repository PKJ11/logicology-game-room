import api from './api';

export interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
}

export interface Booking {
  _id: string;
  tableId: string;
  userId: string;
  startTime: string;
  endTime: string;
  numberOfPlayers: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingDto {
  tableId: string;
  startTime: string;
  endTime: string;
  numberOfPlayers: number;
  seatId?: string;
}

export interface UpdateBookingDto {
  startTime?: string;
  endTime?: string;
  numberOfPlayers?: number;
  status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
}

export const bookingService = {
  createBooking: async (bookingData: CreateBookingDto) => {
    const response = await api.post<Booking>('/bookings', bookingData);
    return response.data;
  },

  getUserBookings: async () => {
    const response = await api.get<Booking[]>('/bookings');
    return response.data;
  },

  getBookingById: async (bookingId: string) => {
    const response = await api.get<Booking>(`/bookings/${bookingId}`);
    return response.data;
  },

  updateBooking: async (bookingId: string, updateData: UpdateBookingDto) => {
    const response = await api.put<Booking>(`/bookings/${bookingId}`, updateData);
    return response.data;
  },

  cancelBooking: async (bookingId: string) => {
    const response = await api.delete<{ success: boolean }>(`/bookings/${bookingId}`);
    return response.data;
  },

  getAvailableSlots: async (tableId: string, date: string) => {
    const response = await api.get<TimeSlot[]>(
      `/bookings/available-slots?tableId=${tableId}&date=${date}`
    );
    return response.data;
  },
};
