import axiosClient from "./axiosClient";

export interface ProductImage {
  path: string;
  fileName?: string;
  originalName?: string;
}

export interface ProductDetail {
  productId: string;
  name?: string;
  description?: string;
  images?: ProductImage[];
  price?: number;
  quantity: number;
  unit: string;
  assignedTo?: string;
  isCompleted?: number;
  mrp?: number;
  stock?: number;
}

export interface GroceryList {
  _id: string;
  listName: string;
  storeName: string;
  createdAt: string;
  itemCount: number;
  items: ProductDetail[];
  converted_to_basket: boolean;
}

const dummyLists: GroceryList[] = [
  {
    _id: '1', listName: 'Weekly Shopping', storeName: 'FreshMart',
    createdAt: new Date().toISOString(), itemCount: 2,
    items: [
      { productId: '1', name: 'Apple', description: 'Fresh red apples', images: [], quantity: 6, unit: 'pcs' },
      { productId: '4', name: 'Milk', description: 'Whole milk', images: [], quantity: 2, unit: 'ltr' },
    ],
    converted_to_basket: false,
  },
  {
    _id: '2', listName: 'Party Shopping', storeName: 'SuperStore',
    createdAt: new Date().toISOString(), itemCount: 1,
    items: [
      { productId: '5', name: 'Bread', description: 'Whole wheat bread', images: [], quantity: 3, unit: 'loaf' },
    ],
    converted_to_basket: false,
  },
];


export const convertToBasketWithId = async (id: string): Promise<{ data: GroceryList[] }> => {
  const res = await axiosClient.patch(`/groceries/convert/${id}`);
  return res.data;
};

export const getGroceryLists = async (): Promise<GroceryList[]> => {
  const res = await axiosClient.get('/groceries');
  return res.data.data || res.data;
};

export const getGroceryListById = async (_id: string): Promise<GroceryList> => {
  const res = await axiosClient.get(`/groceries/${_id}`);
  return res.data.data || res.data;
};

export const createGroceryList = async (g: Omit<GroceryList, '_id' | 'converted_to_basket'>): Promise<{ data: GroceryList }> => {
  const res = await axiosClient.post('/groceries', g);
  return res.data;
  // return { data: { ...g, _id: Date.now().toString(), converted_to_basket: false } };
};

export const updateGroceryList = async (_id: string, g: Partial<GroceryList>): Promise<{ data: GroceryList }> => {
  const res = await axiosClient.put(`/groceries/${_id}`, g);
  return res.data;
  // return { data: { _id, listName: g.listName || '', storeName: g.storeName || '', items: g.items || [], converted_to_basket: g.converted_to_basket || false } };
};

export const deleteGroceryList = async (_id: string) => {
  const res = await axiosClient.delete(`/groceries/${_id}`);
  return res.data;
  // return { data: { success: true } };
};

