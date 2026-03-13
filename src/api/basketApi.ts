import axiosClient from './axiosClient';
import { ProductDetail } from './groceryApi';

export type BasketStatus = 'started' | 'completed' | 'cancelled';

export interface Basket {
  _id: string;
  listName: string;
  storeName: string;
  status: BasketStatus;
  productDetails: ProductDetail[];
  itemCount: number;
  createdAt?: string;
}

const dummyBaskets: Basket[] = [
  {
    _id: '1', listName: 'Weekly Shopping', storeName: 'FreshMart', status: 'started',
    itemCount: 2,
    productDetails: [
      { _id: '1', name: 'Apple', description: 'Fresh red apples', images: [], qty: 6, unit: 'pcs' },
      { _id: '4', name: 'Milk', description: 'Whole milk', images: [], qty: 2, unit: 'ltr' },
    ],
  },
];


// /api/groceries/convert/69ae71ec10348a27ae18f1a9


export const getBaskets = async (payload: string): Promise<{ data: Basket[] }> => {
  const res = await axiosClient.get(`/groceries?converted_to_basket=${payload}`);
  return res.data;
  // return { data: dummyBaskets };
};

export const getBasketById = async (_id: string): Promise<{ data: Basket | undefined }> => {
  const res = await axiosClient.get(`/baskets/${_id}`);
  return res.data;
  // return { data: dummyBaskets.find((b) => b._id === _id) };
};

export const createBasket = async (groceryId: string): Promise<{ data: Basket }> => {
  const res = await axiosClient.post(`/groceries/convert/${groceryId}`);
  return res.data;
  // return { data: { _id: Date.now().toString(), grocery_id: groceryId, listName: groceryName, storeName: storeName, status: 'started', items } };
};

export const updateBasketStatus = async (_id: string, status: BasketStatus): Promise<{ data: Basket }> => {
  const res = await axiosClient.put(`/baskets/${_id}`, { status });
  return res.data;
  // return { data: { _id, grocery_id: '', listName: '', storeName: '', status, items: [] } };
};

