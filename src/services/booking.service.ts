import api from './api';

export interface Booking {
  id: string;
  tableId: string;
  startTime: string;
  endTime: string;
  numberOfPlayers: number;
}

export const bookingService = {
  createBooking: async (bookingData: Omit<Booking, 'id'>) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  getUserBookings: async () => {
    const response = await api.get('/bookings');
    return response.data;
  },

  getBookingById: async (bookingId: string) => {
    const response = await api.get(`/bookings/${bookingId}`);
    return response.data;
  },

  updateBooking: async (bookingId: string, updateData: Partial<Booking>) => {
    const response = await api.put(`/bookings/${bookingId}`, updateData);
    return response.data;
  },

  cancelBooking: async (bookingId: string) => {
    const response = await api.delete(`/bookings/${bookingId}`);
    return response.data;
  },

  getAvailableSlots: async (tableId: string, date: string) => {
    const response = await api.get(`/bookings/available-slots?tableId=${tableId}&date=${date}`);
    return response.data;
  },
};
