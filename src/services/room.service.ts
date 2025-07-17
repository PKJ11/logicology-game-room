import api from './api';

export interface Room {
  _id: string;
  name: string;
  capacity: number;
  description: string;
  status: 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE';
  amenities: string[];
  openingTime: string;
  closingTime: string;
  tables: Array<{
    _id: string;
    type: string;
    seats: number;
  }>;
}

export interface RoomAvailability {
  roomId: string;
  name: string;
  totalTables: number;
  availableTables: number;
  availabilityPercentage: number;
  openingTime: string;
  closingTime: string;
}

export interface AvailabilityResponse {
  date: string;
  totalAvailableSeats: number;
  rooms: RoomAvailability[];
}

export const roomService = {
  getAllRooms: async () => {
    const response = await api.get('/rooms');
    return response.data;
  },

  getRoomById: async (roomId: string) => {
    const response = await api.get(`/rooms/${roomId}`);
    return response.data;
  },

  getRoomAvailability: async (date: string): Promise<RoomAvailability[]> => {
    const response = await api.get(`/rooms/availability?date=${date}`);
    return response.data;
  },

  getRoomTables: async (roomId: string) => {
    const response = await api.get(`/rooms/${roomId}/tables`);
    return response.data;
  },
};
