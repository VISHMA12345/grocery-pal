export interface Product {
  _id: string;
  name: string;
  categoryId: string;
  description: string;
  qty: number;
  unit: string;
  price?: number;
}
import axiosClient from './axiosClient';



const dummyProducts: Product[] = [
  { _id: '1', name: 'Apple', categoryId: '1', description: 'Red apple', qty: 6, unit: 'pcs', price: 2.5 },
  { _id: '2', name: 'Banana', categoryId: '1', description: 'Yellow banana', qty: 1, unit: 'bunch', price: 1.2 },
  { _id: '3', name: 'Broccoli', categoryId: '2', description: 'Fresh broccoli', qty: 1, unit: 'pcs', price: 3.0 },
  { _id: '4', name: 'Milk', categoryId: '3', description: 'Whole milk', qty: 1, unit: 'ltr', price: 4.5 },
  { _id: '5', name: 'Bread', categoryId: '4', description: 'Whole wheat bread', qty: 1, unit: 'loaf', price: 3.5 },
  { _id: '6', name: 'Chicken Breast', categoryId: '6', description: 'Boneless chicken', qty: 1, unit: 'kg', price: 12.0 },
];

export const getProducts = async (params?: { categoryId?: string }): Promise<{ data: Product[] }> => {
  const res = await axiosClient.get('/products', { params });
  return res.data;
};

export const getProductById = async (_id: string): Promise<{ data: Product | undefined }> => {
  const res = await axiosClient.get(`/products/${_id}`);
  return res.data;
};

export const createProduct = async (p: Omit<Product, '_id'>): Promise<{ data: Product }> => {
  const res = await axiosClient.post('/products', p);
  return res.data;
};

export const updateProductDetails = async (_id: string, p: Partial<Product>): Promise<{ data: Product }> => {
  const res = await axiosClient.patch(`/products/${_id}`, p);
  return res.data;
};

export const deleteProduct = async (_id: string) => {
  const res = await axiosClient.delete(`/products/${_id}`);
  return res.data;
};

