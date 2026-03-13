import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SplashScreen from "./components/SplashScreen";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CategoryList from "./pages/category/CategoryList";
import CategoryCreate from "./pages/category/CategoryCreate";
import CategoryEdit from "./pages/category/CategoryEdit";
import ProductList from "./pages/product/ProductList";
import ProductCreate from "./pages/product/ProductCreate";
import ProductEdit from "./pages/product/ProductEdit";
import GroceryListPage from "./pages/grocery/GroceryListPage";
import GroceryCreate from "./pages/grocery/GroceryCreate";
import GroceryEdit from "./pages/grocery/GroceryEdit";
import GroceryDetails from "./pages/grocery/GroceryDetails";
import BasketPage from "./pages/basket/BasketPage";
import BasketDetails from "./pages/basket/BasketDetails";
import Profile from "./pages/Profile";
import Users from "./pages/Users";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/categories" element={<CategoryList />} />
          <Route path="/categories/create" element={<CategoryCreate />} />
          <Route path="/categories/edit/:_id" element={<CategoryEdit />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/create" element={<ProductCreate />} />
          <Route path="/products/edit/:_id" element={<ProductEdit />} />
          <Route path="/grocery-lists" element={<GroceryListPage />} />
          <Route path="/grocery-lists/create" element={<GroceryCreate />} />
          <Route path="/grocery-lists/edit/:_id" element={<GroceryEdit />} />
          <Route path="/grocery-lists/:_id" element={<GroceryDetails />} />
          <Route path="/baskets" element={<BasketPage />} />
          <Route path="/baskets/:_id" element={<BasketDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/users" element={<Users />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
