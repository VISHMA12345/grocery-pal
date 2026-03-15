import axiosClient from './axiosClient';
import { ProductDetail } from './groceryApi';

export type BasketStatus = 'pending' | 'started' | 'completed' | 'cancelled';

export interface Basket {
  _id: string;
  listName: string;
  storeName: string;
  status: BasketStatus;
  productDetails: ProductDetail[];
  itemCount: number;
  createdAt?: string;
}






export const getBaskets = async (payload: string): Promise<{ data: Basket[] }> => {
  const res = await axiosClient.get(`/groceries?converted_to_basket=${payload}`);
  return res.data;
};

export const getBasketById = async (_id: string): Promise<{ data: Basket | undefined }> => {
  const res = await axiosClient.get(`/baskets/${_id}`);
  return res.data;
};

export const createBasket = async (groceryId: string): Promise<{ data: Basket }> => {
  const res = await axiosClient.post(`/groceries/convert/${groceryId}`);
  return res.data;
};

export const updateBasketStatus = async (_id: string, status: BasketStatus): Promise<{ data: Basket }> => {
  const res = await axiosClient.patch(`/basket/complete-all/${_id}`);
  return res.data;
};

export const getActiveList = async (status: string): Promise<{ data: Basket[] }> => {
  const res = await axiosClient.get(`/groceries/activeList/${status}`);
  return res.data;
};

export const basketDetailsId = async (id: string): Promise<{ data: Basket[] }> => {
  const res = await axiosClient.get(`/groceries/${id}`);
  return res.data;
};


export const toggleProductCompletion = async (listId: string, productId: string): Promise<any> => {
  const res = await axiosClient.patch(`/basket/item/complete/${listId}/${productId}`);
  return res.data;
};


export const cancelBasketAPI = async (listId: string): Promise<any> => {
  const res = await axiosClient.patch(`/basket/cancel/${listId}`);
  return res.data;
};


