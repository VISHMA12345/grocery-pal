import { create } from 'zustand';
import { Category } from '@/api/categoryApi';
import { Product } from '@/api/productApi';
import { GroceryList, ProductDetail } from '@/api/groceryApi';
import { Basket, BasketStatus } from '@/api/basketApi';
import { Partner } from '@/api/partnerApi';

interface User {
  _id: string;
  email: string;
  name: string;
}

interface AppState {
  // Auth
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;

  // Partner
  partner: Partner | null;
  setPartner: (p: Partner | null) => void;

  // Categories
  categories: Category[];
  setCategories: (c: Category[]) => void;
  addCategory: (c: Category) => void;
  updateCategory: (_id: string, c: Partial<Category>) => void;
  removeCategory: (_id: string) => void;

  // Products
  products: Product[];
  setProducts: (p: Product[]) => void;
  addProduct: (p: Product) => void;
  updateProduct: (_id: string, p: Partial<Product>) => void;
  removeProduct: (_id: string) => void;

  // Grocery Lists
  groceryLists: GroceryList[];
  setGroceryLists: (g: GroceryList[]) => void;
  addGroceryList: (g: GroceryList) => void;
  updateGroceryList: (_id: string, g: Partial<GroceryList>) => void;
  removeGroceryList: (_id: string) => void;

  // Baskets
  baskets: Basket[];
  setBaskets: (b: Basket[]) => void;
  addBasket: (b: Basket) => void;
  updateBasketStatus: (_id: string, status: BasketStatus) => void;
  toggleBasketItem: (basketId: string, productId: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  token: null,
  setAuth: (user, token) => {
    localStorage.setItem('token', token);
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, partner: null });
  },

  partner: null,
  setPartner: (partner) => set({ partner }),

  categories: [],
  setCategories: (categories) => set({ categories }),
  addCategory: (c) => set((s) => ({ categories: [...s.categories, c] })),
  updateCategory: (_id, c) => set((s) => ({ categories: s.categories.map((cat) => (cat._id === _id ? { ...cat, ...c } : cat)) })),
  removeCategory: (_id) => set((s) => ({ categories: s.categories.filter((c) => c._id !== _id) })),

  products: [],
  setProducts: (products) => set({ products }),
  addProduct: (p) => set((s) => ({ products: [...s.products, p] })),
  updateProduct: (_id, p) => set((s) => ({ products: s.products.map((prod) => (prod._id === _id ? { ...prod, ...p } : prod)) })),
  removeProduct: (_id) => set((s) => ({ products: s.products.filter((p) => p._id !== _id) })),

  groceryLists: [],
  setGroceryLists: (groceryLists) => set({ groceryLists }),
  addGroceryList: (g) => set((s) => ({ groceryLists: [...s.groceryLists, g] })),
  updateGroceryList: (_id, g) => set((s) => ({ groceryLists: s.groceryLists.map((gl) => (gl._id === _id ? { ...gl, ...g } : gl)) })),
  removeGroceryList: (_id) => set((s) => ({ groceryLists: s.groceryLists.filter((g) => g._id !== _id) })),

  baskets: [],
  setBaskets: (baskets) => set({ baskets }),
  addBasket: (b) => set((s) => ({ baskets: [...s.baskets, b] })),
  updateBasketStatus: (_id, status) => set((s) => ({ baskets: s.baskets.map((b) => (b._id === _id ? { ...b, status } : b)) })),
  toggleBasketItem: (basketId, productId) =>
    set((s) => ({
      baskets: s.baskets.map((b) =>
        b._id === basketId
          ? { ...b, productDetails: b.productDetails.map((i) => (i.productId === productId ? { ...i } : i)) }
          : b
      ),
    })),
}));

