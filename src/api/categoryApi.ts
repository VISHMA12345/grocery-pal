import axiosClient from './axiosClient';

export interface Category {
  _id: string;
  name: string;
  icon: string;
  description: string;
}

const dummyCategories: Category[] = [
  { _id: '1', name: 'Fruits', icon: '🍎', description: 'Fresh fruits' },
  { _id: '2', name: 'Vegetables', icon: '🥦', description: 'Fresh vegetables' },
  { _id: '3', name: 'Dairy', icon: '🥛', description: 'Milk, cheese, yogurt' },
  { _id: '4', name: 'Bakery', icon: '🍞', description: 'Bread and pastries' },
  { _id: '5', name: 'Snacks', icon: '🍫', description: 'Chips, cookies, candy' },
  { _id: '6', name: 'Meat', icon: '🥩', description: 'Fresh meat and poultry' },
];



export const getCategories = async (): Promise<{ data: Category[] }> => {
  const res = await axiosClient.get('/categories');
  return res.data;
};

export const getCategoryById = async (_id: string): Promise<{ data: Category | undefined }> => {
  const res = await axiosClient.get(`/categories/${_id}`);
  return res.data;
};

export const createCategory = async (cat: Omit<Category, '_id'>): Promise<{ data: Category }> => {
  const res = await axiosClient.post('/categories', cat);
  return res.data;
};

export const updateCategory = async (_id: string, cat: Partial<Category>): Promise<{ data: Category }> => {
  const res = await axiosClient.patch(`/categories/${_id}`, cat);
  return res.data;
};

export const deleteCategory = async (_id: string) => {
  const res = await axiosClient.delete(`/categories/${_id}`);
  return res.data;
};

