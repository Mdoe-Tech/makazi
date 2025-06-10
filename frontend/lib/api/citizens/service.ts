import { apiClientInstance } from '../client';

export const citizenService = {
  async getCitizen(id: string) {
    const response = await apiClientInstance.get(`/citizens/${id}`);
    return response.data;
  }
}; 