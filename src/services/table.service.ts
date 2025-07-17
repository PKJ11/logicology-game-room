import api from './api';

export interface Table {
  id: string;
  roomId: string;
  name: string;
  seats: number;
  positionX: number;
  positionY: number;
  positionZ: number;
}

export const tableService = {
  getTableById: async (tableId: string) => {
    const response = await api.get(`/tables/${tableId}`);
    return response.data;
  },

  getTableSeats: async (tableId: string) => {
    const response = await api.get(`/tables/${tableId}/seats`);
    return response.data;
  },

  getAvailableTables: async (params: { gameType?: string; minCapacity?: number }) => {
    const queryString = new URLSearchParams(params as Record<string, string>).toString();
    const response = await api.get(`/tables/available?${queryString}`);
    return response.data;
  },
};
