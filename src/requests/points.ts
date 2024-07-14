import { createAxiosWithAuth } from '../functions/axiosWithAuth';

export const fetchPointsAPI = async (initDataRaw: string | undefined) => {
  if (!initDataRaw) {
    throw new Error('Not enough authorization data');
  }
  const axiosWithAuth = createAxiosWithAuth(initDataRaw);
  const response = await axiosWithAuth.get<number>(`/points`);
  return response.data;
};
