export interface Partner {
  _id: string;
  name: string;
  email: string;
}
import axiosClient from './axiosClient';

const dummyUsers: Partner[] = [
  { _id: '2', name: 'Jane Smith', email: 'jane@example.com' },
  { _id: '3', name: 'Bob Wilson', email: 'bob@example.com' },
  { _id: '4', name: 'Alice Brown', email: 'alice@example.com' },
];

export const getAllUsers = async (): Promise<{ data: Partner[] }> => {
  const response = await axiosClient.get('/users');
  return response.data;
};

export const selectPartner = async (partnerId: string): Promise<{ data: Partner | undefined }> => {
  const response = await axiosClient.get(`/users/${partnerId}`);
  return response.data;
};


export const sendRequest = async (data: { partnerId: string }): Promise<any> => {
  const response = await axiosClient.post('/partners/', data);
  return response.data;
};

export const partnerDetail = async (): Promise<{ data: Partner[] }> => {
  const response = await axiosClient.get('/partners/');
  return response.data;
};

export const acceptPartner = async (requestId: string): Promise<any> => {
  const response = await axiosClient.patch(`/partners/status/${requestId}`);
  return response.data;
};    