import { createAxiosWithAuth } from '../functions';
import { IFetchUserDetails, IUserDataToUpdate } from './types';

export const fetchUserDetailsAPI = async (initDataRaw: string | undefined) => {
  if (!initDataRaw) {
    throw new Error('Not enough authorization data or no course data');
  }
  const axiosWithAuth = createAxiosWithAuth(initDataRaw);
  const response = await axiosWithAuth.get<IFetchUserDetails>('/user');
  return response.data;
};

export const saveDataAndGenerateCodeAPI = async (
  initDataRaw: string | undefined,
  dto: IUserDataToUpdate
) => {
  if (!initDataRaw) {
    throw new Error('Not enough authorization data or no course data');
  }
  const axiosWithAuth = createAxiosWithAuth(initDataRaw);
  const response = await axiosWithAuth.patch(`/user`, dto);
  return response.data;
};

export const sendCodeFromUserAPI = async (
  initDataRaw: string | undefined,
  code: string
) => {
  if (!initDataRaw) {
    throw new Error('Not enough authorization data or no course data');
  }
  const axiosWithAuth = createAxiosWithAuth(initDataRaw);
  const response = await axiosWithAuth.post(`/user/email/code/${code}`);
  return response.data;
};

export const resendCodeAPI = async (initDataRaw: string | undefined) => {
  if (!initDataRaw) {
    throw new Error('Not enough authorization data or no course data');
  }
  const axiosWithAuth = createAxiosWithAuth(initDataRaw);
  const response = await axiosWithAuth.post(`/user/email/code/resend`);
  return response.data;
};
