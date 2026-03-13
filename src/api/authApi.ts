import axiosClient from './axiosClient';

export const loginUser = async (email: string, password: string) => {
  return (await axiosClient.post('/auth/login', { email, password })).data
};

export const signupUser = async (name: string, email: string, password: string, phoneNumber: string) => {
  return (await axiosClient.post('/users', {
    name,
    email,
    phoneNumber,
    password,
    isActive: 1
  })).data
};
